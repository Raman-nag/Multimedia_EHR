# Services

This directory contains service modules for handling various operations in the Multimedia EHR application. All services currently use mock implementations for development purposes.

## Available Services

### 1. hospitalService.js
Service for hospital management operations.

**Methods:**
- `registerDoctor(doctorData)` - Register a new doctor
- `getDoctors()` - Get all doctors
- `getPatients()` - Get all patients
- `removeDoctor(address)` - Remove a doctor
- `getDoctorByAddress(address)` - Get doctor by wallet address
- `updateDoctor(address, updateData)` - Update doctor information

**Usage:**
```javascript
import hospitalService from '../services/hospitalService';

// Register a doctor
const result = await hospitalService.registerDoctor({
  firstName: 'Dr. John',
  lastName: 'Doe',
  specialty: 'Cardiology'
});

// Get all doctors
const { doctors } = await hospitalService.getDoctors();
```

### 2. doctorService.js
Service for doctor medical record operations.

**Methods:**
- `createRecord(patientAddress, recordData)` - Create new medical record
- `updateRecord(recordId, updateData)` - Update existing record
- `getPatientHistory(patientAddress)` - Get patient's medical history
- `getMyPatients()` - Get all assigned patients
- `getRecordById(recordId)` - Get specific record
- `deleteRecord(recordId)` - Delete a record

**Usage:**
```javascript
import doctorService from '../services/doctorService';

// Create a medical record
const record = await doctorService.createRecord(patientAddress, {
  diagnosis: 'Hypertension',
  symptoms: ['Headache', 'Dizziness'],
  treatment: 'Prescribed medication'
});

// Get patient history
const history = await doctorService.getPatientHistory(patientAddress);
```

### 3. patientService.js
Service for patient operations.

**Methods:**
- `getMyRecords(patientAddress)` - Get patient's medical records
- `getMyPrescriptions(patientAddress)` - Get patient's prescriptions
- `grantAccess(address, accessOptions)` - Grant access to third party
- `revokeAccess(address)` - Revoke access
- `getAccessList()` - Get list of granted access
- `getMyProfile(patientAddress)` - Get patient profile

**Usage:**
```javascript
import patientService from '../services/patientService';

// Get my records
const { records } = await patientService.getMyRecords(patientAddress);

// Grant access to insurance
const result = await patientService.grantAccess(address, {
  provider: 'Health Insurance Co.',
  purpose: 'Claims processing'
});
```

### 4. ipfsService.js
Service for IPFS file operations.

**Methods:**
- `uploadFile(file, options)` - Upload file to IPFS
- `uploadMultipleFiles(files)` - Upload multiple files
- `retrieveFile(hash)` - Retrieve file from IPFS
- `getGatewayURL(hash)` - Get IPFS gateway URL
- `pinFile(hash)` - Pin file to IPFS
- `unpinFile(hash)` - Unpin file from IPFS
- `getFileInfo(hash)` - Get file information
- `downloadFile(hash, filename)` - Download file
- `isValidHash(hash)` - Validate IPFS hash

**Usage:**
```javascript
import ipfsService from '../services/ipfsService';

// Upload a file
const file = document.querySelector('input[type="file"]').files[0];
const hash = await ipfsService.uploadFile(file);

// Retrieve file
const url = await ipfsService.retrieveFile(hash);
```

## Mock Implementation

All services currently use mock implementations:
- Simulated delays with `setTimeout`
- Mock data from `mockData.js`
- Console logging for debugging
- No actual API or blockchain calls

## Production TODO

### hospitalService
1. Integrate with blockchain smart contracts
2. Implement real API calls for doctor registration
3. Add actual patient management
4. Implement access control

### doctorService
1. Connect to blockchain for record creation
2. Implement IPFS integration for file attachments
3. Add encryption for sensitive data
4. Implement audit logging

### patientService
1. Implement blockchain-based access control
2. Add encryption for medical records
3. Implement access history tracking
4. Add revocation mechanisms

### ipfsService
1. Integrate with ipfs-http-client
2. Implement actual IPFS upload/download
3. Add pinning services (Pinata, Infura)
4. Implement CID validation
5. Add content addressing

## Error Handling

All services include try-catch error handling and throw descriptive error messages:

```javascript
try {
  const result = await hospitalService.registerDoctor(doctorData);
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Usage in Components

Services can be used directly in React components:

```javascript
import React, { useState, useEffect } from 'react';
import hospitalService from '../services/hospitalService';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const result = await hospitalService.getDoctors();
        setDoctors(result.doctors);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {doctors.map(doctor => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
}
```

## Service Integration

Services can be used together:

```javascript
import doctorService from '../services/doctorService';
import ipfsService from '../services/ipfsService';

async function createRecordWithFile(patientAddress, recordData, file) {
  // Upload file to IPFS
  const fileHash = await ipfsService.uploadFile(file);
  
  // Create record with IPFS hash
  const record = await doctorService.createRecord(patientAddress, {
    ...recordData,
    attachments: [fileHash]
  });
  
  return record;
}
```
