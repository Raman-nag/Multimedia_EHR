import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hospitalService from '../../services/hospitalService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ensureCorrectNetwork, getProvider, sendTx } from '../../utils/web3';
import { getDoctorContract, getHospitalContract } from '../../utils/contract';

const truncate = (addr = '') => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const DoctorsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [wallet, setWallet] = useState('');
  const [editing, setEditing] = useState(false);
  const [editVals, setEditVals] = useState({ name: '', specialization: '' });
  const [txBusy, setTxBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await hospitalService.getDoctors();
      if (res?.success) {
        setDoctors(res.doctors || []);
      } else {
        setError(res?.message || 'Failed to load doctors');
      }
    } catch (e) {
      setError(e?.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try { const signer = getProvider()?.getSigner?.(); if (signer) setWallet(await signer.getAddress()); } catch {}
    })();
    load();
    const provider = getProvider();
    const onBlock = () => load();
    provider?.on?.('block', onBlock);
    return () => provider?.off?.('block', onBlock);
  }, []);

  const openDetails = async (d) => {
    setSelected(d);
    setDetails(null);
    setDetailsError('');
    setDetailsLoading(true);
    try {
      const res = await hospitalService.getDoctorDetailsWithStats(d.walletAddress);
      if (res?.success) {
        setDetails(res);
        setEditVals({ name: res?.doctor?.name || '', specialization: res?.doctor?.specialization || '' });
      } else {
        setDetailsError(res?.message || 'Failed to load doctor details');
      }
    } catch (e) {
      setDetailsError(e?.message || 'Failed to load doctor details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const onEdit = async () => {
    if (!selected) return;
    setTxBusy(true);
    try {
      await ensureCorrectNetwork();
      const doctor = await getDoctorContract();
      // Only the doctor can update their own profile; this will revert otherwise (by design)
      const tx = await doctor.updateProfile(editVals.name || '', editVals.specialization || '');
      await sendTx(Promise.resolve(tx));
      setEditing(false);
      await openDetails(selected);
      await load();
    } catch (e) {
      setDetailsError(e?.message || 'Edit failed');
    } finally {
      setTxBusy(false);
    }
  };

  const onRevoke = async (d) => {
    if (!d) return;
    setTxBusy(true);
    try {
      await ensureCorrectNetwork();
      // Hospital removes doctor; contract enforces onlyHospital
      await hospitalService.removeDoctor(d.walletAddress);
      await load();
      if (selected && selected.walletAddress === d.walletAddress) {
        await openDetails(d);
      }
    } catch (e) {
      setDetailsError(e?.message || 'Revoke failed');
    } finally {
      setTxBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <Card.Title>Doctors ({doctors.length})</Card.Title>
              <Card.Description>All doctors registered by your hospital</Card.Description>
            </div>
            <Button onClick={() => navigate('/hospital/add-doctor')}>Add Doctor</Button>
          </div>
        </Card.Header>
        <Card.Body>
          {loading && <p className="text-sm text-gray-500">Loading doctors...</p>}
          {error && !loading && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">License</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {doctors.map((d) => (
                    <tr key={d.walletAddress}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {d.name && d.name.trim().length > 0 ? d.name : truncate(d.walletAddress)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {d.specialization || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {d.licenseNumber || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {d.walletAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openDetails(d)}>
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={txBusy || details?.doctor?.isActive === false || (wallet?.toLowerCase?.() !== d.walletAddress?.toLowerCase?.())}
                          onClick={() => { setEditing(true); setSelected(d); setEditVals({ name: details?.doctor?.name || d.name || '', specialization: details?.doctor?.specialization || d.specialization || '' }); }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={txBusy || details?.doctor?.isActive === false}
                          onClick={() => onRevoke(d)}
                        >
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                        No doctors found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Doctor Details"
        size="xl"
      >
        {selected && (
          <div className="space-y-6">
            {detailsLoading && (
              <p className="text-sm text-gray-500">Loading details...</p>
            )}
            {detailsError && !detailsLoading && (
              <div className="text-sm text-red-600">{detailsError}</div>
            )}
            {!detailsLoading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <p className="text-sm text-gray-900 dark:text-white">{(details?.doctor?.name || selected.name) || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialist</label>
                    <p className="text-sm text-gray-900 dark:text-white">{(details?.doctor?.specialization || selected.specialization) || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Doctor ID</label>
                    <p className="text-sm text-gray-900 dark:text-white">{(details?.doctor?.licenseNumber || selected.licenseNumber) || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Wallet Address</label>
                    <p className="text-sm text-gray-900 dark:text-white font-mono">{selected.walletAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hospital</label>
                    <p className="text-sm text-gray-900 dark:text-white font-mono">{details?.doctor?.hospitalAddress || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <p className="text-sm text-gray-900 dark:text-white">{details?.doctor?.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registered At</label>
                    <p className="text-sm text-gray-900 dark:text-white">{details?.doctor?.timestamp ? new Date(details.doctor.timestamp * 1000).toLocaleString() : '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Activity</label>
                    <p className="text-sm text-gray-900 dark:text-white">{details?.stats?.lastRecordAt ? new Date(details.stats.lastRecordAt * 1000).toLocaleString() : '—'}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-xs text-gray-500">Patients</div>
                      <div className="text-xl font-semibold">{details?.stats?.patientsCount ?? '0'}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-xs text-gray-500">Records Created</div>
                      <div className="text-xl font-semibold">{details?.stats?.recordsCount ?? '0'}</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-xs text-gray-500">Prescriptions</div>
                      <div className="text-xl font-semibold">{details?.stats?.prescriptionsCount ?? '0'}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={editing}
        onClose={() => setEditing(false)}
        title="Edit Doctor Profile"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input className="w-full border rounded px-3 py-2" value={editVals.name} onChange={(e)=>setEditVals(v=>({...v, name:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
            <input className="w-full border rounded px-3 py-2" value={editVals.specialization} onChange={(e)=>setEditVals(v=>({...v, specialization:e.target.value}))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={()=>setEditing(false)} disabled={txBusy}>Cancel</Button>
            <Button onClick={onEdit} disabled={txBusy || !selected || (wallet?.toLowerCase?.() !== selected.walletAddress?.toLowerCase?.())}>{txBusy ? 'Saving…' : 'Save'}</Button>
          </div>
          {wallet?.toLowerCase?.() !== selected?.walletAddress?.toLowerCase?.() && (
            <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">Only the doctor can update their profile. Please ask the doctor to sign in and edit.</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DoctorsList;
