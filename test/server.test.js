import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';
import { requireAdmin } from '../src/lib/auth.js';
import { firebaseConfig } from '../src/lib/firebase-config.js';
import { decodeFields, encodeFields, listDocuments, HttpError } from '../src/lib/firestore.js';
import { validateMutation, mutationWrites, saveContent } from '../src/lib/mutations.js';
import { serveCachedPage } from '../src/lib/page-cache.js';
import { handleAdmin } from '../src/lib/admin-handler.js';
import { groupRecords, formatDate, safeLink, calendarDay, semester } from '../src/lib/content.js';

const valid = { operation: 'create', collection: 'Meets', id: 'test-id', data: { name: 'Test meet', date: '2026-10-06', location: 'UVA', results: '' } };
const request = (body = valid, overrides = {}) => new Request('https://club.example/api/admin/content/', { method: 'POST', headers: { Origin: 'https://club.example', 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...overrides });

test('all admin mutation types invalidate exactly their dependent page atomically', () => {
  const cases = [valid,
    { ...valid, operation: 'updateResults', data: { results: 'https://example.com/results' } },
    { ...valid, collection: 'Events', data: { name: '5K', type: 'Track' } },
    { ...valid, collection: 'Records', data: { name: 'Runner', eventId: 'event-id', category: 'Men', time: '15:00', year: '2026' } },
    { ...valid, collection: 'AllAmericans', data: { name: 'Runner', eventId: 'event-id', semester: 'Fall', place: '1', year: '2026', time: '' } },
    { ...valid, collection: 'Philanthropy', data: { name: 'Fun Run', date: '2026-10-06' } }];
  for (const input of cases) {
    const writes = mutationWrites(validateMutation(input), 'revision');
    const page = input.collection === 'Meets' ? 'meets' : input.collection === 'Philanthropy' ? 'philanthropy' : 'records';
    assert.equal(writes.length, 2);
    assert.ok(writes[1].update.name.endsWith(`/SiteCache/${page}`));
    assert.equal(writes[1].updateTransforms[0].setToServerValue, 'REQUEST_TIME');
    if (input.operation === 'updateResults') {
      assert.deepEqual(writes[0].updateMask.fieldPaths, ['results']);
      assert.equal(writes[0].currentDocument.exists, true);
    } else assert.equal(writes[0].currentDocument.exists, false);
  }
});

test('invalid data and unexpected operations are rejected before writes', () => {
  for (const input of [
    { ...valid, collection: '__proto__' }, { ...valid, operation: 'delete' },
    { ...valid, id: '../private' }, { ...valid, data: { ...valid.data, date: '2026-02-30' } },
    { ...valid, data: { ...valid.data, results: 'javascript:alert(1)' } },
    { ...valid, data: { ...valid.data, results: '//evil.test' } },
    { ...valid, data: { ...valid.data, name: '' } },
  ]) assert.throws(() => validateMutation(input), HttpError);
});

test('Firestore codecs preserve date and numeric fields', () => {
  const data = { time: '15:32.1', place: 2, empty: null, date: new Date('2026-10-06T04:00:00Z') };
  assert.deepEqual(decodeFields(encodeFields(data)), { ...data, date: '2026-10-06T04:00:00.000Z' });
});

test('Firestore reads follow pagination and failures never become empty results', async () => {
  let calls = 0;
  const results = await listDocuments('Meets', undefined, async url => {
    calls++;
    if (calls === 2) assert.ok(url.includes('pageToken=next'));
    return Response.json({ documents: [{ name: `documents/Meets/${calls}`, fields: { name: { stringValue: `Meet ${calls}` } } }], ...(calls === 1 ? { nextPageToken: 'next' } : {}) });
  });
  assert.equal(results.length, 2);
  await assert.rejects(listDocuments('Meets', undefined, async () => new Response('', { status: 503 })));
});

test('save commits data and revision together and reuses a submission ID safely', async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push([url, options]);
    return options.method === 'POST' ? Response.json({}) : new Response('', { status: 404 });
  };
  await saveContent(valid, 'private-token', fetcher);
  assert.equal(calls.length, 2);
  assert.equal(JSON.parse(calls[1][1].body).writes.length, 2);
  assert.equal(calls[1][1].headers.Authorization, 'Bearer private-token');
  const stored = validateMutation(valid).data;
  const retry = await saveContent(valid, 'token', async () => Response.json({ fields: encodeFields(stored) }));
  assert.equal(retry.saved, true);
  await assert.rejects(saveContent({ ...valid, data: { ...valid.data, name: 'Changed' } }, 'token', async () => Response.json({ fields: encodeFields(stored) })), { status: 409 });
});

const pair = await generateKeyPair('RS256');
const publicJwk = await exportJWK(pair.publicKey);
publicJwk.kid = 'test-key';
const keySet = createLocalJWKSet({ keys: [publicJwk] });
async function signed(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ iss: `https://securetoken.google.com/${firebaseConfig.projectId}`, aud: firebaseConfig.projectId, sub: 'admin-id', iat: now - 1, auth_time: now - 1, exp: now + 3600, ...overrides }).setProtectedHeader({ alg: 'RS256', kid: 'test-key' }).sign(pair.privateKey);
}
const bearer = token => new Request('https://club.example/api/admin/content/', { headers: { Authorization: `Bearer ${token}` } });
test('admin authentication verifies signatures, expiry, issuer, audience and allowlist', async () => {
  const good = await signed();
  assert.equal((await requireAdmin(bearer(good), 'admin-id', keySet)).uid, 'admin-id');
  await assert.rejects(requireAdmin(bearer(good), '', keySet), { status: 503 });
  await assert.rejects(requireAdmin(bearer(good), 'someone-else', keySet), { status: 403 });
  for (const changes of [{ exp: 1 }, { iss: 'https://evil.test' }, { aud: 'other-project' }, { auth_time: 9999999999 }, { sub: '' }]) {
    await assert.rejects(requireAdmin(bearer(await signed(changes)), 'admin-id', keySet), { status: 401 });
  }
  await assert.rejects(requireAdmin(bearer('invalid'), 'admin-id', keySet), { status: 401 });
});

test('admin endpoint rejects missing auth, cross-origin writes, invalid JSON and excessive bodies', async () => {
  let saves = 0;
  const deps = { authorize: async () => ({ uid: 'admin', token: 'token' }), save: async () => { saves++; return {}; } };
  assert.equal((await handleAdmin(request(), 'admin')).status, 401);
  assert.equal((await handleAdmin(request(valid, { headers: { Origin: 'https://evil.test', 'Content-Type': 'application/json' } }), 'admin', deps)).status, 403);
  assert.equal((await handleAdmin(request(valid, { body: '{' }), 'admin', deps)).status, 400);
  assert.equal((await handleAdmin(request({ value: 'x'.repeat(21000) }), 'admin', deps)).status, 413);
  assert.equal(saves, 0);
  const response = await handleAdmin(request(), 'admin', deps);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(saves, 1);
});

function fakeCache() {
  const entries = new Map();
  return { async match(key) { return entries.get(key.url)?.clone(); }, async put(key, response) { entries.set(key.url, response.clone()); } };
}
test('cached HTML refreshes across locations after save, without invalidating other pages', async () => {
  const revisions = { meets: 'old', records: 'old' };
  const locations = [fakeCache(), fakeCache()];
  let renders = 0;
  const run = async (cache, page = 'meets', version = 'v1') => {
    const pending = [];
    const response = await serveCachedPage({ request: new Request(`https://club.example/${page}/`), cache, version, readRevision: async page => revisions[page], waitUntil: p => pending.push(p), next: async () => { renders++; return new Response(`${page}:${revisions[page]}`, { headers: { 'Content-Type': 'text/html' } }); } });
    await Promise.all(pending); return response;
  };
  for (const cache of locations) { await run(cache); await run(cache, 'records'); }
  assert.equal((await run(locations[0])).headers.get('X-Page-Cache'), 'HIT');
  assert.equal(renders, 4);
  revisions.meets = 'new';
  for (const cache of locations) {
    assert.equal(await (await run(cache)).text(), 'meets:new');
    assert.equal((await run(cache, 'records')).headers.get('X-Page-Cache'), 'HIT');
  }
  assert.equal(renders, 6);
  assert.equal((await run(locations[0], 'meets', 'new-deploy')).headers.get('X-Page-Cache'), 'MISS');
});

test('in-flight stale render cannot repopulate current revision after save', async () => {
  const cache = fakeCache(); let revision = 'old'; const pending = [];
  await serveCachedPage({ request: new Request('https://club.example/meets/'), cache, readRevision: async () => revision, waitUntil: p => pending.push(p), next: async () => { revision = 'new'; return new Response('old data', { headers: { 'Content-Type': 'text/html' } }); } });
  await Promise.all(pending);
  const fresh = await serveCachedPage({ request: new Request('https://club.example/meets/'), cache, readRevision: async () => revision, next: async () => new Response('fresh data', { headers: { 'Content-Type': 'text/html' } }) });
  assert.equal(await fresh.text(), 'fresh data');
});

test('private, error and non-content responses are never cached; browsers cannot retain stale HTML', async () => {
  let writes = 0;
  const cache = { match: async () => null, put: async () => { writes++; } };
  for (const response of [new Response('error', { status: 503 }), new Response('private', { headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'session=secret' } })]) {
    const result = await serveCachedPage({ request: new Request('https://club.example/meets/'), cache, readRevision: async () => 'old', next: async () => response });
    assert.equal(result.headers.get('Cache-Control'), 'no-store');
  }
  assert.equal(writes, 0);
  await serveCachedPage({ request: new Request('https://club.example/admin/'), cache, readRevision: async () => { throw Error('must not read'); }, next: async () => new Response('admin') });
});

test('dates preserve date-only input and use Charlottesville time for old timestamps', () => {
  assert.equal(formatDate('2026-10-06'), 'Oct 6, 2026');
  assert.equal(calendarDay('2026-10-06T01:00:00Z'), '2026-10-05');
  assert.equal(semester('2026-06-01'), 'Fall 2026');
  assert.equal(safeLink('javascript:alert(1)'), null);
  assert.equal(safeLink('(Results not posted)'), null);
});

test('records join by event ID and select newest record, preserving separate genders', () => {
  const records = [{ eventId: '5k', category: 'Men', name: 'Old', dateAdded: '2025-01-01' }, { eventId: '5k', category: 'Men', name: 'New', dateAdded: '2026-01-01' }, { eventId: '5k', category: 'Women', name: 'Woman' }];
  const result = groupRecords(records, [{ id: '5k', name: '5K', type: 'Track' }]);
  assert.deepEqual(result[0][1].map(record => record.name), ['New', 'Woman']);
});
