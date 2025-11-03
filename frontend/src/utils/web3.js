import { ethers } from 'ethers';
import { DEFAULT_NETWORK_KEY, NETWORKS } from '../config/contractConfig';

let cachedProvider = null;
let cachedSigner = null;

export const getWindowEthereum = () => (typeof window !== 'undefined' ? window.ethereum : undefined);

export async function connectWallet() {
  const eth = getWindowEthereum();
  if (!eth) {
    throw new Error('MetaMask is not installed');
  }
  const accounts = await eth.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(eth, 'any');
  const signer = await provider.getSigner();
  cachedProvider = provider;
  cachedSigner = signer;
  return { accounts, provider, signer };
}

export function getProvider() {
  if (cachedProvider) return cachedProvider;
  const eth = getWindowEthereum();
  if (!eth) return null;
  cachedProvider = new ethers.BrowserProvider(eth, 'any');
  return cachedProvider;
}

export async function getSigner() {
  if (cachedSigner) return cachedSigner;
  const provider = getProvider();
  if (!provider) return null;
  cachedSigner = await provider.getSigner();
  return cachedSigner;
}

export async function getChainId() {
  const provider = getProvider();
  if (!provider) return null;
  const network = await provider.getNetwork();
  return Number(network.chainId);
}

export async function ensureCorrectNetwork(targetKey = DEFAULT_NETWORK_KEY) {
  const eth = getWindowEthereum();
  if (!eth) throw new Error('MetaMask not available');
  const target = NETWORKS[targetKey];
  const current = await eth.request({ method: 'eth_chainId' });
  if (current?.toLowerCase() !== target.chainIdHex) {
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: target.chainIdHex }],
      });
    } catch (switchError) {
      throw new Error('Please switch your wallet to the correct network');
    }
  }
}

export function subscribeWalletEvents({ onAccountsChanged, onChainChanged }) {
  const eth = getWindowEthereum();
  if (!eth) return () => {};
  if (onAccountsChanged) eth.on('accountsChanged', onAccountsChanged);
  if (onChainChanged) eth.on('chainChanged', onChainChanged);
  return () => {
    if (onAccountsChanged) eth.removeListener('accountsChanged', onAccountsChanged);
    if (onChainChanged) eth.removeListener('chainChanged', onChainChanged);
  };
}

export async function sendTx(txPromise, { onPending, onSuccess, onError } = {}) {
  try {
    const tx = await txPromise;
    if (onPending) onPending(tx.hash);
    const receipt = await tx.wait();
    if (onSuccess) onSuccess(receipt);
    return receipt;
  } catch (err) {
    if (onError) onError(err);
    // Normalize common errors
    if (err?.code === 4001) {
      throw new Error('User rejected the transaction');
    }
    throw err;
  }
}

export function resetCache() {
  cachedProvider = null;
  cachedSigner = null;
}

export default {
  connectWallet,
  getProvider,
  getSigner,
  getChainId,
  ensureCorrectNetwork,
  subscribeWalletEvents,
  sendTx,
  resetCache,
};


