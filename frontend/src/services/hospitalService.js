// Hospital service for managing hospital-related operations
import { mockUsers, mockStats } from '../data/mockData';

class HospitalService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.hospitalId = mockUsers.hospital.id;
  }

  // Get hospital dashboard statistics
  async getDashboardStats() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: {
          totalDoctors: mockStats.hospital.totalDoctors,
          totalPatients: mockStats.hospital.totalPatients,
          totalRecords: mockStats.hospital.totalRecords,
          monthlyGrowth: mockStats.hospital.monthlyGrowth,
          successRate: mockStats.hospital.successRate,
          recentActivity: await this.getRecentActivity()
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        error: 'Failed to fetch dashboard statistics'
      };
    }
  }

  // Get recent activity feed
  async getRecentActivity() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: 1,
          type: 'doctor_added',
          message: 'Dr. Sarah Johnson joined the hospital',
          timestamp: '2 hours ago',
          icon: '👨‍⚕️',
          userId: 'doc_001'
        },
        {
          id: 2,
          type: 'patient_visit',
          message: 'New patient record created for John Doe',
          timestamp: '4 hours ago',
          icon: '👤',
          userId: 'pat_001'
        },
        {
          id: 3,
          type: 'record_updated',
          message: 'Medical record updated for Patient ID: PAT-001',
          timestamp: '6 hours ago',
          icon: '📋',
          userId: 'pat_001'
        },
        {
          id: 4,
          type: 'prescription',
          message: 'New prescription issued by Dr. Johnson',
          timestamp: '8 hours ago',
          icon: '💊',
          userId: 'doc_001'
        }
      ];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Doctor Management Methods
  async getDoctors(filters = {}) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockDoctors = [
        {
          id: 'doc_001',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@citygeneral.com',
          phone: '+1 (555) 234-5678',
          specialty: 'Cardiology',
          licenseNumber: 'MD-2024-001',
          walletAddress: '0x8ba1f109551bD432803012645Hac136c',
          status: 'Active',
          totalPatients: 89,
          totalRecords: 234,
          experience: 12,
          rating: 4.9,
          joinDate: '2023-01-15',
          qualifications: 'MD, PhD, Board Certified Cardiologist',
          bio: 'Experienced cardiologist with over 12 years of practice.'
        },
        {
          id: 'doc_002',
          firstName: 'Dr. Michael',
          lastName: 'Chen',
          email: 'michael.chen@citygeneral.com',
          phone: '+1 (555) 345-6789',
          specialty: 'Neurology',
          licenseNumber: 'MD-2024-002',
          walletAddress: '0x9ba1f109551bD432803012645Hac136d',
          status: 'Active',
          totalPatients: 67,
          totalRecords: 189,
          experience: 8,
          rating: 4.7,
          joinDate: '2023-03-20',
          qualifications: 'MD, Neurology Specialist',
          bio: 'Neurologist specializing in movement disorders.'
        },
        {
          id: 'doc_003',
          firstName: 'Dr. Emily',
          lastName: 'Rodriguez',
          email: 'emily.rodriguez@citygeneral.com',
          phone: '+1 (555) 456-7890',
          specialty: 'Pediatrics',
          licenseNumber: 'MD-2024-003',
          walletAddress: '0xaba1f109551bD432803012645Hac136e',
          status: 'Inactive',
          totalPatients: 45,
          totalRecords: 123,
          experience: 6,
          rating: 4.8,
          joinDate: '2023-06-10',
          qualifications: 'MD, Pediatric Specialist',
          bio: 'Pediatrician with expertise in child development.'
        },
        {
          id: 'doc_004',
          firstName: 'Dr. James',
          lastName: 'Wilson',
          email: 'james.wilson@citygeneral.com',
          phone: '+1 (555) 567-8901',
          specialty: 'Orthopedics',
          licenseNumber: 'MD-2024-004',
          walletAddress: '0xbba1f109551bD432803012645Hac136f',
          status: 'Active',
          totalPatients: 78,
          totalRecords: 201,
          experience: 15,
          rating: 4.9,
          joinDate: '2022-11-05',
          qualifications: 'MD, Orthopedic Surgeon',
          bio: 'Orthopedic surgeon specializing in joint replacement.'
        }
      ];

      // Apply filters
      let filteredDoctors = mockDoctors;
      
      if (filters.status && filters.status !== 'all') {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.status === filters.status);
      }
      
      if (filters.specialty && filters.specialty !== 'all') {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.specialty === filters.specialty);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredDoctors = filteredDoctors.filter(doctor =>
          `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm) ||
          doctor.email.toLowerCase().includes(searchTerm) ||
          doctor.licenseNumber.toLowerCase().includes(searchTerm) ||
          doctor.specialty.toLowerCase().includes(searchTerm)
        );
      }

      return {
        success: true,
        data: filteredDoctors,
        total: filteredDoctors.length
      };
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return {
        success: false,
        error: 'Failed to fetch doctors'
      };
    }
  }

  async addDoctor(doctorData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDoctor = {
        id: `doc_${Date.now()}`,
        ...doctorData,
        status: 'Active',
        joinDate: new Date().toISOString(),
        totalPatients: 0,
        totalRecords: 0,
        rating: 0
      };

      return {
        success: true,
        data: newDoctor,
        message: 'Doctor added successfully'
      };
    } catch (error) {
      console.error('Error adding doctor:', error);
      return {
        success: false,
        error: 'Failed to add doctor'
      };
    }
  }

  async updateDoctor(doctorId, updateData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: { id: doctorId, ...updateData },
        message: 'Doctor updated successfully'
      };
    } catch (error) {
      console.error('Error updating doctor:', error);
      return {
        success: false,
        error: 'Failed to update doctor'
      };
    }
  }

  async deleteDoctor(doctorId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: 'Doctor removed successfully'
      };
    } catch (error) {
      console.error('Error deleting doctor:', error);
      return {
        success: false,
        error: 'Failed to delete doctor'
      };
    }
  }

  async getDoctorById(doctorId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const doctors = await this.getDoctors();
      const doctor = doctors.data.find(d => d.id === doctorId);
      
      if (!doctor) {
        return {
          success: false,
          error: 'Doctor not found'
        };
      }

      return {
        success: true,
        data: doctor
      };
    } catch (error) {
      console.error('Error fetching doctor:', error);
      return {
        success: false,
        error: 'Failed to fetch doctor details'
      };
    }
  }

  // Patient Management Methods
  async getPatients(filters = {}) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPatients = [
        {
          id: 'pat_001',
          firstName: 'John',
          lastName: 'Doe',
          patientId: 'PAT-001',
          email: 'john.doe@email.com',
          phone: '+1 (555) 345-6789',
          dateOfBirth: '1985-03-15',
          gender: 'Male',
          bloodType: 'O+',
          lastVisitDate: '2024-03-10',
          assignedDoctor: 'Dr. Sarah Johnson',
          doctorId: 'doc_001',
          totalRecords: 15,
          status: 'Active',
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1 (555) 456-7890'
          }
        },
        {
          id: 'pat_002',
          firstName: 'Alice',
          lastName: 'Smith',
          patientId: 'PAT-002',
          email: 'alice.smith@email.com',
          phone: '+1 (555) 456-7890',
          dateOfBirth: '1990-07-22',
          gender: 'Female',
          bloodType: 'A+',
          lastVisitDate: '2024-03-08',
          assignedDoctor: 'Dr. Michael Chen',
          doctorId: 'doc_002',
          totalRecords: 8,
          status: 'Active',
          emergencyContact: {
            name: 'Bob Smith',
            relationship: 'Brother',
            phone: '+1 (555) 567-8901'
          }
        },
        {
          id: 'pat_003',
          firstName: 'Robert',
          lastName: 'Johnson',
          patientId: 'PAT-003',
          email: 'robert.johnson@email.com',
          phone: '+1 (555) 567-8901',
          dateOfBirth: '1978-12-05',
          gender: 'Male',
          bloodType: 'B-',
          lastVisitDate: '2024-02-28',
          assignedDoctor: 'Dr. Emily Rodriguez',
          doctorId: 'doc_003',
          totalRecords: 23,
          status: 'Active',
          emergencyContact: {
            name: 'Mary Johnson',
            relationship: 'Wife',
            phone: '+1 (555) 678-9012'
          }
        },
        {
          id: 'pat_004',
          firstName: 'Lisa',
          lastName: 'Brown',
          patientId: 'PAT-004',
          email: 'lisa.brown@email.com',
          phone: '+1 (555) 678-9012',
          dateOfBirth: '1992-05-18',
          gender: 'Female',
          bloodType: 'AB+',
          lastVisitDate: '2024-03-12',
          assignedDoctor: 'Dr. James Wilson',
          doctorId: 'doc_004',
          totalRecords: 12,
          status: 'Active',
          emergencyContact: {
            name: 'David Brown',
            relationship: 'Father',
            phone: '+1 (555) 789-0123'
          }
        }
      ];

      // Apply filters
      let filteredPatients = mockPatients;
      
      if (filters.doctor && filters.doctor !== 'all') {
        filteredPatients = filteredPatients.filter(patient => patient.assignedDoctor === filters.doctor);
      }
      
      if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filters.dateRange) {
          case 'Last 7 days':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'Last 30 days':
            filterDate.setDate(now.getDate() - 30);
            break;
          case 'Last 3 months':
            filterDate.setMonth(now.getMonth() - 3);
            break;
          case 'Last 6 months':
            filterDate.setMonth(now.getMonth() - 6);
            break;
          case 'Last year':
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        filteredPatients = filteredPatients.filter(patient => new Date(patient.lastVisitDate) >= filterDate);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredPatients = filteredPatients.filter(patient =>
          `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm) ||
          patient.patientId.toLowerCase().includes(searchTerm) ||
          patient.email.toLowerCase().includes(searchTerm) ||
          patient.assignedDoctor.toLowerCase().includes(searchTerm)
        );
      }

      return {
        success: true,
        data: filteredPatients,
        total: filteredPatients.length
      };
    } catch (error) {
      console.error('Error fetching patients:', error);
      return {
        success: false,
        error: 'Failed to fetch patients'
      };
    }
  }

  async getPatientById(patientId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const patients = await this.getPatients();
      const patient = patients.data.find(p => p.id === patientId);
      
      if (!patient) {
        return {
          success: false,
          error: 'Patient not found'
        };
      }

      return {
        success: true,
        data: patient
      };
    } catch (error) {
      console.error('Error fetching patient:', error);
      return {
        success: false,
        error: 'Failed to fetch patient details'
      };
    }
  }

  async getPatientRecords(patientId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock medical records
      const mockRecords = [
        {
          id: 'rec_001',
          patientId: patientId,
          doctorId: 'doc_001',
          hospitalId: this.hospitalId,
          date: '2024-03-15',
          type: 'Consultation',
          diagnosis: 'Hypertension',
          symptoms: ['High blood pressure', 'Headaches', 'Dizziness'],
          treatment: 'Prescribed medication and lifestyle changes',
          prescription: {
            medications: [
              { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
              { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' }
            ]
          },
          status: 'Active'
        }
      ];

      return {
        success: true,
        data: mockRecords
      };
    } catch (error) {
      console.error('Error fetching patient records:', error);
      return {
        success: false,
        error: 'Failed to fetch patient records'
      };
    }
  }

  // Hospital Profile Methods
  async getHospitalProfile() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: mockUsers.hospital
      };
    } catch (error) {
      console.error('Error fetching hospital profile:', error);
      return {
        success: false,
        error: 'Failed to fetch hospital profile'
      };
    }
  }

  async updateHospitalProfile(updateData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: { ...mockUsers.hospital, ...updateData },
        message: 'Hospital profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating hospital profile:', error);
      return {
        success: false,
        error: 'Failed to update hospital profile'
      };
    }
  }

  // Analytics Methods
  async getAnalytics(timeRange = '30d') {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          patientGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [120, 135, 150, 145, 160, 175]
          },
          doctorPerformance: {
            labels: ['Dr. Johnson', 'Dr. Chen', 'Dr. Rodriguez', 'Dr. Wilson'],
            data: [89, 67, 45, 78]
          },
          specialtyDistribution: {
            labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'],
            data: [25, 20, 30, 25]
          }
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        success: false,
        error: 'Failed to fetch analytics data'
      };
    }
  }
}

// Create and export singleton instance
const hospitalService = new HospitalService();
export default hospitalService;
