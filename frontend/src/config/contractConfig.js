// Centralized contract and IPFS configuration
// NOTE: After deployment, run: node backend/scripts/copy-abis.js
// Then update the imports below to load the actual ABIs

// Import ABIs - these will be available after running copy-abis.js script
// For now, using empty arrays - will be populated after deployment
// After deployment, uncomment and update the imports below:

// import DoctorManagementABI_RAW from './abis/DoctorManagement.json';
// import PatientManagementABI_RAW from './abis/PatientManagement.json';
// import HospitalManagementABI_RAW from './abis/HospitalManagement.json';
// import EMRSystemABI_RAW from './abis/EMRSystem.json';

// const DoctorManagementABI = DoctorManagementABI_RAW?.abi || DoctorManagementABI_RAW || [];
// const PatientManagementABI = PatientManagementABI_RAW?.abi || PatientManagementABI_RAW || [];
// const HospitalManagementABI = HospitalManagementABI_RAW?.abi || HospitalManagementABI_RAW || [];
// const EMRSystemABI = EMRSystemABI_RAW?.abi || EMRSystemABI_RAW || [];

// Temporary empty arrays - replace after deployment
let EMRSystemABI = [];
let DoctorManagementABI = [];
let HospitalManagementABI = [];
let PatientManagementABI = [];

// Dynamic loader function - will be called when needed
export const loadABIs = async () => {
  try {
    const DoctorABI = await import('./abis/DoctorManagement.json');
    DoctorManagementABI.length = 0;
    DoctorManagementABI.push(...(DoctorABI.default?.abi || DoctorABI.default || DoctorABI.abi || DoctorABI || []));
  } catch (e) {
    console.warn('DoctorManagement ABI not found. Run: node backend/scripts/copy-abis.js');
  }

  try {
    const PatientABI = await import('./abis/PatientManagement.json');
    PatientManagementABI.length = 0;
    PatientManagementABI.push(...(PatientABI.default?.abi || PatientABI.default || PatientABI.abi || PatientABI || []));
  } catch (e) {
    console.warn('PatientManagement ABI not found. Run: node backend/scripts/copy-abis.js');
  }

  try {
    const HospitalABI = await import('./abis/HospitalManagement.json');
    HospitalManagementABI.length = 0;
    HospitalManagementABI.push(...(HospitalABI.default?.abi || HospitalABI.default || HospitalABI.abi || HospitalABI || []));
  } catch (e) {
    console.warn('HospitalManagement ABI not found. Run: node backend/scripts/copy-abis.js');
  }

  try {
    const EMRABI = await import('./abis/EMRSystem.json');
    EMRSystemABI.length = 0;
    EMRSystemABI.push(...(EMRABI.default?.abi || EMRABI.default || EMRABI.abi || EMRABI || []));
  } catch (e) {
    console.warn('EMRSystem ABI not found. Run: node backend/scripts/copy-abis.js');
  }
};

// Load ABIs asynchronously (non-blocking)
loadABIs().catch(err => console.warn('Failed to load ABIs:', err));

export const CONTRACT_ADDRESSES = {
  // Replace with real deployed addresses per network
  localhost: {
    EMRSystem: import.meta.env.VITE_EMR_SYSTEM_ADDRESS || '0x0000000000000000000000000000000000000000',
    DoctorManagement: import.meta.env.VITE_DOCTOR_MGMT_ADDRESS || '0x0000000000000000000000000000000000000000',
    HospitalManagement: import.meta.env.VITE_HOSPITAL_MGMT_ADDRESS || '0x0000000000000000000000000000000000',
    PatientManagement: import.meta.env.VITE_PATIENT_MGMT_ADDRESS || '0x0000000000000000000000000000000000000000',
  },
};

export const CONTRACT_ABIS = {
  EMRSystem: EMRSystemABI,
  DoctorManagement: DoctorManagementABI,
  HospitalManagement: HospitalManagementABI,
  PatientManagement: PatientManagementABI,
};

export const NETWORKS = {
  localhost: {
    chainIdHex: '0x539', // 1337
    chainId: 1337,
    name: 'Localhost 8545',
    rpcUrl: import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545',
    blockExplorer: import.meta.env.VITE_BLOCK_EXPLORER || '',
  },
};

export const DEFAULT_NETWORK_KEY = import.meta.env.VITE_NETWORK_KEY || 'localhost';

export const IPFS_CONFIG = {
  pinataEndpoint: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
  gateway: import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
  pinataApiKey: import.meta.env.VITE_PINATA_API_KEY || '',
  pinataSecretApiKey: import.meta.env.VITE_PINATA_SECRET_API_KEY || '',
  maxFileSizeMb: 50,
  allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg', 'application/dicom'],
};

export default {
  CONTRACT_ADDRESSES,
  CONTRACT_ABIS,
  NETWORKS,
  DEFAULT_NETWORK_KEY,
  IPFS_CONFIG,
};


