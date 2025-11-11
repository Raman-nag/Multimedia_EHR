import { IPFS_CONFIG } from '../config/contractConfig';

export function validateFile(file) {
  if (!file) return 'No file provided';
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > IPFS_CONFIG.maxFileSizeMb) {
    return `File too large. Max ${IPFS_CONFIG.maxFileSizeMb}MB`;
  }
  if (IPFS_CONFIG.allowedMimeTypes.length && !IPFS_CONFIG.allowedMimeTypes.includes(file.type)) {
    return `Unsupported file type: ${file.type}`;
  }
  return null;
}

// Upload a single file to Pinata/IPFS
export async function uploadToIPFS(file, onProgress) {
  const list = Array.isArray(file) ? file : [file];
  if (list.length !== 1) {
    // keep strict single-file semantics for this method
    throw new Error('uploadToIPFS expects a single file. Use uploadMultipleToIPFS for multiple files.');
  }

  const f = list[0];
  const err = validateFile(f);
  if (err) throw new Error(err);

  const formData = new FormData();
  formData.append('file', f);

  const headers = {};
  if (IPFS_CONFIG.pinataApiKey) headers['pinata_api_key'] = IPFS_CONFIG.pinataApiKey;
  if (IPFS_CONFIG.pinataSecretApiKey) headers['pinata_secret_api_key'] = IPFS_CONFIG.pinataSecretApiKey;

  const res = await fetch(IPFS_CONFIG.pinataEndpoint, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IPFS upload failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (onProgress) onProgress(100);
  return data.IpfsHash || data.ipfsHash || data.hash;
}

// Sequentially upload multiple files, one request per file.
// Returns an array of CIDs. onProgress is overall [0-100]. onEach is per-file callback({ index, total, cid })
export async function uploadMultipleToIPFS(files, onProgress, onEach) {
  const list = Array.isArray(files) ? files : [files];
  const total = list.length;
  const cids = [];
  for (let i = 0; i < total; i++) {
    const file = list[i];
    const cid = await uploadToIPFS(file);
    cids.push(cid);
    if (typeof onEach === 'function') onEach({ index: i + 1, total, cid });
    if (typeof onProgress === 'function') onProgress(Math.round(((i + 1) / total) * 100));
  }
  return cids;
}

export function ipfsUrl(cid, path = '') {
  if (!cid) return '';
  return `${IPFS_CONFIG.gateway}${cid}${path ? `/${path}` : ''}`;
}

export default { uploadToIPFS, uploadMultipleToIPFS, ipfsUrl, validateFile };


