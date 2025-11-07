// Grant HOSPITAL_ADMIN_ROLE to HospitalManagement contract on DoctorManagement
// Usage: node backend/scripts/grant-roles.js

const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');

async function main() {
  const deploymentsPath = path.resolve(__dirname, '..', 'deployments.json');
  if (!fs.existsSync(deploymentsPath)) {
    throw new Error('deployments.json not found. Deploy contracts first.');
  }
  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf-8'));
  const doctorAddr = deployments.DoctorManagement;
  const hospitalMgrAddr = deployments.HospitalManagement;
  if (!doctorAddr || !hospitalMgrAddr) {
    throw new Error('DoctorManagement or HospitalManagement address missing in deployments.json');
  }

  // Local Hardhat default
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
  const signer = process.env.PRIVATE_KEY
    ? new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    : provider.getSigner(0);

  // Load ABI
  const dmArtifactPath = path.resolve(__dirname, '..', 'artifacts', 'contracts', 'DoctorManagement.sol', 'DoctorManagement.json');
  if (!fs.existsSync(dmArtifactPath)) {
    throw new Error('DoctorManagement artifact not found. Compile first.');
  }
  const dmArtifact = JSON.parse(fs.readFileSync(dmArtifactPath, 'utf-8'));

  const doctor = new ethers.Contract(doctorAddr, dmArtifact.abi, signer);

  const role = await doctor.HOSPITAL_ADMIN_ROLE();
  const hasRole = await doctor.hasRole(role, hospitalMgrAddr).catch(() => false);
  if (hasRole) {
    console.log('HospitalManagement already has HOSPITAL_ADMIN_ROLE');
    return;
  }

  console.log('Granting HOSPITAL_ADMIN_ROLE to HospitalManagement:', hospitalMgrAddr);
  const tx = await doctor.grantRole(role, hospitalMgrAddr);
  console.log('Tx submitted:', tx.hash);
  await tx.wait();
  console.log('Role granted successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


