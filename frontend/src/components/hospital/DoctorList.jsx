import React, { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import Card from '../common/Card';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import hospitalService from '../../services/hospitalService';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [selectedStats, setSelectedStats] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await hospitalService.getDoctors();
        const list = Array.isArray(resp?.doctors) ? resp.doctors : [];
        const normalized = list.map((d, idx) => ({
          id: d.walletAddress || `doc_${idx}`,
          fullName: d.name || '',
          specialty: d.specialization || '',
          licenseNumber: d.licenseNumber || '',
          walletAddress: d.walletAddress,
          status: d.isActive ? 'Active' : 'Inactive',
          totalPatients: 0,
          totalRecords: 0,
        }));
        if (!mounted) return;
        setDoctors(normalized);
        setFilteredDoctors(normalized);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load doctors');
        setDoctors([]);
        setFilteredDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Internal Medicine',
    'Surgery'
  ];

  useEffect(() => {
    let filtered = doctors;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        (doctor.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.status === statusFilter);
    }

    // Specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.specialty === specialtyFilter);
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchQuery, statusFilter, specialtyFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleViewDoctor = async (doctor) => {
    setSelectedDoctor({ ...doctor });
    setSelectedLoading(true);
    setSelectedStats(null);
    try {
      const resp = await hospitalService.getDoctorDetailsWithStats(doctor.walletAddress);
      if (resp?.success) {
        const d = resp.doctor || {};
        const stats = resp.stats || {};
        // Normalize into our modal state
        setSelectedDoctor(prev => ({
          ...(prev || {}),
          fullName: d.name || prev?.fullName || '',
          specialty: d.specialization || prev?.specialty || '',
          licenseNumber: d.licenseNumber || prev?.licenseNumber || '',
          walletAddress: doctor.walletAddress,
          status: (typeof d.isActive === 'boolean' ? (d.isActive ? 'Active' : 'Inactive') : prev?.status) || 'Active',
          registeredAt: d.timestamp ? new Date(Number(d.timestamp) * 1000).toLocaleString() : undefined,
          hospitalAddress: d.hospitalAddress,
        }));
        setSelectedStats({
          patientsCount: stats.patientsCount || 0,
          recordsCount: stats.recordsCount || 0,
          prescriptionsCount: stats.prescriptionsCount || 0,
          lastRecordAt: stats.lastRecordAt ? new Date(Number(stats.lastRecordAt) * 1000).toLocaleString() : undefined,
        });
      }
    } catch (e) {
      // leave basic data
    } finally {
      setSelectedLoading(false);
    }
  };

  const handleEditDoctor = (doctor) => {
    console.log('Edit doctor:', doctor);
    // Implement edit functionality
  };

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const confirmDeleteDoctor = () => {
    if (doctorToDelete) {
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorToDelete.id));
      setShowDeleteModal(false);
      setDoctorToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      Inactive: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status === 'Active' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
        {status === 'Inactive' && <XCircleIcon className="w-3 h-3 mr-1" />}
        {status}
      </span>
    );
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <Card.Content>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Search doctors by name, email, license, or specialty..."
                onSearch={handleSearch}
                onClear={handleClearSearch}
                value={searchQuery}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                icon={<FunnelIcon className="w-4 h-4" />}
              >
                Filters
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialty
                  </label>
                  <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty === 'All Specialties' ? 'all' : specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Doctors Table */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <Card.Title>Doctors ({filteredDoctors.length})</Card.Title>
              <Card.Description>
                Manage hospital doctors and their information
              </Card.Description>
            </div>
          </div>
        </Card.Header>
        
        <Card.Content>
          <div className="overflow-x-auto">
            {loading && (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading doctors...</div>
            )}
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Doctor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    License Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patients
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {!loading && filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {doctor.fullName || '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {doctor.specialty}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {doctor.experience} years exp.
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {doctor.licenseNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {truncateAddress(doctor.walletAddress)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doctor.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {doctor.totalPatients}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {doctor.totalRecords} records
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDoctor(doctor)}
                          icon={<EyeIcon className="w-4 h-4" />}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDoctor(doctor)}
                          icon={<PencilIcon className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDoctor(doctor)}
                          icon={<TrashIcon className="w-4 h-4" />}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No doctors found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery || statusFilter !== 'all' || specialtyFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding a new doctor to the system.'
                  }
                </p>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Doctor Details Modal */}
      <Modal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title="Doctor Details"
        size="4xl"
      >
        {selectedDoctor && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedDoctor.fullName || '—'}
                    </h3>
                    {getStatusBadge(selectedDoctor.status || 'Active')}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedDoctor.specialty || '—'}
                  </p>
                </div>
              </div>
            </div>

            {selectedLoading ? (
              <div className="py-10 text-center text-sm text-gray-500">Loading latest profile…</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="space-y-5">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Profile</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Doctor ID</div>
                      <div className="text-sm text-gray-900 dark:text-white">{selectedDoctor.licenseNumber || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Specialist</div>
                      <div className="text-sm text-gray-900 dark:text-white">{selectedDoctor.specialty || '—'}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Wallet Address</div>
                      <div className="mt-1 flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                        <div className="text-xs sm:text-sm font-mono break-all max-w-full pr-3">{selectedDoctor.walletAddress}</div>
                        <button
                          onClick={() => navigator.clipboard?.writeText?.(selectedDoctor.walletAddress || '')}
                          className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Hospital</div>
                      <div className="mt-1 flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                        <div className="text-xs sm:text-sm font-mono break-all max-w-full pr-3">{selectedDoctor.hospitalAddress || '—'}</div>
                        {selectedDoctor.hospitalAddress && (
                          <button
                            onClick={() => navigator.clipboard?.writeText?.(selectedDoctor.hospitalAddress || '')}
                            className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Section */}
                <div className="space-y-5">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Activity</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Registered At</div>
                      <div className="text-sm text-gray-900 dark:text-white">{selectedDoctor.registeredAt || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Last Activity</div>
                      <div className="text-sm text-gray-900 dark:text-white">{selectedStats?.lastRecordAt || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Status</div>
                      <div className="text-sm text-gray-900 dark:text-white">{selectedDoctor.status || 'Active'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-500">Patients</div>
                <div className="mt-1 text-2xl font-semibold">{selectedStats?.patientsCount ?? 0}</div>
              </div>
              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-500">Records Created</div>
                <div className="mt-1 text-2xl font-semibold">{selectedStats?.recordsCount ?? 0}</div>
              </div>
              <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-500">Prescriptions</div>
                <div className="mt-1 text-2xl font-semibold">{selectedStats?.prescriptionsCount ?? 0}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal.Confirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteDoctor}
        title="Delete Doctor"
        message={`Are you sure you want to remove ${doctorToDelete?.firstName} ${doctorToDelete?.lastName} from the hospital? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default DoctorList;
