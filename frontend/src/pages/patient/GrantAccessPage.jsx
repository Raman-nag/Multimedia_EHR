import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GrantAccess from '../../components/patient/GrantAccess';

const GrantAccessPage = () => {
  return (
    <DashboardLayout userRole="patient">
      <GrantAccess />
    </DashboardLayout>
  );
};

export default GrantAccessPage;
