import React, { createContext, useContext, useEffect, useState } from 'react';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  // Wallet connection state
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState('Unknown');
  
  // Connection status
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  
  // Mock contract instances (placeholder)
  const [contracts, setContracts] = useState({
    EMRSystem: null,
    PatientManagement: null,
    DoctorManagement: null,
    HospitalManagement: null,
  });

  // Check if wallet is already connected (persisted state)
  useEffect(() => {
    const savedAccount = localStorage.getItem('wallet_account');
    const savedNetwork = localStorage.getItem('wallet_network');
    
    if (savedAccount) {
      // Simulate reconnection
      setAccount(savedAccount);
      setIsConnected(true);
      setNetworkId(savedNetwork || '1337'); // Default to localhost
    
      // Get network name
      const network = getNetworkName(savedNetwork || '1337');
      setNetworkName(network);
    }
  }, []);

  // Get network name by chain ID
  const getNetworkName = (chainId) => {
    const networks = {
      '1': 'Ethereum Mainnet',
      '3': 'Ropsten Testnet',
      '4': 'Rinkeby Testnet',
      '5': 'Goerli Testnet',
      '42': 'Kovan Testnet',
      '137': 'Polygon Mainnet',
      '80001': 'Mumbai Testnet',
      '1337': 'Localhost 8545',
      '5777': 'Ganache',
    };
    return networks[chainId] || `Network ${chainId}`;
  };

  // Connect wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // TODO: Replace with actual MetaMask/Web3 connection
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      // Simulate MetaMask connection
      // In real implementation, this would be:
      // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Mock connection for now
      const mockAccount = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      const mockChainId = '1337'; // Localhost

      setAccount(mockAccount);
      setChainId(mockChainId);
      setNetworkId(mockChainId);
      setNetworkName(getNetworkName(mockChainId));
      setIsConnected(true);

      // Persist to localStorage
      localStorage.setItem('wallet_account', mockAccount);
      localStorage.setItem('wallet_network', mockChainId);

      // Listen for account changes
      // TODO: Add actual event listeners for window.ethereum
      
      console.log('Connected to wallet:', mockAccount);
      
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setNetworkId(null);
    setChainId(null);
    setNetworkName('Unknown');
    setContracts({
      EMRSystem: null,
      PatientManagement: null,
      DoctorManagement: null,
      HospitalManagement: null,
    });

    // Clear localStorage
    localStorage.removeItem('wallet_account');
    localStorage.removeItem('wallet_network');

    console.log('Disconnected from wallet');
  };

  // Switch network
  const switchNetwork = async (targetChainId) => {
    try {
      // TODO: Replace with actual network switching
      // In real implementation, this would be:
      // await window.ethereum.request({
      //   method: 'wallet_switchEthereumChain',
      //   params: [{ chainId: targetChainId }],
      // });

      // Mock network switch
      setChainId(targetChainId);
      setNetworkId(targetChainId);
      setNetworkName(getNetworkName(targetChainId));

      // Persist to localStorage
      localStorage.setItem('wallet_network', targetChainId);

      console.log('Switched to network:', getNetworkName(targetChainId));
      
    } catch (err) {
      console.error('Failed to switch network:', err);
      setError(err.message || 'Failed to switch network');
    }
  };

  // Get contract instance
  const getContract = async (contractName) => {
    try {
      // TODO: Replace with actual contract instantiation
      // This is a placeholder for contract instances
      
      if (contracts[contractName]) {
        return contracts[contractName];
      }

      // Mock contract instance
      const mockContract = {
        address: '0x...', // Would be actual deployed address
        methods: {},
        events: {},
      };

      setContracts(prev => ({
        ...prev,
        [contractName]: mockContract,
      }));

      return mockContract;
      
    } catch (err) {
      console.error(`Failed to get contract ${contractName}:`, err);
      setError(err.message || `Failed to get contract ${contractName}`);
      return null;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Get short account address for display
  const getShortAddress = () => {
    if (!account) return null;
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  // Check if network is supported
  const isSupportedNetwork = () => {
    const supportedNetworks = ['1337', '5777']; // Localhost networks
    return supportedNetworks.includes(chainId || '');
  };

  const value = {
    // State
    isConnected,
    account,
    networkId,
    chainId,
    networkName,
    isConnecting,
    error,
    contracts,
    
    // Computed
    shortAddress: getShortAddress(),
    isSupportedNetwork: isSupportedNetwork(),
    
    // Functions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getContract,
    clearError,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
