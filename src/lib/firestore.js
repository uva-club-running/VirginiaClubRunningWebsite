import { firebaseConfig } from './firebase-config.js';

export const documentRoot = `projects/${firebaseConfig.projectId}/databases/(default)/documents`;
const base = `https://firestore.googleapis.com/v1/${documentRoot}`;
export const collections = ['Meets', 'Events', 'Records', 'AllAmericans', 'Philanthropy'];

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function decodeValue(value) {
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
  return null;
}
export function decodeFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}
export function encodeFields(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => {
    if (value instanceof Date) return [key, { timestampValue: value.toISOString() }];
    if (value === null) return [key, { nullValue: null }];
    if (typeof value === 'number') return [key, Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }];
    if (typeof value === 'boolean') return [key, { booleanValue: value }];
    if (typeof value === 'string') return [key, { stringValue: value }];
    throw new TypeError(`Unsupported field: ${key}`);
  }));
}

async function request(path, { token, ...options } = {}, fetcher = fetch) {
  const response = await fetcher(`${base}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal: AbortSignal.timeout(15000),
  });
  if (response.status === 404 && (!options.method || options.method === 'GET')) return null;
  if (!response.ok) {
    // Do not expose Google response bodies or credentials to clients.
    const status = response.status === 403 ? 403 : response.status === 401 ? 401 : 503;
    throw new HttpError(status, status === 403 ? 'Firestore denied access. Check the published security rules.' : 'Firebase is unavailable. Please try again.');
  }
  return response.json();
}
export async function listDocuments(collection, token, fetcher = fetch) {
  if (!collections.includes(collection)) throw new HttpError(400, 'Unknown collection.');
  const documents = [];
  let pageToken;
  do {
    const params = new URLSearchParams({ pageSize: '300' });
    if (pageToken) params.set('pageToken', pageToken);
    const page = await request(`/${collection}?${params}`, { token }, fetcher);
    for (const item of page?.documents || []) {
      documents.push({ ...decodeFields(item.fields || {}), id: item.name.split('/').at(-1) });
    }
    pageToken = page?.nextPageToken;
  } while (pageToken);
  return documents;
}
export async function getDocument(collection, id, token, fetcher = fetch) {
  const item = await request(`/${collection}/${encodeURIComponent(id)}`, { token }, fetcher);
  return item ? { ...decodeFields(item.fields || {}), id } : null;
}
export async function commit(writes, token, fetcher = fetch) {
  return request(':commit', { method: 'POST', token, body: JSON.stringify({ writes }) }, fetcher);
}
