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
  // Ensure we're on the correct network before requesting accounts
  await ensureCorrectNetwork();
  const accounts = await eth.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(eth, 'any');
  const signer = await provider.getSigner();
  cachedProvider = provider;
  cachedSigner = signer;
  return { accounts, provider, signer };
}

export function getProvider() {
  if (cachedProvider) return cachedProvider;
  const eth = getWindowEthereum();
  if (!eth) return null;
  cachedProvider = new ethers.providers.Web3Provider(eth, 'any');
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

  // Accept common local chains: 0x7A69 (31337 Hardhat), 0x539 (1337 Ganache alt), 0x1691 (5777 Ganache)
  const validLocalChains = new Set(['0x7a69', '0x7A69', '0x539', '0x1691']);
  if (validLocalChains.has(current)) return;

  // Prefer Hardhat 31337
  const preferredChainIdHex = '0x7A69';
  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: preferredChainIdHex }],
    });
    return;
  } catch (switchError) {
    // If the chain is not added, attempt to add it
    if (switchError?.code === 4902) {
      await addHardhatNetwork();
      // Try switching again after adding
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: preferredChainIdHex }],
      });
      return;
    }
    // As a fallback, try switching to 1337
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: target?.chainIdHex || '0x539' }],
      });
    } catch (_) {
      throw new Error('Please switch your wallet to the correct network');
    }
  }
}

export async function addHardhatNetwork() {
  const eth = getWindowEthereum();
  if (!eth) throw new Error('MetaMask not available');
  await eth.request({
    method: 'wallet_addEthereumChain',
    params: [{
      chainId: '0x7A69',
      chainName: 'Hardhat Local',
      rpcUrls: ['http://127.0.0.1:8545'],
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
    }],
  });
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
    // RPC rate limit / provider saturation errors (MetaMask, Infura/Alchemy, local node)
    const msg = (err?.message || '').toLowerCase();
    const reason = (err?.reason || '').toLowerCase();
    const dataMsg = (err?.data?.message || '').toLowerCase();
    const combined = `${msg} ${reason} ${dataMsg}`;
    if (
      err?.code === -32005 ||
      combined.includes('rate limit') ||
      combined.includes('too many request') ||
      combined.includes('endpoint returned too many errors') ||
      combined.includes('gateway timeout') ||
      combined.includes('timeout')
    ) {
      throw new Error(
        'RPC endpoint is rate-limited or unavailable. Please ensure your local node is running (Hardhat/Anvil/Ganache), switch to the correct localhost network in MetaMask, and try again. If using a hosted RPC, wait a minute and retry or change the RPC URL.'
      );
    }
    if (combined.includes('network error') || combined.includes('failed to fetch') || combined.includes('connection not open')) {
      throw new Error('Network error connecting to RPC. Verify your internet/RPC node, then reload the dApp and your wallet network.');
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
  addHardhatNetwork,
  subscribeWalletEvents,
  sendTx,
  resetCache,
};


