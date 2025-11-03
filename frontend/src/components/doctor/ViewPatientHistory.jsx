import React from 'react';
import { useParams } from 'react-router-dom';
import { DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';

const ViewPatientHistory = () => {
  const { patientId } = useParams();

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient History</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Patient ID: {patientId}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <h4 className="text-md font-medium text-gray-900 dark:text-white">Records</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">This is a placeholder for the patient's medical history. Integrate with real data as needed.</p>
      </div>
    </div>
  );
};

export default ViewPatientHistory;


