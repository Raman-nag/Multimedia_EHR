import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CreateRecord from '../../components/doctor/CreateRecord';

const CreateRecordPage = () => {
  return (
    <DashboardLayout userRole="doctor">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Medical Record</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create a new medical record for a patient
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <CreateRecord 
              onRecordCreated={() => {
                // Handle successful record creation
                // You can add navigation or notification here
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateRecordPage;