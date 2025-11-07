import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  HeartIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getHospitalContract } from '../utils/contract';
import { getProvider } from '../utils/web3';

const HospitalDashboard = () => {
  const [userProfile, setUserProfile] = useState({ firstName: '', lastName: '', role: 'Hospital Administrator' });
  const [walletAddress, setWalletAddress] = useState('');
  const [networkStatus, setNetworkStatus] = useState('connected');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHospital = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const provider = getProvider();
        if (!provider) throw new Error('Wallet provider not available');
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const hospitalContract = await getHospitalContract();
        let details;
        try {
          details = await hospitalContract.getHospitalDetails(address);
        } catch (_) {
          // fallback if only mapping exists
          details = await hospitalContract.hospitals?.(address);
        }

        const name = details?.name || '';
        setUserProfile({ firstName: name, lastName: '', role: 'Hospital Administrator' });
        setNetworkStatus('connected');
      } catch (e) {
        console.error('Failed to load hospital data:', e);
        setError(e?.message || 'Failed to load hospital data');
        setNetworkStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };
    loadHospital();
  }, []);

  const [stats, setStats] = useState([
    { name: 'Total Doctors', value: '—', change: '', icon: UserGroupIcon, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Active Patients', value: '—', change: '', icon: HeartIcon, color: 'text-green-600', bgColor: 'bg-green-100' },
    { name: 'Medical Records', value: '—', change: '', icon: DocumentTextIcon, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const provider = getProvider();
        if (!provider) return;
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const hospitalContract = await getHospitalContract();

        // Get counts from hospital details
        let details;
        try {
          details = await hospitalContract.getHospitalDetails(address);
        } catch (_) {
          details = await hospitalContract.hospitals?.(address);
        }

        const doctorCount = Number(details?.doctorCount ?? 0);
        const patientCount = Number(details?.patientCount ?? 0);

        // Estimate records: for each patient, count records via DoctorManagement
        let recordCount = 0;
        try {
          const doctorModule = await import('../utils/contract');
          const doctorContract = await doctorModule.getDoctorContract();
          const patients = await hospitalContract.getHospitalPatients(address);
          const recordCounts = await Promise.all(
            patients.map(async (p) => {
              try {
                const recs = await doctorContract.getPatientRecords(p);
                return Array.isArray(recs) ? recs.length : 0;
              } catch {
                return 0;
              }
            })
          );
          recordCount = recordCounts.reduce((a, b) => a + b, 0);
        } catch (_) {}

        setStats(prev => [
          { ...prev[0], value: String(doctorCount) },
          { ...prev[1], value: String(patientCount) },
          { ...prev[2], value: String(recordCount) },
        ]);
      } catch (e) {
        console.warn('Failed to load stats', e);
      }
    };
    loadStats();
  }, []);

  const recentActivities = [
    {
      id: 1,
      type: 'doctor_added',
      message: 'Dr. Vijay Johnson joined the hospital',
      time: '2 hours ago',
      icon: UserGroupIcon,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'patient_record',
      message: 'New patient record created for Raman',
      time: '4 days ago',
      icon: DocumentTextIcon,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'system_update',
      message: 'System maintenance completed successfully',
      time: '1 week ago',
      icon: ChartBarIcon,
      color: 'text-purple-500'
    }
  ];

  return (
    <DashboardLayout 
      userRole="hospital" 
      userProfile={userProfile}
      walletAddress={walletAddress}
      networkStatus={networkStatus}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">Hospital Management Dashboard</h1>
              <p className="mt-2 text-blue-100">
                {userProfile.firstName ? (
                  <span className="block max-w-full truncate sm:whitespace-normal sm:break-words sm:line-clamp-2">
                    Welcome back, {userProfile.firstName}
                  </span>
                ) : 'Manage your healthcare ecosystem with blockchain-powered security'}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <BuildingOfficeIcon className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.change}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/hospital/add-doctor" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Add Doctor</h3>
                  <p className="text-sm text-gray-500">Register new doctor</p>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
              </Link>

              <Link to="/hospital/patients" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <HeartIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">View Patients</h3>
                  <p className="text-sm text-gray-500">Manage patient records</p>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
              </Link>

              <Link to="/hospital/analytics" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-500">View system analytics</p>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start">
                    <div className={`p-2 rounded-full ${activity.color} bg-opacity-10`}>
                      <IconComponent className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty State for Records */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Medical Records</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No records yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding doctors and patients to create medical records.
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
