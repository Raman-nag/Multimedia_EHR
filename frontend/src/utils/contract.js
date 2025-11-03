import { ethers } from 'ethers';
import { CONTRACT_ABIS, CONTRACT_ADDRESSES, DEFAULT_NETWORK_KEY } from '../config/contractConfig';
import { getProvider, getSigner } from './web3';

function getAddress(contractKey, networkKey = DEFAULT_NETWORK_KEY) {
  const map = CONTRACT_ADDRESSES[networkKey] || {};
  return map[contractKey];
}

export async function getContractInstance(contractKey, withSigner = true) {
  const abi = CONTRACT_ABIS[contractKey];
  const address = getAddress(contractKey);
  if (!abi || abi.length === 0) throw new Error(`ABI not loaded for ${contractKey}`);
  if (!address || address === '0x0000000000000000000000000000000000000000') throw new Error(`${contractKey} address not configured`);
  const provider = getProvider();
  if (!provider) throw new Error('Provider not available');
  const signer = withSigner ? await getSigner() : null;
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


