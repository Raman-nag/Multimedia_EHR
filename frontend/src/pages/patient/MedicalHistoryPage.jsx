import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MedicalHistory from '../../components/patient/MedicalHistory';

const MedicalHistoryPage = () => {
  return (
    <DashboardLayout userRole="patient">
      <MedicalHistory />
    </DashboardLayout>
  );
};

export default MedicalHistoryPage;
