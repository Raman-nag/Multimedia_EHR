# Context Providers

This directory contains React Context providers for managing global application state.

## Contexts

### 1. ThemeContext.jsx
Manages the application's theme (light/dark mode).

**Usage:**
```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return <button onClick={toggleTheme}>Current theme: {theme}</button>;
}
```

### 2. Web3Context.jsx
Manages Web3 wallet connection and blockchain interactions.

**Features:**
- Wallet connection state management
- Account and network information
- Contract instance management
- Network switching
- Persistent connection state (localStorage)

**Usage:**
```jsx
import { useWeb3 } from '../contexts/Web3Context';

function ConnectWallet() {
  const { 
    isConnected, 
    account, 
    connectWallet, 
    disconnectWallet,
    networkName 
  } = useWeb3();
  
  if (isConnected) {
    return (
      <div>
        <p>Connected: {account}</p>
        <p>Network: {networkName}</p>
        <button onClick={disconnectWallet}>Disconnect</button>
      </div>
    );
  }
  
  return <button onClick={connectWallet}>Connect Wallet</button>;
}
```

**Exposed Values:**
- `isConnected` - Boolean indicating if wallet is connected
- `account` - Connected wallet address
- `networkId` - Current network ID
- `chainId` - Current chain ID
- `networkName` - Human-readable network name
- `isConnecting` - Boolean indicating connection in progress
- `error` - Error message if any
- `contracts` - Object containing contract instances
- `shortAddress` - Shortened address for display
- `connectWallet()` - Connect wallet function
- `disconnectWallet()` - Disconnect wallet function
- `switchNetwork(chainId)` - Switch network
- `getContract(contractName)` - Get contract instance
- `clearError()` - Clear error state

### 3. AuthContext.jsx
Manages user authentication and authorization.

**Features:**
- User authentication state
- Role-based access control (Patient/Doctor/Hospital)
- User profile management
- Protected route logic
- Persistent authentication (localStorage)

**Usage:**
```jsx
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { 
    isAuthenticated, 
    userProfile, 
    userRole, 
    displayName,
    logout 
  } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {displayName}</h1>
      <p>Role: {userRole}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Exposed Values:**
- `isAuthenticated` - Boolean indicating if user is logged in
- `isLoading` - Boolean indicating loading state
- `user` - User object
- `userRole` - User role ('patient', 'doctor', 'hospital')
- `userProfile` - User profile information
- `token` - Authentication token
- `error` - Error message if any
- `isPatient` - Boolean helper for patient role
- `isDoctor` - Boolean helper for doctor role
- `isHospital` - Boolean helper for hospital role
- `displayName` - User's display name
- `avatar` - User avatar URL (placeholder for now)
- `login(email, password, role)` - Login function
- `logout()` - Logout function
- `updateProfile(profileData)` - Update user profile
- `hasRole(roles)` - Check if user has specific role(s)
- `checkAuth()` - Check if user is authenticated
- `clearError()` - Clear error state

### 4. IPFSContext.jsx
Manages IPFS interactions for file storage.

**Status:** TBD - To be implemented

## Setup

All contexts are already set up in the main router (`src/routes/index.jsx`):

```jsx
<ThemeProvider>
  <Web3Provider>
    <IPFSProvider>
      <AuthProvider>
        {/* App content */}
      </AuthProvider>
    </IPFSProvider>
  </Web3Provider>
</ThemeProvider>
```

## Mock Implementation

Currently, both Web3Context and AuthContext use mock implementations for development:

**Web3Context:**
- `connectWallet()` - Simulates wallet connection with mock address
- `switchNetwork()` - Simulates network switching
- Contract instances are placeholders

**AuthContext:**
- `login()` - Uses mock data from `mockData.js`
- Authentication is simulated with localStorage
- No actual API calls or blockchain verification

**TODO for Production:**
- Replace mock implementations with actual MetaMask/Ethereum integration
- Implement actual blockchain contract calls
- Add real authentication API integration
- Implement IPFS file upload/download
- Add proper error handling and retry logic
- Add transaction status tracking
- Implement event listeners for blockchain events
