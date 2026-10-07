import { createRemoteJWKSet, jwtVerify } from 'jose';
import { firebaseConfig } from './firebase-config.js';
import { HttpError } from './firestore.js';

const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
export async function requireAdmin(request, adminUids, keySet = googleKeys) {
  const allowed = (adminUids || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!allowed.length) throw new HttpError(503, 'Admin access is not configured. Set ADMIN_UIDS on the Worker.');
  const token = request.headers.get('Authorization')?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) throw new HttpError(401, 'Please sign in.');
  let payload;
  try {
    ({ payload } = await jwtVerify(token, keySet, {
      algorithms: ['RS256'],
      issuer: `https://securetoken.google.com/${firebaseConfig.projectId}`,
      audience: firebaseConfig.projectId,
      requiredClaims: ['exp', 'iat', 'auth_time', 'sub'],
    }));
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 128 ||
        typeof payload.iat !== 'number' || payload.iat > now ||
        typeof payload.auth_time !== 'number' || payload.auth_time > now) throw new Error('Invalid claims');
  } catch {
    throw new HttpError(401, 'Your session is invalid or expired. Please sign in again.');
  }
  if (!allowed.includes(payload.sub)) throw new HttpError(403, 'This account is not an authorized website admin.');
  return { token, uid: payload.sub };
}
