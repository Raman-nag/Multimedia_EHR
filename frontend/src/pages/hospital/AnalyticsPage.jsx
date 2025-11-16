import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import hospitalService from '../../services/hospitalService';
import { getProvider } from '../../utils/web3';

const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState({ doctors: 0, patients: 0, records: 0, access: { granted: 0, pending: 0, rejected: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const m = await hospitalService.getHospitalMetrics();
        if (mounted) setMetrics(m);
      } catch (e) {
        if (mounted) setError(e?.message || 'Failed to load analytics');
      } finally { if (mounted) setLoading(false); }
    };
    load();
    const provider = getProvider();
    const onBlock = () => load();
    provider?.on?.('block', onBlock);
    return () => { mounted = false; provider?.off?.('block', onBlock); };
  }, []);

  const totalRequests = Math.max(1, (metrics.access.granted || 0) + (metrics.access.pending || 0) + (metrics.access.rejected || 0));
  const pct = (n) => Math.round(((n || 0) / totalRequests) * 100);

  return (
    <DashboardLayout userRole="hospital">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Hospital Analytics</h1>

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Doctors</div>
            <div className="text-3xl font-semibold">{loading ? '—' : metrics.doctors}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Patients</div>
            <div className="text-3xl font-semibold">{loading ? '—' : metrics.patients}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Medical Records</div>
            <div className="text-3xl font-semibold">{loading ? '—' : metrics.records}</div>
          </div>
        </div>

        {/* Access requests breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold">Access Requests</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Granted</span>
                <span>{pct(metrics.access.granted)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded">
                <div className="h-2 bg-green-500 rounded" style={{ width: `${pct(metrics.access.granted)}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{metrics.access.granted} of {totalRequests}</div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Pending</span>
                <span>{pct(metrics.access.pending)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded">
                <div className="h-2 bg-yellow-500 rounded" style={{ width: `${pct(metrics.access.pending)}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{metrics.access.pending} of {totalRequests}</div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Rejected</span>
                <span>{pct(metrics.access.rejected)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded">
                <div className="h-2 bg-red-500 rounded" style={{ width: `${pct(metrics.access.rejected)}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{metrics.access.rejected} of {totalRequests}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;