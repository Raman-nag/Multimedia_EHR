import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ClockIcon,
  PlusIcon,
  DocumentTextIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Card from '../common/Card';
import Button from '../common/Button';
import CreateRecord from './CreateRecord';
import MyPatients from './MyPatients';
import PatientHistory from './PatientHistory';
import { mockStats, mockUsers } from '../../data/mockData';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateRecordModal, setShowCreateRecordModal] = useState(false);
  const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [appointmentsToday, setAppointmentsToday] = useState([]);
  const [pendingRecords, setPendingRecords] = useState([]);

  // Mock data - replace with actual API calls
  const doctor = mockUsers.doctor;
  const stats = mockStats.doctor;

  useEffect(() => {
    // Simulate recent activity data
    setRecentActivity([
      {
        id: 1,
        type: 'record_created',
        message: 'Created medical record for John Doe',
        timestamp: '2 hours ago',
        icon: '📋',
        patientName: 'John Doe',
        patientId: 'PAT-001'
      },
      {
        id: 2,
        type: 'prescription_issued',
        message: 'Issued prescription for Alice Smith',
        timestamp: '4 hours ago',
        icon: '💊',
        patientName: 'Alice Smith',
        patientId: 'PAT-002'
      },
      {
        id: 3,
        type: 'appointment_completed',
        message: 'Completed appointment with Robert Johnson',
        timestamp: '6 hours ago',
        icon: '✅',
        patientName: 'Robert Johnson',
        patientId: 'PAT-003'
      },
      {
        id: 4,
        type: 'follow_up_scheduled',
        message: 'Scheduled follow-up for Lisa Brown',
        timestamp: '8 hours ago',
        icon: '📅',
        patientName: 'Lisa Brown',
        patientId: 'PAT-004'
      }
    ]);

    // Simulate today's appointments
    setAppointmentsToday([
      {
        id: 1,
        patientName: 'John Doe',
        patientId: 'PAT-001',
        time: '09:00 AM',
        type: 'Follow-up',
        status: 'Scheduled'
      },
      {
        id: 2,
        patientName: 'Alice Smith',
        patientId: 'PAT-002',
        time: '11:30 AM',
        type: 'Consultation',
        status: 'Scheduled'
      },
      {
        id: 3,
        patientName: 'Robert Johnson',
        patientId: 'PAT-003',
        time: '02:00 PM',
        type: 'Check-up',
        status: 'Completed'
      }
    ]);

    // Simulate pending records
    setPendingRecords([
      {
        id: 1,
        patientName: 'John Doe',
        patientId: 'PAT-001',
        visitDate: '2024-03-15',
        type: 'Consultation',
        status: 'Draft'
      },
      {
        id: 2,
        patientName: 'Alice Smith',
        patientId: 'PAT-002',
        visitDate: '2024-03-14',
        type: 'Follow-up',
        status: 'Review'
      }
    ]);
  }, []);

  const handleCreateRecord = () => {
    setShowCreateRecordModal(true);
  };

  const handleCloseCreateRecordModal = () => {
    setShowCreateRecordModal(false);
  };

  const handleRecordCreated = (recordData) => {
    console.log('New record created:', recordData);
    setShowCreateRecordModal(false);
    // Here you would typically refresh the data
  };

  const handleViewPatientHistory = (patient) => {
    setSelectedPatient(patient);
    setShowPatientHistoryModal(true);
  };

  const handleClosePatientHistoryModal = () => {
    setShowPatientHistoryModal(false);
    setSelectedPatient(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'patients', label: 'My Patients', icon: '👥' },
    { id: 'records', label: 'Records', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Doctor Dashboard
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Welcome back, {doctor.firstName} {doctor.lastName} - {doctor.specialty}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Patients Treated
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.totalPatients}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Appointments Today
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {appointmentsToday.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Pending Records
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {pendingRecords.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <ChartBarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Records
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.totalRecords}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Create New Record Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleCreateRecord}
                size="lg"
                className="px-8 py-4 text-lg"
                icon={<PlusIcon className="w-6 h-6" />}
              >
                Create New Record
              </Button>
            </div>

            {/* Today's Appointments */}
            <Card>
              <Card.Header>
                <Card.Title>Today's Appointments</Card.Title>
                <Card.Description>
                  Your scheduled appointments for today
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {appointmentsToday.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.patientName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.type} - {appointment.patientId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.time}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'Completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {appointment.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPatientHistory({ 
                            id: appointment.patientId, 
                            name: appointment.patientName 
                          })}
                        >
                          View History
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Recent Activity Timeline */}
            <Card>
              <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
                <Card.Description>
                  Your recent medical activities and updates
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm">{activity.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                      {index < recentActivity.length - 1 && (
                        <div className="absolute left-4 top-8 w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Pending Records */}
            <Card>
              <Card.Header>
                <Card.Title>Pending Records</Card.Title>
                <Card.Description>
                  Medical records that need your attention
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {pendingRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.patientName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {record.type} - {record.visitDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'Draft' 
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {record.status}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateRecord()}
                        >
                          Complete Record
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* My Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Patients
              </h2>
            </div>
            <MyPatients onViewHistory={handleViewPatientHistory} />
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Medical Records
              </h2>
              <Button
                onClick={handleCreateRecord}
                icon={<PlusIcon className="w-5 h-5" />}
              >
                Create Record
              </Button>
            </div>
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Records Management
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create and manage medical records for your patients.
              </p>
            </div>
          </div>
        )}

        {/* Create Record Modal */}
        <Modal
          isOpen={showCreateRecordModal}
          onClose={handleCloseCreateRecordModal}
          title="Create Medical Record"
          size="4xl"
        >
          <CreateRecord 
            onRecordCreated={handleRecordCreated} 
            onCancel={handleCloseCreateRecordModal} 
          />
        </Modal>

        {/* Patient History Modal */}
        <Modal
          isOpen={showPatientHistoryModal}
          onClose={handleClosePatientHistoryModal}
          title="Patient Medical History"
          size="xl"
        >
          {selectedPatient && (
            <PatientHistory 
              patient={selectedPatient}
              onClose={handleClosePatientHistoryModal}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default DoctorDashboard;
