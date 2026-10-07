import { auth } from '../firebase.js';
export async function adminRequest(collection, mutation) {
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in again.');
  const token = await user.getIdToken();
  const response = await fetch(`/api/admin/content/${collection ? `?collection=${encodeURIComponent(collection)}` : ''}`, {
    method: mutation ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, ...(mutation ? { 'Content-Type': 'application/json' } : {}) },
    ...(mutation ? { body: JSON.stringify(mutation) } : {}),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'The request failed.');
  return result;
}
