// Helper functions to work with mock data
import { mockPatients, mockDoctors, mockHospitals } from '../data/mockData';

export const findMockUserByEmail = (email, role) => {
  switch (role) {
    case 'patient':
      return mockPatients.find(p => p.email.toLowerCase() === email.toLowerCase());
    case 'doctor':
      return mockDoctors.find(d => d.email.toLowerCase() === email.toLowerCase());
    case 'hospital':
      return mockHospitals.find(h => h.email.toLowerCase() === email.toLowerCase());
    default:
      return null;
  }
};