import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Hospital Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Analytics content will go here */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            </div>
            <p className="text-gray-600">Analytics features coming soon...</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;