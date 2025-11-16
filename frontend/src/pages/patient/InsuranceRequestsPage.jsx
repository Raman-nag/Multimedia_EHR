import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getProvider } from '../../utils/web3';
import { getEMRSystemContract } from '../../utils/contract';
import insuranceService from '../../services/insuranceService';
import patientService from '../../services/patientService';
import { ShieldCheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../contexts/ToastContext';

const InsuranceRequestsPage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [networkStatus, setNetworkStatus] = useState('connecting');
  const [companies, setCompanies] = useState([]); // {wallet,name,registrationNumber,active}
  const [applications, setApplications] = useState({}); // insurer -> app
  const [selectedInsurer, setSelectedInsurer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const { showSuccess, showError, showInfo } = useToast();

  const loadBase = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = getProvider();
      if (!provider) throw new Error('Wallet provider not available');
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setNetworkStatus('connected');

      const emr = await getEMRSystemContract();
      const wallets = await emr.getInsuranceAdminList();

      const rows = [];
      for (const w of wallets) {
        try {
          const p = await emr.insuranceAdmins(w);
          if (!p.active) continue;
          rows.push({ wallet: w, name: p.name, registrationNumber: p.registrationNumber, active: p.active });
        } catch {}
      }
      setCompanies(rows);

      const appsArr = await insuranceService.getPatientApplications(address).catch(() => []);
      const map = {};
      for (const ap of appsArr || []) {
        if (!ap.insurer) continue;
        map[String(ap.insurer).toLowerCase()] = ap;
      }
      setApplications(map);
    } catch (e) {
      setError(e?.message || 'Failed to load insurance requests');
      setNetworkStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    loadBase();
    const provider = getProvider();
    const onBlock = () => mounted && loadBase();
    provider?.on?.('block', onBlock);
    return () => {
      mounted = false;
      provider?.off?.('block', onBlock);
    };
  }, []);

  const statusInfo = (statusNum) => {
    const s = Number(statusNum || 0);
    if (s === 1) return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    if (s === 2) return { label: 'Granted', color: 'bg-green-100 text-green-800' };
    if (s === 3) return { label: 'Rejected', color: 'bg-red-100 text-red-800' };
    if (s === 4) return { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' };
    return { label: 'None', color: 'bg-slate-100 text-slate-700' };
  };

  const filteredCompanies = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return companies;
    return companies.filter((c) => {
      return (
        String(c.name || '').toLowerCase().includes(q) ||
        String(c.registrationNumber || '').toLowerCase().includes(q) ||
        String(c.wallet || '').toLowerCase().includes(q)
      );
    });
  }, [companies, search]);

  const onRequest = async (insurer) => {
    if (!insurer) {
      showInfo('Please select an insurance company first');
      return;
    }
    setLoading(true);
    try {
      // 1) Send insurance review request
      await insuranceService.requestReview(insurer);
      // 2) Automatically grant this insurer access to patient records
      await patientService.grantAccess(insurer);
      showSuccess('Request sent and access granted to this insurer');
      await loadBase();
    } catch (e) {
      showError(e?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = async (insurer) => {
    if (!insurer) return;
    setLoading(true);
    try {
      await insuranceService.cancelApplication(insurer, 'Cancelled by patient');
      showSuccess('Application cancelled');
      await loadBase();
    } catch (e) {
      showError(e?.message || 'Failed to cancel request');
    } finally {
      setLoading(false);
    }
  };

  const onRevokeAccess = async (insurer) => {
    if (!insurer) return;
    setLoading(true);
    try {
      await patientService.revokeAccess(insurer);
      showSuccess('Access revoked for this insurer');
    } catch (e) {
      showError(e?.message || 'Failed to revoke access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="patient" userProfile={{}} walletAddress={walletAddress} networkStatus={networkStatus}>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ShieldCheckIcon className="h-6 w-6 text-amber-600" />
                Insurance Requests
              </h1>
              <p className="text-sm text-gray-500">Apply to insurance companies and track your application status in real time.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, registration, or wallet"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-72"
              />
              <select
                value={selectedInsurer}
                onChange={(e) => setSelectedInsurer(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-64"
              >
                <option value="">Select insurer to request</option>
                {companies.map((c) => (
                  <option key={c.wallet} value={c.wallet}>
                    {c.name || 'Insurance'} ({c.wallet.slice(0, 6)}...{c.wallet.slice(-4)})
                  </option>
                ))}
              </select>
              <button
                disabled={loading}
                onClick={() => onRequest(selectedInsurer)}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm disabled:opacity-50"
              >
                {loading ? 'Submitting…' : 'Send Request'}
              </button>
            </div>
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Insurance Companies</h2>
            <span className="text-xs text-gray-500">Connected wallet: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '—'}</span>
          </div>
          <div className="p-6">
            {loading && <div className="text-sm text-gray-500">Loading…</div>}
            {!loading && filteredCompanies.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-500">No active insurance companies found.</div>
            )}
            {!loading && filteredCompanies.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCompanies.map((c) => {
                  const key = String(c.wallet).toLowerCase();
                  const app = applications[key];
                  const info = statusInfo(app?.status);
                  return (
                    <div key={c.wallet} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-gray-900">{c.name || 'Insurance Company'}</div>
                          <div className="text-xs text-gray-500 break-all">{c.wallet}</div>
                          {c.registrationNumber && (
                            <div className="mt-1 text-xs text-gray-500">Reg: {c.registrationNumber}</div>
                          )}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.color}`}>
                          {info.label}
                        </span>
                      </div>
                      {app?.reason && (
                        <div className="text-xs text-gray-600 bg-gray-50 border border-dashed border-gray-200 rounded-md p-2">
                          <span className="font-medium">Note:</span> {app.reason}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-1">
                        <button
                          disabled={loading || info.label === 'Pending'}
                          onClick={() => onRequest(c.wallet)}
                          className="px-3 py-1.5 rounded-md border text-xs bg-amber-50 text-amber-700 disabled:opacity-50"
                        >
                          {info.label === 'Pending' ? 'Request Pending' : 'Send Request'}
                        </button>
                        <button
                          disabled={loading || info.label !== 'Pending'}
                          onClick={() => onCancel(c.wallet)}
                          className="px-3 py-1.5 rounded-md border text-xs bg-gray-50 text-gray-700 disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          <XCircleIcon className="h-4 w-4" />
                          Cancel
                        </button>
                        <button
                          disabled={loading || info.label !== 'Granted'}
                          onClick={() => onRevokeAccess(c.wallet)}
                          className="px-3 py-1.5 rounded-md border text-xs bg-red-50 text-red-700 disabled:opacity-50"
                        >
                          Revoke Access
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InsuranceRequestsPage;
