import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Prescriptions from '../../components/patient/Prescriptions';

const PrescriptionsPage = () => {
  return (
    <DashboardLayout userRole="patient">
      <Prescriptions />
    </DashboardLayout>
  );
};

export default PrescriptionsPage;
