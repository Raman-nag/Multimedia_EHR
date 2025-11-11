/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function readJson(p) {
  const data = fs.readFileSync(p, 'utf8');
  return JSON.parse(data);
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function main() {
  // Assume this script is run from frontend/ as CWD
  const frontendDir = process.cwd();
  const backendArtifact = path.resolve(frontendDir, '../backend/artifacts/contracts/PatientManagement.sol/PatientManagement.json');
  const frontendAbiPath = path.resolve(frontendDir, 'src/config/abis/PatientManagement.json');

  if (!fs.existsSync(backendArtifact)) {
    console.warn('[sync-abi] Backend artifact not found at', backendArtifact);
    console.warn('[sync-abi] Skipping ABI sync. Make sure to compile backend first.');
    process.exit(0);
  }

  let artifact;
  try {
    artifact = readJson(backendArtifact);
  } catch (e) {
    console.error('[sync-abi] Failed to read backend artifact:', e.message);
    process.exit(1);
  }

  const abi = Array.isArray(artifact) ? artifact : artifact.abi;
  if (!Array.isArray(abi)) {
    console.error('[sync-abi] Artifact does not contain an ABI array.');
    process.exit(1);
  }

  // Validate presence of required functions
  const names = new Set(
    abi
      .filter((e) => e && e.type === 'function' && e.name)
      .map((e) => e.name)
  );

  const required = ['requestAccess', 'getPendingRequests', 'cancelRequest', 'rejectRequest'];
  const missing = required.filter((n) => !names.has(n));
  if (missing.length > 0) {
    console.warn('[sync-abi] Warning: required functions missing from ABI:', missing);
  }

  // Write ABI array to frontend path
  writeJson(frontendAbiPath, abi);
  console.log('[sync-abi] Wrote ABI to', frontendAbiPath, `(${abi.length} entries)`);

  // Emit quick summary for devs
  console.log('[sync-abi] Exposed functions sample:', Array.from(names).slice(0, 10));
}

main();
