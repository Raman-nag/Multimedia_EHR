import { ethers } from 'ethers';
import { CONTRACT_ABIS, CONTRACT_ADDRESSES, DEFAULT_NETWORK_KEY } from '../config/contractConfig';
import { getProvider, getSigner } from './web3';

function getAddress(contractKey, networkKey = DEFAULT_NETWORK_KEY) {
  console.debug('[Contract] getAddress called', { contractKey, networkKey });
  const possibleKeys = [
    networkKey,
    'localhost',
    31337,
    '31337',
    1337,
    '1337',
    '0x7A69',
    '0x539',
  ];

  for (const key of possibleKeys) {
    const map = CONTRACT_ADDRESSES[key];
    if (map && map[contractKey] && map[contractKey] !== '0x0000000000000000000000000000000000000000') {
      console.log(`[contract.js] Found ${contractKey} address for network ${key}:`, map[contractKey]);
      return map[contractKey];
    }
  }

  console.error(`[contract.js] No valid address found for ${contractKey}. Tried keys:`, possibleKeys);
  console.warn('[contract.js] Available CONTRACT_ADDRESSES keys:', Object.keys(CONTRACT_ADDRESSES || {}));
  return null;
}

export async function getContractInstance(contractKey, withSigner = true) {
  // Get ABI and address
  const abi = CONTRACT_ABIS[contractKey];
  console.debug('[Contract] DEFAULT_NETWORK_KEY', DEFAULT_NETWORK_KEY);
  const address = getAddress(contractKey);
  
  // Validate ABI
  if (!abi || abi.length === 0) {
    throw new Error(`ABI not loaded for ${contractKey}`);
  }
  
  // Validate address
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    const networkKey = DEFAULT_NETWORK_KEY;
    const addressesForNetwork = CONTRACT_ADDRESSES[networkKey] || {};
    throw new Error(
      `${contractKey} address not configured for network "${networkKey}". Loaded addresses: ${JSON.stringify(addressesForNetwork)}`
    );
  }
  
  // Get provider and signer
  const provider = getProvider();
  if (!provider) throw new Error('Provider not available');
  const signer = withSigner ? await getSigner() : null;
  
  // Create and return contract instance
  return new ethers.Contract(address, abi, signer || provider);
}

export const getHospitalContract = () => getContractInstance('HospitalManagement');
export const getDoctorContract = () => getContractInstance('DoctorManagement');
export const getPatientContract = () => getContractInstance('PatientManagement');
export const getEMRSystemContract = () => getContractInstance('EMRSystem');

export function formatTxReceipt(receipt) {
  if (!receipt) return null;
  return {
    hash: receipt?.hash,
    blockNumber: Number(receipt?.blockNumber || 0),
    gasUsed: receipt?.gasUsed?.toString?.() || '',
    status: Number(receipt?.status || 0),
  };
}

export function parseContractError(err) {
  if (!err) return 'Unknown error';
  if (err.code === 4001) return 'User rejected the transaction';
  if (err.reason) return err.reason;
  if (err.error?.message) return err.error.message;
  return err.message || 'Transaction failed';
}

export default {
  getHospitalContract,
  getDoctorContract,
  getPatientContract,
  getEMRSystemContract,
  formatTxReceipt,
  parseContractError,
};
