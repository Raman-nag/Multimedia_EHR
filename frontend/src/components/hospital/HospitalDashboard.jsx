import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  UserIcon, 
  ClockIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Card from '../common/Card';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import AddDoctor from './AddDoctor';
import DoctorList from './DoctorList';
import PatientList from './PatientList';
import hospitalService from '../../services/hospitalService';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalRecords: 0, successRate: 100 });
  const [hospital, setHospital] = useState({ name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [details, activity] = await Promise.all([
          hospitalService.getHospitalDetails().catch(() => null),
          hospitalService.getRecentActivity().catch(() => ({ activities: [], stats: { totalDoctors: 0, totalPatients: 0, totalRecords: 0 } })),
        ]);
        if (!mounted) return;
        if (details && details.hospital) setHospital(details.hospital);
        if (activity) {
          setRecentActivity(activity.activities || []);
          setStats({
            totalDoctors: activity.stats?.totalDoctors || 0,
            totalPatients: activity.stats?.totalPatients || 0,
            totalRecords: activity.stats?.totalRecords || 0,
            successRate: 100,
          });
        }
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAddDoctor = () => {
    setShowAddDoctorModal(true);
  };

  const handleCloseAddDoctorModal = () => {
    setShowAddDoctorModal(false);
  };

  const handleDoctorAdded = (doctorData) => {
    console.log('New doctor added:', doctorData);
    setShowAddDoctorModal(false);
    navigate('/hospital/doctors');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'patients', label: 'Patients', icon: '👤' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hospital Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to {hospital?.name || 'Hospital'} - Manage doctors, patients, and medical records
          </p>
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
                      Total Doctors
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.totalDoctors}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Patients
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
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">
                        %
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Success Rate
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.successRate}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Add Doctor Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleAddDoctor}
                size="lg"
                className="px-8 py-4 text-lg"
                icon={<PlusIcon className="w-6 h-6" />}
              >
                Add New Doctor
              </Button>
            </div>

            {/* Recent Activity Feed */}
            <Card>
              <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
                <Card.Description>
                  Latest updates and activities in the hospital
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {loading && (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">Loading activity...</div>
                  )}
                  {!loading && recentActivity.length === 0 && (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">No recent on-chain activity found.</div>
                  )}
                  {!loading && recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm">{activity.type === 'doctor_registered' ? '👨‍⚕️' : '📋'}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date((activity.timestamp || 0) * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {error && (
                    <div className="text-center text-red-600 text-sm">{error}</div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Doctor Management
              </h2>
              <Button
                onClick={handleAddDoctor}
                icon={<PlusIcon className="w-5 h-5" />}
              >
                Add Doctor
              </Button>
            </div>
            <DoctorList />
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Patient Management
              </h2>
            </div>
            <PatientList />
          </div>
        )}

        {/* Add Doctor Modal */}
        <Modal
          isOpen={showAddDoctorModal}
          onClose={handleCloseAddDoctorModal}
          title="Add New Doctor"
          size="2xl"
        >
          <AddDoctor onDoctorAdded={handleDoctorAdded} onCancel={handleCloseAddDoctorModal} />
        </Modal>
      </div>
    </div>
  );
};

export default HospitalDashboard;
