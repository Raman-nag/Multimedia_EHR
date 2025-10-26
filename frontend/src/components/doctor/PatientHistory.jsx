import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  PillsIcon,
  CloudArrowDownIcon,
  PencilIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';

const PatientHistory = ({ patient, onClose }) => {
  const [patientData, setPatientData] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient) {
      fetchPatientData();
    }
  }, [patient]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock patient data
      const mockPatientData = {
        id: patient.id,
        firstName: patient.firstName || 'John',
        lastName: patient.lastName || 'Doe',
        patientId: patient.patientId || 'PAT-001',
        email: 'john.doe@email.com',
        phone: '+1 (555) 345-6789',
        dateOfBirth: '1985-03-15',
        gender: 'Male',
        bloodType: 'O+',
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 (555) 456-7890'
        }
      };

      // Mock medical records
      const mockRecords = [
        {
          id: 'rec_001',
          date: '2024-03-15',
          type: 'Follow-up',
          diagnosis: 'Hypertension',
          symptoms: ['High blood pressure', 'Headaches', 'Dizziness'],
          treatment: 'Prescribed medication and lifestyle changes',
          doctor: 'Dr. Sarah Johnson',
          status: 'Active',
          notes: 'Patient responding well to treatment. Blood pressure under control.',
          documents: [
            {
              id: 'doc_001',
              name: 'Blood Pressure Report.pdf',
              type: 'pdf',
              size: '2.3 MB',
              ipfsHash: 'QmHash123...',
              uploadDate: '2024-03-15'
            }
          ]
        },
        {
          id: 'rec_002',
          date: '2024-02-15',
          type: 'Consultation',
          diagnosis: 'High Blood Pressure',
          symptoms: ['Elevated blood pressure readings'],
          treatment: 'Initial medication prescribed',
          doctor: 'Dr. Sarah Johnson',
          status: 'Active',
          notes: 'First consultation for hypertension. Patient advised lifestyle changes.',
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
          ]
        },
        {
          id: 'rec_003',
          date: '2024-01-10',
          type: 'Check-up',
          diagnosis: 'General Health Check',
          symptoms: ['Routine check-up'],
          treatment: 'No treatment required',
          doctor: 'Dr. Sarah Johnson',
          status: 'Completed',
          notes: 'Annual health check-up. All vitals normal.',
          documents: []
        }
      ];

      // Mock prescriptions
      const mockPrescriptions = [
        {
          id: 'pres_001',
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
          refills: 2
        },
        {
          id: 'pres_002',
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
          refills: 0
        }
      ];

      setPatientData(mockPatientData);
      setMedicalRecords(mockRecords);
      setPrescriptions(mockPrescriptions);
      setDocuments(mockRecords.flatMap(record => record.documents));
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecord = (record) => {
    setSelectedRecord(record);
    setShowUpdateModal(true);
  };

  const handleDownloadDocument = (document) => {
    console.log('Downloading document:', document);
    // Implement actual download functionality
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (sizeString) => {
    return sizeString;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'Active' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
        {status === 'Completed' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
        {status === 'Pending' && <ClockIcon className="w-3 h-3 mr-1" />}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading patient history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {patientData?.firstName} {patientData?.lastName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Patient ID: {patientData?.patientId}
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {patientData?.bloodType} • {patientData?.gender}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {patientData?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Medical Records Timeline */}
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          Medical Records Timeline
        </h4>
        
        <div className="space-y-4">
          {medicalRecords.map((record, index) => (
            <Card key={record.id} className="relative">
              <div className="absolute left-6 top-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900"></div>
              {index < medicalRecords.length - 1 && (
                <div className="absolute left-8 top-10 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
              )}
              
              <Card.Content className="ml-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-md font-semibold text-gray-900 dark:text-white">
                        {record.type} - {formatDate(record.date)}
                      </h5>
                      {getStatusBadge(record.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Diagnosed by {record.doctor}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateRecord(record)}
                      icon={<PencilIcon className="w-4 h-4" />}
                    >
                      Update
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<EyeIcon className="w-4 h-4" />}
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Diagnosis
                    </h6>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {record.diagnosis}
                    </p>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Symptoms
                    </h6>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {record.symptoms.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Treatment
                  </h6>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {record.treatment}
                  </p>
                </div>

                {record.notes && (
                  <div className="mb-4">
                    <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </h6>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {record.notes}
                    </p>
                  </div>
                )}

                {/* Documents */}
                {record.documents && record.documents.length > 0 && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Documents ({record.documents.length})
                    </h6>
                    <div className="space-y-2">
                      {record.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(doc.size)} • IPFS: {doc.ipfsHash.slice(0, 10)}...
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            icon={<CloudArrowDownIcon className="w-4 h-4" />}
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>

      {/* Prescriptions */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          Prescription History
        </h4>
        
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <Card.Content>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white">
                      Prescription - {formatDate(prescription.date)}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Record ID: {prescription.recordId}
                    </p>
                  </div>
                  {getStatusBadge(prescription.status)}
                </div>

                <div className="space-y-3">
                  {prescription.medications.map((medication, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <PillsIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <h6 className="text-sm font-medium text-gray-900 dark:text-white">
                          {medication.name}
                        </h6>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Dosage:</span> {medication.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span> {medication.frequency}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {medication.duration}
                        </div>
                        <div>
                          <span className="font-medium">Refills:</span> {prescription.refills}
                        </div>
                      </div>
                      {medication.instructions && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          <span className="font-medium">Instructions:</span> {medication.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>

      {/* All Documents */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          All Documents ({documents.length})
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadDocument(doc)}
                    icon={<CloudArrowDownIcon className="w-4 h-4" />}
                  >
                    Download
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary">
          Create New Record
        </Button>
      </div>

      {/* Update Record Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Medical Record"
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update record for {selectedRecord.type} on {formatDate(selectedRecord.date)}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Add any additional notes or updates..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary">
                  Update Record
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientHistory;
