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

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  // Mock data - replace with actual API calls
  const mockDoctors = [
    {
      id: 'doc_001',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@citygeneral.com',
      phone: '+1 (555) 234-5678',
      specialty: 'Cardiology',
      licenseNumber: 'MD-2024-001',
      walletAddress: '0x8ba1f109551bD432803012645Hac136c',
      status: 'Active',
      totalPatients: 89,
      totalRecords: 234,
      experience: 12,
      rating: 4.9,
      joinDate: '2023-01-15'
    },
    {
      id: 'doc_002',
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      email: 'michael.chen@citygeneral.com',
      phone: '+1 (555) 345-6789',
      specialty: 'Neurology',
      licenseNumber: 'MD-2024-002',
      walletAddress: '0x9ba1f109551bD432803012645Hac136d',
      status: 'Active',
      totalPatients: 67,
      totalRecords: 189,
      experience: 8,
      rating: 4.7,
      joinDate: '2023-03-20'
    },
    {
      id: 'doc_003',
      firstName: 'Dr. Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@citygeneral.com',
      phone: '+1 (555) 456-7890',
      specialty: 'Pediatrics',
      licenseNumber: 'MD-2024-003',
      walletAddress: '0xaba1f109551bD432803012645Hac136e',
      status: 'Inactive',
      totalPatients: 45,
      totalRecords: 123,
      experience: 6,
      rating: 4.8,
      joinDate: '2023-06-10'
    },
    {
      id: 'doc_004',
      firstName: 'Dr. James',
      lastName: 'Wilson',
      email: 'james.wilson@citygeneral.com',
      phone: '+1 (555) 567-8901',
      specialty: 'Orthopedics',
      licenseNumber: 'MD-2024-004',
      walletAddress: '0xbba1f109551bD432803012645Hac136f',
      status: 'Active',
      totalPatients: 78,
      totalRecords: 201,
      experience: 15,
      rating: 4.9,
      joinDate: '2022-11-05'
    }
  ];

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
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  useEffect(() => {
    let filtered = doctors;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
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
                {filteredDoctors.map((doctor) => (
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
                            {doctor.firstName} {doctor.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {doctor.email}
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
                          View
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

            {filteredDoctors.length === 0 && (
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
        size="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDoctor.firstName} {selectedDoctor.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDoctor.specialty}
                </p>
                {getStatusBadge(selectedDoctor.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedDoctor.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedDoctor.phone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  License Number
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedDoctor.licenseNumber}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedDoctor.experience} years
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Wallet Address
                </label>
                <p className="text-sm text-gray-900 dark:text-white font-mono">
                  {selectedDoctor.walletAddress}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Patients
                </label>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedDoctor.totalPatients}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Records
                </label>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {selectedDoctor.totalRecords}
                </p>
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
