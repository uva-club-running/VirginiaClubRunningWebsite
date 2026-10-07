import test from 'node:test';
import assert from 'node:assert/strict';
import { createContentForm } from '../src/lib/admin-forms.js';
import { createAdminSession } from '../src/lib/admin-session.js';

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

test('form retries preserve submission IDs, prevent duplicate clicks, and reset only after success', async () => {
  const first = deferred();
  const calls = [];
  const form = createContentForm('Meets', 'create', async (_, mutation) => {
    calls.push(mutation);
    return calls.length === 1 ? first.promise : { page: '/meets/' };
  });
  const notices = [];
  form.$dispatch = event => notices.push(event);
  form.data = { name: 'Test meet', date: '2026-10-06', location: 'UVA', results: '' };
  const saving = form.save();
  await form.save();
  assert.equal(calls.length, 1);
  first.reject(new Error('Connection interrupted'));
  await saving;
  assert.equal(form.error, 'Connection interrupted');
  assert.equal(form.data.name, 'Test meet');
  await form.save();
  assert.equal(calls[0].id, calls[1].id);
  assert.equal(form.data.name, '');
  assert.equal(form.page, '/meets/');
  assert.deepEqual(notices, ['content-saved']);
});

test('changed content gets a new retry ID; updating results targets the selected meet', async () => {
  const ids = [];
  const form = createContentForm('Events', 'create', async (_, mutation) => {
    ids.push(mutation.id);
    throw new Error('Offline');
  });
  await form.save();
  form.data.name = 'Changed';
  await form.save();
  assert.notEqual(ids[0], ids[1]);
  let sent;
  const results = createContentForm('Meets', 'updateResults', async (_, mutation) => {
    sent = mutation;
    return { page: '/meets/' };
  });
  results.$dispatch = () => {};
  results.id = 'chosen-meet';
  results.data.results = 'https://example.com/results';
  await results.save();
  assert.deepEqual(sent, { operation: 'updateResults', collection: 'Meets', id: 'chosen-meet', data: { results: 'https://example.com/results' } });
  assert.equal(results.id, '');
});

test('all five create forms submit their expected fields through the existing API', async () => {
  for (const collection of ['Meets', 'Events', 'Records', 'AllAmericans', 'Philanthropy']) {
    let sent;
    const form = createContentForm(collection, 'create', async (_, mutation) => {
      sent = mutation;
      return { page: '/records/' };
    });
    form.$dispatch = () => {};
    const before = structuredClone(form.data);
    await form.save();
    assert.equal(sent.collection, collection);
    assert.equal(sent.operation, 'create');
    assert.deepEqual(sent.data, before);
    assert.match(sent.id, /^[a-f0-9-]{36}$/);
  }
});

test('late authorization and option responses cannot restore a signed-out session', async () => {
  let authChanged;
  const access = deferred();
  const options = deferred();
  const session = createAdminSession({
    observeAuth: callback => { authChanged = callback; return () => {}; },
    request: collection => collection ? options.promise : access.promise,
  });
  session.init();
  const checking = authChanged({ email: 'admin@example.com' });
  await authChanged(null);
  access.resolve({ uid: 'allowed' });
  await checking;
  assert.equal(session.authorized, false);
  const second = authChanged({ email: 'admin@example.com' });
  await Promise.resolve();
  assert.equal(session.authorized, true);
  await authChanged(null);
  options.resolve({ documents: [{ id: 'private', name: 'Test' }] });
  await second;
  assert.equal(session.authorized, false);
  assert.deepEqual(session.events, []);
  assert.deepEqual(session.meets, []);
  session.destroy();
});

test('login failures clear passwords, denied users stay out, and failed option loads can retry', async () => {
  let authChanged;
  let denied = true;
  let failOptions = true;
  const session = createAdminSession({
    observeAuth: callback => { authChanged = callback; return () => {}; },
    signIn: async () => { throw new Error('Bad credentials'); },
    request: async collection => {
      if (denied) throw new Error('Not an admin');
      if (collection && failOptions) throw new Error('Options unavailable');
      return collection ? { documents: [{ id: 'event', name: '5K' }] } : {};
    },
  });
  session.init();
  session.password = 'test-only';
  await session.login();
  assert.equal(session.password, '');
  assert.match(session.loginError, /Unable to sign in/);
  await authChanged({ email: 'test@example.com' });
  assert.equal(session.authorized, false);
  assert.equal(session.sessionError, 'Not an admin');
  denied = false;
  await authChanged({ email: 'test@example.com' });
  assert.equal(session.authorized, true);
  assert.equal(session.readError, 'Options unavailable');
  failOptions = false;
  await session.loadOptions();
  assert.equal(session.readError, '');
  assert.equal(session.events[0].name, '5K');
  session.destroy();
});
