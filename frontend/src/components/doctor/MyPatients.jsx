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

const MyPatients = ({ onViewHistory }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastVisit');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data - replace with actual API calls
  const mockPatients = [
    {
      id: 'pat_001',
      firstName: 'John',
      lastName: 'Doe',
      patientId: 'PAT-001',
      email: 'john.doe@email.com',
      phone: '+1 (555) 345-6789',
      dateOfBirth: '1985-03-15',
      gender: 'Male',
      bloodType: 'O+',
      lastVisitDate: '2024-03-15',
      totalRecords: 15,
      status: 'Active',
      nextAppointment: '2024-03-25',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 456-7890'
      },
      medicalHistory: [
        {
          id: 'rec_001',
          date: '2024-03-15',
          diagnosis: 'Hypertension',
          type: 'Follow-up'
        },
        {
          id: 'rec_002',
          date: '2024-02-15',
          diagnosis: 'High Blood Pressure',
          type: 'Consultation'
        }
      ]
    },
    {
      id: 'pat_002',
      firstName: 'Alice',
      lastName: 'Smith',
      patientId: 'PAT-002',
      email: 'alice.smith@email.com',
      phone: '+1 (555) 456-7890',
      dateOfBirth: '1990-07-22',
      gender: 'Female',
      bloodType: 'A+',
      lastVisitDate: '2024-03-10',
      totalRecords: 8,
      status: 'Active',
      nextAppointment: '2024-03-28',
      emergencyContact: {
        name: 'Bob Smith',
        relationship: 'Brother',
        phone: '+1 (555) 567-8901'
      },
      medicalHistory: [
        {
          id: 'rec_003',
          date: '2024-03-10',
          diagnosis: 'Migraine',
          type: 'Consultation'
        }
      ]
    },
    {
      id: 'pat_003',
      firstName: 'Robert',
      lastName: 'Johnson',
      patientId: 'PAT-003',
      email: 'robert.johnson@email.com',
      phone: '+1 (555) 567-8901',
      dateOfBirth: '1978-12-05',
      gender: 'Male',
      bloodType: 'B-',
      lastVisitDate: '2024-03-08',
      totalRecords: 23,
      status: 'Active',
      nextAppointment: null,
      emergencyContact: {
        name: 'Mary Johnson',
        relationship: 'Wife',
        phone: '+1 (555) 678-9012'
      },
      medicalHistory: [
        {
          id: 'rec_004',
          date: '2024-03-08',
          diagnosis: 'Diabetes Type 2',
          type: 'Check-up'
        },
        {
          id: 'rec_005',
          date: '2024-01-15',
          diagnosis: 'Diabetes Management',
          type: 'Follow-up'
        }
      ]
    },
    {
      id: 'pat_004',
      firstName: 'Lisa',
      lastName: 'Brown',
      patientId: 'PAT-004',
      email: 'lisa.brown@email.com',
      phone: '+1 (555) 678-9012',
      dateOfBirth: '1992-05-18',
      gender: 'Female',
      bloodType: 'AB+',
      lastVisitDate: '2024-03-05',
      totalRecords: 12,
      status: 'Active',
      nextAppointment: '2024-03-30',
      emergencyContact: {
        name: 'David Brown',
        relationship: 'Father',
        phone: '+1 (555) 789-0123'
      },
      medicalHistory: [
        {
          id: 'rec_006',
          date: '2024-03-05',
          diagnosis: 'Anxiety Disorder',
          type: 'Consultation'
        }
      ]
    }
  ];

  useEffect(() => {
    setPatients(mockPatients);
    setFilteredPatients(mockPatients);
  }, []);

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
    <div className="space-y-6">
      {/* Search and Sort */}
      <Card>
        <Card.Content>
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
        </Card.Content>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow duration-300">
            <Card.Content>
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
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{calculateAge(patient.dateOfBirth)} years old</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Last Visit</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(patient.lastVisitDate)}
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
                  onClick={() => onViewHistory(patient)}
                  icon={<DocumentTextIcon className="w-4 h-4" />}
                  className="flex-1"
                >
                  View History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('Create record for:', patient)}
                  icon={<DocumentTextIcon className="w-4 h-4" />}
                >
                  New Record
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <Card.Content>
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
          </Card.Content>
        </Card>
      )}

      {/* Summary Stats */}
      <Card>
        <Card.Content>
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
        </Card.Content>
      </Card>
    </div>
  );
};

export default MyPatients;
