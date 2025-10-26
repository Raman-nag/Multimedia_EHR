# Web3 & Authentication Integration

## Summary

Created comprehensive Web3 and Authentication context providers for the Multimedia EHR frontend.

## Completed Components

### 1. Web3Context (`frontend/src/contexts/Web3Context.jsx`)
**Purpose:** Manages Web3 wallet connection and blockchain interactions

**Features Implemented:**
- ✅ Wallet connection state management
- ✅ Account address tracking
- ✅ Network information (chain ID, network name)
- ✅ Contract instance management (placeholder)
- ✅ Network switching capability
- ✅ Persistent connection state (localStorage)
- ✅ Error handling
- ✅ Loading states
- ✅ Mock implementation for development

**Key Functions:**
- `connectWallet()` - Connect to Web3 wallet (MetaMask simulation)
- `disconnectWallet()` - Disconnect wallet
- `switchNetwork(chainId)` - Switch between networks
- `getContract(contractName)` - Get contract instances
- `clearError()` - Clear error state
- `getShortAddress()` - Get shortened address for display
- `isSupportedNetwork()` - Check if current network is supported

**Network Support:**
- Ethereum Mainnet (chainId: 1)
- Testnets: Ropsten, Rinkeby, Goerli, Kovan
- Polygon Mainnet (chainId: 137)
- Mumbai Testnet (chainId: 80001)
- Local development: Localhost 8545 (1337), Ganache (5777)

**Mock Implementation:**
```javascript
// Mock wallet address and chain ID for development
const mockAccount = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
const mockChainId = '1337'; // Localhost
```

### 2. AuthContext (`frontend/src/contexts/AuthContext.jsx`)
**Purpose:** Manages user authentication and role-based access control

**Features Implemented:**
- ✅ User authentication state
- ✅ Role-based access control (Patient/Doctor/Hospital)
- ✅ User profile management
- ✅ Login/logout functionality
- ✅ Profile updates
- ✅ Protected route logic
- ✅ Persistent authentication (localStorage)
- ✅ User display name generation
- ✅ Error handling

**Key Functions:**
- `login(email, password, role)` - Authenticate user
- `logout()` - Logout user
- `updateProfile(profileData)` - Update user profile
- `hasRole(roles)` - Check if user has specific role(s)
- `checkAuth()` - Verify authentication status
- `clearError()` - Clear error state
- `getUserDisplayName()` - Get formatted display name

**Supported Roles:**
- `patient` - Regular patients
- `doctor` - Medical doctors
- `hospital` - Hospital administrators

**Mock Authentication:**
Uses mock data from `mockData.js` for development
- Validates email against mock user data
- Generates mock authentication token
- Persists session in localStorage

### 3. Documentation (`frontend/src/contexts/README.md`)
Complete documentation with:
- Usage examples for all contexts
- API reference for all exposed values
- Setup instructions
- Mock implementation details
- TODO items for production

## Integration

Both contexts are already integrated in the router (`frontend/src/routes/index.jsx`):

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

## Usage Examples

### Using Web3Context
```jsx
import { useWeb3 } from '../contexts/Web3Context';

function WalletButton() {
  const { isConnected, account, connectWallet, disconnectWallet } = useWeb3();
  
  if (isConnected) {
    return (
      <div>
        <p>Connected: {account}</p>
        <button onClick={disconnectWallet}>Disconnect</button>
      </div>
    );
  }
  
  return <button onClick={connectWallet}>Connect Wallet</button>;
}
```

### Using AuthContext
```jsx
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { isAuthenticated, userProfile, logout, displayName } = useAuth();
  
  if (!isAuthenticated) return <div>Please login</div>;
  
  return (
    <div>
      <h1>Welcome, {displayName}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## TODO: Production Implementation

### Web3Context
1. Replace mock `connectWallet()` with actual MetaMask integration:
   ```javascript
   const accounts = await window.ethereum.request({ 
     method: 'eth_requestAccounts' 
   });
   ```

2. Add event listeners for:
   - Account changes: `window.ethereum.on('accountsChanged', ...)`
   - Network changes: `window.ethereum.on('chainChanged', ...)`

3. Implement real contract instantiation with ethers.js:
   ```javascript
   const contract = new ethers.Contract(address, abi, signer);
   ```

4. Add transaction status tracking
5. Implement contract method calls
6. Add event listening for contract events

### AuthContext
1. Replace mock login with actual API call:
   ```javascript
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     body: JSON.stringify({ email, password, role })
   });
   ```

2. Add JWT token validation
3. Implement token refresh logic
4. Add session timeout handling
5. Integrate with blockchain for role verification
6. Add biometric authentication support

## Files Created/Modified

### Created:
- ✅ `frontend/src/contexts/Web3Context.jsx` (236 lines)
- ✅ `frontend/src/contexts/AuthContext.jsx` (243 lines)
- ✅ `frontend/src/contexts/README.md` (174 lines)
- ✅ `WEB3_AUTH_INTEGRATION.md` (this file)

### Existing (already configured):
- ✅ `frontend/src/routes/index.jsx` - Already has context providers integrated
- ✅ `frontend/src/contexts/ThemeContext.jsx` - Existing theme management

## Testing

To test the integration:

1. **Web3Context:**
   - Call `connectWallet()` to simulate wallet connection
   - Check that `account` and `networkName` are set
   - Verify localStorage persistence after page refresh

2. **AuthContext:**
   - Login with mock credentials from `mockData.js`
   - Check authentication state in localStorage
   - Verify role-based access control

## Next Steps

1. Implement IPFSContext for file storage
2. Connect contexts to actual blockchain contracts
3. Add protected route wrappers
4. Implement error boundaries for context errors
5. Add loading states for async operations
6. Create custom hooks for common patterns
