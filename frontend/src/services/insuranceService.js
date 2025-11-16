import { ethers } from 'ethers';
import { CONTRACT_ABIS, CONTRACT_ADDRESSES, DEFAULT_NETWORK_KEY } from '../config/contractConfig';
import { getProvider, getSigner, connectWallet, ensureCorrectNetwork } from '../utils/web3';

function getAddress() {
  const map = CONTRACT_ADDRESSES[DEFAULT_NETWORK_KEY] || {};
  return map.InsuranceManagement;
}

async function getContract(readonly = false) {
  const address = getAddress();
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error('InsuranceManagement address not configured');
  }
  const abi = CONTRACT_ABIS.InsuranceManagement;
  const provider = getProvider();
  if (!provider) throw new Error('Provider not available');
  if (readonly) return new ethers.Contract(address, abi, provider);
  let signer = await getSigner();
  if (!signer) {
    await ensureCorrectNetwork();
    await connectWallet();
    signer = await getSigner();
  }
  if (!signer) throw new Error('Wallet not connected. Please connect MetaMask.');
  return new ethers.Contract(address, abi, signer);
}

// Patient-facing

export async function requestReview(insurer) {
  if (!insurer) throw new Error('Insurer address is required');
  const c = await getContract(false);
  const tx = await c.requestReview(insurer);
  const receipt = await tx.wait();
  return { success: receipt.status === 1, tx: receipt };
}

export async function cancelApplication(insurer, reason = '') {
  if (!insurer) throw new Error('Insurer address is required');
  const c = await getContract(false);
  const tx = await c.cancelApplication(insurer, reason);
  const receipt = await tx.wait();
  return { success: receipt.status === 1, tx: receipt };
}

// Insurer-facing

export async function grantInsurance(patient) {
  const c = await getContract(false);
  const tx = await c.grantInsurance(patient);
  const receipt = await tx.wait();
  return { success: receipt.status === 1, tx: receipt };
}

export async function rejectInsurance(patient, reason = '') {
  const c = await getContract(false);
  const tx = await c.rejectInsurance(patient, reason);
  const receipt = await tx.wait();
  return { success: receipt.status === 1, tx: receipt };
}

export async function updateReason(patient, reason = '') {
  const c = await getContract(false);
  const tx = await c.updateReason(patient, reason);
  const receipt = await tx.wait();
  return { success: receipt.status === 1, tx: receipt };
}

// Views / analytics

// For insurer admin views: infer insurer from connected wallet
export async function getApplication(patient) {
  const c = await getContract(true);
  const provider = getProvider();
  const signer = provider?.getSigner?.();
  if (!signer) throw new Error('Wallet not connected');
  const insurer = await signer.getAddress();
  return await c.getApplication(patient, insurer);
}

export async function getPatientApplications(patient) {
  const c = await getContract(true);
  return await c.getPatientApplications(patient);
}

export async function getInsurerApplications(insurer, status = 0) {
  const c = await getContract(true);
  // status is an enum index; 0 = None (no filter)
  return await c.getInsurerApplications(insurer, status);
}

// Convenience for existing admin UI: return patient addresses for current insurer with optional paging
export async function getApplicants(offset = 0, limit = 50) {
  const provider = getProvider();
  const signer = provider?.getSigner?.();
  if (!signer) throw new Error('Wallet not connected');
  const insurer = await signer.getAddress();
  const apps = await getInsurerApplications(insurer, 0);
  const start = offset < 0 ? 0 : offset;
  const end = Math.min(start + limit, apps.length);
  const slice = apps.slice(start, end);
  return slice.map(a => a.patient);
}

// Granted list for current insurer admin; mirrors previous getGranted() shape (addresses)
export async function getGranted(offset = 0, limit = 50) {
  const provider = getProvider();
  const signer = provider?.getSigner?.();
  if (!signer) throw new Error('Wallet not connected');
  const insurer = await signer.getAddress();
  // Status index 2 = Granted (None=0, Pending=1, Granted=2, Rejected=3, Cancelled=4)
  const apps = await getInsurerApplications(insurer, 2);
  const start = offset < 0 ? 0 : offset;
  const end = Math.min(start + limit, apps.length);
  const slice = apps.slice(start, end);
  return slice.map(a => a.patient);
}

// Rejected list for current insurer admin; mirrors previous getRejected() shape (addresses)
export async function getRejected(offset = 0, limit = 50) {
  const provider = getProvider();
  const signer = provider?.getSigner?.();
  if (!signer) throw new Error('Wallet not connected');
  const insurer = await signer.getAddress();
  // Status index 3 = Rejected (None=0, Pending=1, Granted=2, Rejected=3, Cancelled=4)
  const apps = await getInsurerApplications(insurer, 3);
  const start = offset < 0 ? 0 : offset;
  const end = Math.min(start + limit, apps.length);
  const slice = apps.slice(start, end);
  return slice.map(a => a.patient);
}

export async function getTotals() {
  const c = await getContract(true);
  const res = await c.totals();
  return {
    pending: Number(res[0]),
    granted: Number(res[1]),
    rejected: Number(res[2]),
    cancelled: Number(res[3]),
  };
}

export default {
  requestReview,
  cancelApplication,
  grantInsurance,
  rejectInsurance,
  updateReason,
  getApplication,
  getPatientApplications,
  getInsurerApplications,
  getApplicants,
  getGranted,
  getRejected,
  getTotals,
};
