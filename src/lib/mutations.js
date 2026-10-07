import { commit, documentRoot, encodeFields, getDocument, HttpError } from './firestore.js';
import { safeLink } from './content.js';

export const affectedPages = { Meets: 'meets', Events: 'records', Records: 'records', AllAmericans: 'records', Philanthropy: 'philanthropy' };
const text = (data, key, required = true, max = 200) => {
  const value = data[key];
  if (value == null && !required) return '';
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new HttpError(400, `Invalid ${key}.`);
  return value.trim();
};
const choice = (data, key, values) => {
  const value = text(data, key);
  if (!values.includes(value)) throw new HttpError(400, `Invalid ${key}.`);
  return value;
};
const number = (data, key, min, max) => {
  const value = Number(data[key]);
  if (!Number.isInteger(value) || value < min || value > max) throw new HttpError(400, `Invalid ${key}.`);
  return value;
};
const link = (data, key) => {
  const value = text(data, key, false, 2000);
  if (value && !safeLink(value)) throw new HttpError(400, `Invalid ${key} URL.`);
  return value;
};
const date = data => {
  const value = text(data, 'date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw new HttpError(400, 'Invalid date.');
  return value;
};
export function validateMutation(input) {
  if (!input || typeof input !== 'object' || !Object.hasOwn(affectedPages, input.collection)) throw new HttpError(400, 'Unknown collection.');
  const { collection, operation, data } = input;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Missing data.');
  // Stable IDs make retrying a lost response safe: a second create cannot duplicate data.
  const id = text(input, 'id', true, 128);
  if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new HttpError(400, 'Invalid document ID.');
  if (operation === 'updateResults' && collection === 'Meets') {
    const results = link(data, 'results');
    if (!results) throw new HttpError(400, 'Enter a results URL.');
    return { collection, operation, id, data: { results } };
  }
  if (operation !== 'create') throw new HttpError(400, 'Unsupported operation.');
  let fields;
  switch (collection) {
    case 'Events': fields = { name: text(data, 'name'), type: choice(data, 'type', ['Cross Country', 'Track', 'Field', 'Road Races', 'Club Elections']) }; break;
    case 'Meets': fields = { name: text(data, 'name'), date: date(data), location: text(data, 'location'), results: link(data, 'results'), year: Number(date(data).slice(0, 4)) }; break;
    case 'Records': fields = { name: text(data, 'name'), eventId: text(data, 'eventId'), category: choice(data, 'category', ['Men', 'Women']), time: text(data, 'time'), year: number(data, 'year', 1900, 2200) }; break;
    case 'AllAmericans': fields = { name: text(data, 'name'), eventId: text(data, 'eventId'), time: text(data, 'time', false), place: number(data, 'place', 1, 10000), year: number(data, 'year', 1900, 2200), semester: choice(data, 'semester', ['Spring', 'Fall']) }; break;
    case 'Philanthropy': fields = { name: text(data, 'name'), date: date(data), description: text(data, 'description', false, 10000), partner_org: text(data, 'partner_org', false), link: link(data, 'link'), flyer_link: link(data, 'flyer_link') }; break;
  }
  return { collection, operation, id, data: fields };
}
export function mutationWrites(mutation, revision) {
  const { collection, operation, id, data } = mutation;
  const page = affectedPages[collection];
  const content = {
    update: { name: `${documentRoot}/${collection}/${id}`, fields: encodeFields(data) },
    currentDocument: { exists: operation !== 'create' },
    ...(operation === 'create'
      ? { updateTransforms: [{ fieldPath: 'dateAdded', setToServerValue: 'REQUEST_TIME' }] }
      : { updateMask: { fieldPaths: ['results'] } }),
  };
  const marker = {
    update: { name: `${documentRoot}/SiteCache/${page}`, fields: encodeFields({ revision }) },
    updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
  };
  return [content, marker];
}
export async function saveContent(input, token, fetcher = fetch) {
  const mutation = validateMutation(input);
  if (mutation.data.eventId) {
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(mutation.data.eventId) || !await getDocument('Events', mutation.data.eventId, token, fetcher)) throw new HttpError(400, 'Select an existing event.');
  }
  if (mutation.operation === 'create') {
    const existing = await getDocument(mutation.collection, mutation.id, token, fetcher);
    if (existing) {
      if (!Object.entries(mutation.data).every(([k, v]) => existing[k] === v)) throw new HttpError(409, 'This submission ID was already used. Reload before making a different submission.');
      return { id: mutation.id, page: `/${affectedPages[mutation.collection]}/`, saved: true };
    }
  }
  await commit(mutationWrites(mutation, crypto.randomUUID()), token, fetcher);
  return { id: mutation.id, page: `/${affectedPages[mutation.collection]}/`, saved: true };
}
