import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Card from '../common/Card';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import doctorService from '../../services/doctorService';
import { ipfsUrl } from '../../utils/ipfs';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { /* no-op */ }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg border border-red-300 text-red-700 bg-red-50">
          Something went wrong while rendering this view.
        </div>
      );
    }
    return this.props.children;
  }
}

const MyPatients = ({ onViewHistory }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastVisit');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // History modal state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [historyPatient, setHistoryPatient] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);

  // New Record modal state
  const [recordOpen, setRecordOpen] = useState(false);
  const [recordFor, setRecordFor] = useState(null);
  const [recordSubmitting, setRecordSubmitting] = useState(false);
  const [recordError, setRecordError] = useState('');
  const [form, setForm] = useState({ diagnosis: '', symptoms: '', prescription: '', treatmentPlan: '', ipfsHash: '' });

  // Temporary import validity logging to catch invalid element type errors
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('[MyPatients] Imported components', { Card: !!Card, Button: !!Button, SearchBar: !!SearchBar });
  }, []);

  // Load real on-chain patients for the connected doctor
  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await doctorService.getMyPatients();
      const normalized = (res?.patients || []).map((p, idx) => {
        const fullName = p.name || '';
        const firstName = fullName.split(' ')[0] || fullName || (p.walletAddress?.slice(0,6) + '...');
        const lastName = fullName.split(' ').slice(1).join(' ');
        return {
          id: p.walletAddress || String(idx),
          walletAddress: p.walletAddress,
          firstName,
          lastName,
          patientId: p.walletAddress ? `${p.walletAddress.slice(0,6)}...${p.walletAddress.slice(-4)}` : '—',
          email: '',
          phone: '',
          dateOfBirth: p.dateOfBirth || '',
          gender: '',
          bloodType: p.bloodGroup || '—',
          lastVisitDate: p.lastVisitDate || '',
          totalRecords: Number(p.totalRecords || 0),
          status: p.isActive ? 'Active' : 'Inactive',
          nextAppointment: null,
        };
      });
      setPatients(normalized);
      setFilteredPatients(normalized);
    } catch (e) {
      setError(e?.message || 'Failed to load patients');
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchPatients().catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleViewHistory = async (patient) => {
    setHistoryPatient(patient);
    setHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await doctorService.getPatientHistory(patient.walletAddress);
      setHistoryRecords((res?.records || []).map(r => ({
        id: r.id,
        date: r.date,
        diagnosis: r.diagnosis,
        prescription: r.prescription,
        treatmentPlan: r.treatmentPlan,
        ipfsHash: r.ipfsHash,
        doctorAddress: r.doctorAddress,
      })));
    } catch (e) {
      setHistoryError(e?.message || 'Failed to load history');
      setHistoryRecords([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenRecord = (patient) => {
    setRecordFor(patient);
    setForm({ diagnosis: '', symptoms: '', prescription: '', treatmentPlan: '', ipfsHash: '' });
    setRecordError('');
    setRecordOpen(true);
  };

  const submitRecord = async (e) => {
    e?.preventDefault?.();
    if (!recordFor) return;
    setRecordSubmitting(true);
    setRecordError('');
    try {
      const payload = {
        diagnosis: form.diagnosis,
        symptoms: form.symptoms ? form.symptoms.split(',').map(s => s.trim()).filter(Boolean) : [],
        prescription: form.prescription,
        treatmentPlan: form.treatmentPlan,
        ipfsHash: form.ipfsHash,
      };
      const res = await doctorService.createRecord(recordFor.walletAddress, payload, []);
      if (res?.success) {
        // Refresh patients and, if history modal for same patient is open, refresh it too
        await fetchPatients();
        if (historyOpen && historyPatient && historyPatient.walletAddress === recordFor.walletAddress) {
          await handleViewHistory(historyPatient);
        }
        setRecordOpen(false);
      }
    } catch (e) {
      setRecordError(e?.message || 'Failed to create record');
    } finally {
      setRecordSubmitting(false);
    }
  };

  useEffect(() => {
    let filtered = patients;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery)
      );
    }

    // Sort patients
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'lastVisit':
          aValue = new Date(a.lastVisitDate);
          bValue = new Date(b.lastVisitDate);
          break;
        case 'records':
          aValue = a.totalRecords;
          bValue = b.totalRecords;
          break;
        case 'nextAppointment':
          aValue = a.nextAppointment ? new Date(a.nextAppointment) : new Date('2099-12-31');
          bValue = b.nextAppointment ? new Date(b.nextAppointment) : new Date('2099-12-31');
          break;
        default:
          aValue = a.lastVisitDate;
          bValue = b.lastVisitDate;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPatients(filtered);
  }, [patients, searchQuery, sortBy, sortOrder]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getBloodTypeBadge = (bloodType) => {
    const bloodTypeColors = {
      'O+': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'O-': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'A+': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'A-': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'B+': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'B-': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'AB+': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'AB-': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bloodTypeColors[bloodType] || 'bg-gray-100 text-gray-800'}`}>
        {bloodType}
      </span>
    );
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      {/* Search and Sort */}
      <Card>
        <Card.Body>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Search patients by name, ID, email, or phone..."
                onSearch={handleSearch}
                onClear={handleClearSearch}
                value={searchQuery}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="lastVisit">Last Visit</option>
                  <option value="name">Name</option>
                  <option value="records">Records Count</option>
                  <option value="nextAppointment">Next Appointment</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* History Modal */}
      <Modal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={historyPatient ? `History: ${historyPatient.firstName} ${historyPatient.lastName}` : 'Patient History'}
        size="xl"
      >
        {historyLoading && <p className="text-sm text-gray-500">Loading history...</p>}
        {historyError && !historyLoading && <p className="text-sm text-red-600">{historyError}</p>}
        {!historyLoading && !historyError && (
          <div className="space-y-4">
            {historyRecords.length === 0 && (
              <p className="text-sm text-gray-500">No records for this patient.</p>
            )}
            {historyRecords.map(r => (
              <div key={r.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">{r.date}</div>
                  <div className="text-xs font-mono">{r.id}</div>
                </div>
                <div className="mt-2 text-sm">
                  <div><span className="font-medium">Diagnosis:</span> {r.diagnosis || '—'}</div>
                  <div><span className="font-medium">Prescription:</span> {r.prescription || '—'}</div>
                  <div><span className="font-medium">Treatment:</span> {r.treatmentPlan || '—'}</div>
                  <div className="mt-2">
                    <span className="font-medium">Documents:</span>
                    {(() => {
                      if (!r.ipfsHash) return <span> —</span>;
                      let cids = [];
                      try {
                        if (typeof r.ipfsHash === 'string' && (r.ipfsHash.trim().startsWith('[') || r.ipfsHash.trim().startsWith('{'))) {
                          const parsed = JSON.parse(r.ipfsHash);
                          if (Array.isArray(parsed)) cids = parsed;
                          else if (parsed && typeof parsed === 'object') cids = Object.values(parsed);
                        } else if (typeof r.ipfsHash === 'string') {
                          cids = [r.ipfsHash];
                        } else if (Array.isArray(r.ipfsHash)) {
                          cids = r.ipfsHash;
                        }
                      } catch {
                        cids = [String(r.ipfsHash)];
                      }
                      cids = (cids || []).filter(Boolean);
                      if (cids.length === 0) return <span> —</span>;
                      return (
                        <div className="mt-1 space-y-1">
                          {cids.map((cid, idx) => (
                            <div key={`${r.id}-cid-${idx}`}>
                              <a className="text-blue-600 hover:underline break-all" href={ipfsUrl(cid)} target="_blank" rel="noreferrer">
                                Document {idx + 1}
                              </a>
                              <span className="ml-2 text-xs text-gray-500 font-mono">{cid}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* New Record Modal */}
      <Modal
        isOpen={recordOpen}
        onClose={() => setRecordOpen(false)}
        title={recordFor ? `New Record for ${recordFor.firstName} ${recordFor.lastName}` : 'New Record'}
        size="lg"
      >
        <form onSubmit={submitRecord} className="space-y-4">
          {recordError && <div className="text-sm text-red-600">{recordError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosis</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800" value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Symptoms (comma separated)</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800" value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prescription</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800" value={form.prescription} onChange={e => setForm({ ...form, prescription: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Treatment Plan</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800" value={form.treatmentPlan} onChange={e => setForm({ ...form, treatmentPlan: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">IPFS Hash</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800" value={form.ipfsHash} onChange={e => setForm({ ...form, ipfsHash: e.target.value })} required />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setRecordOpen(false)}>Cancel</Button>
            <Button type="submit" loading={recordSubmitting}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Patients Grid */}
      {loading && (
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Loading patients...</p>
          </Card.Body>
        </Card>
      )}
      {error && !loading && (
        <Card>
          <Card.Body>
            <p className="text-sm text-red-600">{error}</p>
          </Card.Body>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow duration-300">
            <Card.Body>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {patient.patientId}
                    </p>
                  </div>
                </div>
                {getBloodTypeBadge(patient.bloodType)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>{patient.email || '—'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{patient.phone || '—'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)} years old` : '—'}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Last Visit</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {patient.lastVisitDate ? formatDate(patient.lastVisitDate) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Records</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {patient.totalRecords}
                    </p>
                  </div>
                </div>
              </div>

              {patient.nextAppointment && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      Next Appointment: {formatDate(patient.nextAppointment)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewHistory(patient)}
                  icon={<DocumentTextIcon className="w-4 h-4" />}
                  className="flex-1"
                >
                  View History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenRecord(patient)}
                  icon={<DocumentTextIcon className="w-4 h-4" />}
                >
                  New Record
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No patients found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search criteria.'
                  : 'No patients are currently assigned to you.'
                }
              </p>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Summary Stats */}
      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredPatients.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Patients
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filteredPatients.filter(p => p.nextAppointment).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upcoming Appointments
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {filteredPatients.reduce((sum, p) => sum + p.totalRecords, 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Records
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {filteredPatients.filter(p => {
                  const lastVisit = new Date(p.lastVisitDate);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return lastVisit >= thirtyDaysAgo;
                }).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active (30 days)
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
    </ErrorBoundary>
  );
};

export default MyPatients;
