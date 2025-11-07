// Centralized contract and IPFS configuration

// Import ABI files directly as modules
import DoctorManagementABI from './abis/DoctorManagement.json';
import PatientManagementABI from './abis/PatientManagement.json';
import HospitalManagementABI from './abis/HospitalManagement.json';
import EMRSystemABI from './abis/EMRSystem.json';

// Log ABIs loaded
console.log('[ContractConfig] ABIs imported:', {
  DoctorManagement: Array.isArray(DoctorManagementABI) && DoctorManagementABI.length > 0,
  PatientManagement: Array.isArray(PatientManagementABI) && PatientManagementABI.length > 0,
  HospitalManagement: Array.isArray(HospitalManagementABI) && HospitalManagementABI.length > 0,
  EMRSystem: Array.isArray(EMRSystemABI) && EMRSystemABI.length > 0,
});

// HARDCODED DEPLOYED ADDRESSES
const ADDRESSES = {
  EMRSystem: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  DoctorManagement: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  HospitalManagement: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  PatientManagement: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
};

// Export for all possible network keys
export const CONTRACT_ADDRESSES = {
  'localhost': ADDRESSES,
  'Localhost': ADDRESSES,
  '31337': ADDRESSES,
  31337: ADDRESSES,
  '1337': ADDRESSES,
  1337: ADDRESSES,
  '0x7A69': ADDRESSES,
  '0x7a69': ADDRESSES,
  '0x539': ADDRESSES,
  '0x0539': ADDRESSES,
};

// Export ABIs directly (no async loading needed)
export const CONTRACT_ABIS = {
  EMRSystem: EMRSystemABI,
  DoctorManagement: DoctorManagementABI,
  HospitalManagement: HospitalManagementABI,
  PatientManagement: PatientManagementABI,
};

console.log('[ContractConfig] Addresses loaded:', ADDRESSES);
console.log('[ContractConfig] Available network keys:', Object.keys(CONTRACT_ADDRESSES));

export const NETWORKS = {
  localhost: {
    chainIdHex: '0x7A69',
    chainId: 31337,
    name: 'Localhost 8545',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: '',
  },
};

export const DEFAULT_NETWORK_KEY = 'localhost';

export const IPFS_CONFIG = {
  pinataEndpoint: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
  gateway: 'https://gateway.pinata.cloud/ipfs/',
  pinataApiKey: import.meta.env.VITE_PINATA_API_KEY || '',
  pinataSecretApiKey: import.meta.env.VITE_PINATA_SECRET_API_KEY || '',
  maxFileSizeMb: 50,
  allowedMimeTypes: [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/dicom',
  ],
};

export default {
  CONTRACT_ADDRESSES,
  CONTRACT_ABIS,
  NETWORKS,
  DEFAULT_NETWORK_KEY,
  IPFS_CONFIG,
};
