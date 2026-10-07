import { requireAdmin } from './auth.js';
import { HttpError, listDocuments } from './firestore.js';
import { saveContent } from './mutations.js';

const json = (value, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'Vary': 'Authorization' } });
export async function handleAdmin(request, adminUids, dependencies = {}) {
  const { authorize = requireAdmin, list = listDocuments, save = saveContent } = dependencies;
  try {
    const url = new URL(request.url);
    if (!['GET', 'POST'].includes(request.method)) throw new HttpError(405, 'Method not allowed.');
    if (request.method === 'POST') {
      if (request.headers.get('Origin') !== url.origin) throw new HttpError(403, 'Cross-origin submissions are not allowed.');
      if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new HttpError(415, 'Expected JSON.');
      if (Number(request.headers.get('Content-Length')) > 20000) throw new HttpError(413, 'Submission is too large.');
    }
    const { uid, token } = await authorize(request, adminUids);
    if (request.method === 'GET') {
      const collection = url.searchParams.get('collection');
      return json(collection ? { documents: await list(collection, token) } : { uid });
    }
    const reader = request.body?.getReader();
    if (!reader) throw new HttpError(400, 'Missing submission.');
    const chunks = [];
    let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 20000) { await reader.cancel(); throw new HttpError(413, 'Submission is too large.'); }
      chunks.push(value);
    }
    let input;
    try { input = JSON.parse(await new Blob(chunks).text()); } catch { throw new HttpError(400, 'Invalid JSON.'); }
    return json(await save(input, token));
  } catch (error) {
    if (!(error instanceof HttpError)) console.error('Admin request failed:', error.name);
    return json({ error: error instanceof HttpError ? error.message : 'The request could not be completed. Please retry.' }, error.status || 500);
  }
}
