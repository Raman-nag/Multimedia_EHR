// Doctor service for managing doctor-related operations
import { mockUsers, mockStats, mockMedicalRecords } from '../data/mockData';

class DoctorService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.doctorId = mockUsers.doctor.id;
  }

  // Get doctor dashboard statistics
  async getDashboardStats() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: {
          totalPatients: mockStats.doctor.totalPatients,
          totalRecords: mockStats.doctor.totalRecords,
          monthlyGrowth: mockStats.doctor.monthlyGrowth,
          averageRating: mockStats.doctor.averageRating,
          appointmentsToday: await this.getTodaysAppointments(),
          pendingRecords: await this.getPendingRecords(),
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

  // Get today's appointments
  async getTodaysAppointments() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: 1,
          patientName: 'John Doe',
          patientId: 'PAT-001',
          time: '09:00 AM',
          type: 'Follow-up',
          status: 'Scheduled'
        },
        {
          id: 2,
          patientName: 'Alice Smith',
          patientId: 'PAT-002',
          time: '11:30 AM',
          type: 'Consultation',
          status: 'Scheduled'
        },
        {
          id: 3,
          patientName: 'Robert Johnson',
          patientId: 'PAT-003',
          time: '02:00 PM',
          type: 'Check-up',
          status: 'Completed'
        }
      ];
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      return [];
    }
  }

  // Get pending records
  async getPendingRecords() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: 1,
          patientName: 'John Doe',
          patientId: 'PAT-001',
          visitDate: '2024-03-15',
          type: 'Consultation',
          status: 'Draft'
        },
        {
          id: 2,
          patientName: 'Alice Smith',
          patientId: 'PAT-002',
          visitDate: '2024-03-14',
          type: 'Follow-up',
          status: 'Review'
        }
      ];
    } catch (error) {
      console.error('Error fetching pending records:', error);
      return [];
    }
  }

  // Get recent activity
  async getRecentActivity() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: 1,
          type: 'record_created',
          message: 'Created medical record for John Doe',
          timestamp: '2 hours ago',
          icon: '📋',
          patientName: 'John Doe',
          patientId: 'PAT-001'
        },
        {
          id: 2,
          type: 'prescription_issued',
          message: 'Issued prescription for Alice Smith',
          timestamp: '4 hours ago',
          icon: '💊',
          patientName: 'Alice Smith',
          patientId: 'PAT-002'
        },
        {
          id: 3,
          type: 'appointment_completed',
          message: 'Completed appointment with Robert Johnson',
          timestamp: '6 hours ago',
          icon: '✅',
          patientName: 'Robert Johnson',
          patientId: 'PAT-003'
        },
        {
          id: 4,
          type: 'follow_up_scheduled',
          message: 'Scheduled follow-up for Lisa Brown',
          timestamp: '8 hours ago',
          icon: '📅',
          patientName: 'Lisa Brown',
          patientId: 'PAT-004'
        }
      ];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Patient Management Methods
  async getMyPatients(filters = {}) {
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
          lastVisitDate: '2024-03-15',
          totalRecords: 15,
          status: 'Active',
          nextAppointment: '2024-03-25',
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1 (555) 456-7890'
          },
          medicalHistory: [
            {
              id: 'rec_001',
              date: '2024-03-15',
              diagnosis: 'Hypertension',
              type: 'Follow-up'
            },
            {
              id: 'rec_002',
              date: '2024-02-15',
              diagnosis: 'High Blood Pressure',
              type: 'Consultation'
            }
          ]
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
          lastVisitDate: '2024-03-10',
          totalRecords: 8,
          status: 'Active',
          nextAppointment: '2024-03-28',
          emergencyContact: {
            name: 'Bob Smith',
            relationship: 'Brother',
            phone: '+1 (555) 567-8901'
          },
          medicalHistory: [
            {
              id: 'rec_003',
              date: '2024-03-10',
              diagnosis: 'Migraine',
              type: 'Consultation'
            }
          ]
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
          lastVisitDate: '2024-03-08',
          totalRecords: 23,
          status: 'Active',
          nextAppointment: null,
          emergencyContact: {
            name: 'Mary Johnson',
            relationship: 'Wife',
            phone: '+1 (555) 678-9012'
          },
          medicalHistory: [
            {
              id: 'rec_004',
              date: '2024-03-08',
              diagnosis: 'Diabetes Type 2',
              type: 'Check-up'
            },
            {
              id: 'rec_005',
              date: '2024-01-15',
              diagnosis: 'Diabetes Management',
              type: 'Follow-up'
            }
          ]
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
          lastVisitDate: '2024-03-05',
          totalRecords: 12,
          status: 'Active',
          nextAppointment: '2024-03-30',
          emergencyContact: {
            name: 'David Brown',
            relationship: 'Father',
            phone: '+1 (555) 789-0123'
          },
          medicalHistory: [
            {
              id: 'rec_006',
              date: '2024-03-05',
              diagnosis: 'Anxiety Disorder',
              type: 'Consultation'
            }
          ]
        }
      ];

      // Apply filters
      let filteredPatients = mockPatients;
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredPatients = filteredPatients.filter(patient =>
          `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm) ||
          patient.patientId.toLowerCase().includes(searchTerm) ||
          patient.email.toLowerCase().includes(searchTerm) ||
          patient.phone.includes(searchTerm)
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        filteredPatients.sort((a, b) => {
          let aValue, bValue;
          
          switch (filters.sortBy) {
            case 'name':
              aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
              bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
              break;
            case 'lastVisit':
              aValue = new Date(a.lastVisitDate);
              bValue = new Date(b.lastVisitDate);
              break;
            case 'records':
              aValue = a.totalRecords;
              bValue = b.totalRecords;
              break;
            case 'nextAppointment':
              aValue = a.nextAppointment ? new Date(a.nextAppointment) : new Date('2099-12-31');
              bValue = b.nextAppointment ? new Date(b.nextAppointment) : new Date('2099-12-31');
              break;
            default:
              aValue = a.lastVisitDate;
              bValue = b.lastVisitDate;
          }

          if (filters.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
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
      
      const patients = await this.getMyPatients();
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

  // Medical Records Methods
  async createMedicalRecord(recordData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRecord = {
        id: `rec_${Date.now()}`,
        ...recordData,
        doctorId: this.doctorId,
        hospitalId: 'hosp_001',
        status: 'Active',
        createdAt: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        ipfsHash: `QmRecord${Math.random().toString(36).substr(2, 9)}`
      };

      return {
        success: true,
        data: newRecord,
        message: 'Medical record created successfully'
      };
    } catch (error) {
      console.error('Error creating medical record:', error);
      return {
        success: false,
        error: 'Failed to create medical record'
      };
    }
  }

  async getPatientMedicalRecords(patientId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockRecords = [
        {
          id: 'rec_001',
          patientId: patientId,
          doctorId: this.doctorId,
          hospitalId: 'hosp_001',
          date: '2024-03-15',
          type: 'Follow-up',
          diagnosis: 'Hypertension',
          symptoms: ['High blood pressure', 'Headaches', 'Dizziness'],
          treatment: 'Prescribed medication and lifestyle changes',
          doctor: 'Dr. Sarah Johnson',
          status: 'Active',
          notes: 'Patient responding well to treatment. Blood pressure under control.',
          prescription: {
            medications: [
              {
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take with food'
              },
              {
                name: 'Amlodipine',
                dosage: '5mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take at bedtime'
              }
            ]
          },
          documents: [
            {
              id: 'doc_001',
              name: 'Blood Pressure Report.pdf',
              type: 'pdf',
              size: '2.3 MB',
              ipfsHash: 'QmHash123...',
              uploadDate: '2024-03-15'
            }
          ],
          txHash: '0x1234567890abcdef...',
          ipfsHash: 'QmDetailedRecord123...',
          createdAt: '2024-03-15T10:30:00Z'
        },
        {
          id: 'rec_002',
          patientId: patientId,
          doctorId: this.doctorId,
          hospitalId: 'hosp_001',
          date: '2024-02-15',
          type: 'Consultation',
          diagnosis: 'High Blood Pressure',
          symptoms: ['Elevated blood pressure readings'],
          treatment: 'Initial medication prescribed',
          doctor: 'Dr. Sarah Johnson',
          status: 'Active',
          notes: 'First consultation for hypertension. Patient advised lifestyle changes.',
          prescription: {
            medications: [
              {
                name: 'Hydrochlorothiazide',
                dosage: '25mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take in the morning'
              }
            ]
          },
          documents: [
            {
              id: 'doc_002',
              name: 'ECG Report.pdf',
              type: 'pdf',
              size: '1.8 MB',
              ipfsHash: 'QmHash456...',
              uploadDate: '2024-02-15'
            },
            {
              id: 'doc_003',
              name: 'Lab Results.pdf',
              type: 'pdf',
              size: '3.1 MB',
              ipfsHash: 'QmHash789...',
              uploadDate: '2024-02-15'
            }
          ],
          txHash: '0x2345678901bcdef...',
          ipfsHash: 'QmDetailedRecord456...',
          createdAt: '2024-02-15T14:20:00Z'
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

  async updateMedicalRecord(recordId, updateData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: { id: recordId, ...updateData },
        message: 'Medical record updated successfully'
      };
    } catch (error) {
      console.error('Error updating medical record:', error);
      return {
        success: false,
        error: 'Failed to update medical record'
      };
    }
  }

  // Prescription Methods
  async getPatientPrescriptions(patientId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockPrescriptions = [
        {
          id: 'pres_001',
          patientId: patientId,
          recordId: 'rec_001',
          date: '2024-03-15',
          medications: [
            {
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take with food'
            },
            {
              name: 'Amlodipine',
              dosage: '5mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take at bedtime'
            }
          ],
          status: 'Active',
          refills: 2,
          doctorId: this.doctorId,
          createdAt: '2024-03-15T10:30:00Z'
        },
        {
          id: 'pres_002',
          patientId: patientId,
          recordId: 'rec_002',
          date: '2024-02-15',
          medications: [
            {
              name: 'Hydrochlorothiazide',
              dosage: '25mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take in the morning'
            }
          ],
          status: 'Completed',
          refills: 0,
          doctorId: this.doctorId,
          createdAt: '2024-02-15T14:20:00Z'
        }
      ];

      return {
        success: true,
        data: mockPrescriptions
      };
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return {
        success: false,
        error: 'Failed to fetch prescriptions'
      };
    }
  }

  async createPrescription(prescriptionData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPrescription = {
        id: `pres_${Date.now()}`,
        ...prescriptionData,
        doctorId: this.doctorId,
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        data: newPrescription,
        message: 'Prescription created successfully'
      };
    } catch (error) {
      console.error('Error creating prescription:', error);
      return {
        success: false,
        error: 'Failed to create prescription'
      };
    }
  }

  // Document Management Methods
  async uploadDocument(file, recordId) {
    try {
      // Simulate IPFS upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const uploadedDocument = {
        id: `doc_${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        recordId: recordId,
        ipfsHash: `QmHash${Math.random().toString(36).substr(2, 9)}`,
        uploadDate: new Date().toISOString(),
        doctorId: this.doctorId
      };

      return {
        success: true,
        data: uploadedDocument,
        message: 'Document uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        error: 'Failed to upload document'
      };
    }
  }

  async downloadDocument(documentId) {
    try {
      // Simulate document download
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          documentId: documentId,
          downloadUrl: `https://ipfs.io/ipfs/QmHash${documentId}`,
          message: 'Document download initiated'
        }
      };
    } catch (error) {
      console.error('Error downloading document:', error);
      return {
        success: false,
        error: 'Failed to download document'
      };
    }
  }

  // Doctor Profile Methods
  async getDoctorProfile() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: mockUsers.doctor
      };
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      return {
        success: false,
        error: 'Failed to fetch doctor profile'
      };
    }
  }

  async updateDoctorProfile(updateData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: { ...mockUsers.doctor, ...updateData },
        message: 'Doctor profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      return {
        success: false,
        error: 'Failed to update doctor profile'
      };
    }
  }

  // Analytics Methods
  async getDoctorAnalytics(timeRange = '30d') {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          patientGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [15, 18, 22, 25, 28, 32]
          },
          recordTypes: {
            labels: ['Consultation', 'Follow-up', 'Check-up', 'Emergency'],
            data: [45, 30, 15, 10]
          },
          monthlyRecords: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [25, 30, 35, 28, 42, 38]
          }
        }
      };
    } catch (error) {
      console.error('Error fetching doctor analytics:', error);
      return {
        success: false,
        error: 'Failed to fetch analytics data'
      };
    }
  }
}

// Create and export singleton instance
const doctorService = new DoctorService();
export default doctorService;
