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

export async function uploadToIPFS(files, onProgress) {
  const list = Array.isArray(files) ? files : [files];
  const formData = new FormData();
  list.forEach((f) => {
    const err = validateFile(f);
    if (err) throw new Error(err);
    formData.append('file', f);
  });

  const res = await fetch(IPFS_CONFIG.pinataEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${IPFS_CONFIG.pinataSecretApiKey || ''}`,
      pinata_api_key: IPFS_CONFIG.pinataApiKey || '',
      pinata_secret_api_key: IPFS_CONFIG.pinataSecretApiKey || '',
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IPFS upload failed: ${res.status} ${text}`);
  }

  // Pinata returns IpfsHash
  const data = await res.json();
  if (onProgress) onProgress(100);
  return data.IpfsHash || data.ipfsHash || data.hash;
}

export function ipfsUrl(cid, path = '') {
  if (!cid) return '';
  return `${IPFS_CONFIG.gateway}${cid}${path ? `/${path}` : ''}`;
}

export default { uploadToIPFS, ipfsUrl, validateFile };


