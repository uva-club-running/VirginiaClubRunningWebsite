export const timeZone = 'America/New_York';
export function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
export function formatDate(value, withTime = false) {
  const date = toDate(value);
  if (!date) return 'TBD';
  // Calendar dates stay dates; older Firestore timestamps retain the club's timezone.
  const dateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
  return date.toLocaleString('en-US', {
    timeZone: dateOnly ? 'UTC' : timeZone,
    month: withTime ? 'long' : 'short', day: 'numeric', year: 'numeric',
    ...(withTime && !dateOnly ? { weekday: 'long', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' } : {}),
  });
}
export function calendarDay(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = toDate(value);
  if (!date) return '';
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const part = (type) => parts.find(p => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function semester(value) {
  const day = calendarDay(value);
  return day ? `${Number(day.slice(5, 7)) >= 6 ? 'Fall' : 'Spring'} ${day.slice(0, 4)}` : 'Unknown Semester';
}
export function sortedSemesters(grouped) {
  const rank = key => {
    const [term, year] = key.split(' ');
    return Number(year) * 2 + (term === 'Fall' ? 1 : 0) || 0;
  };
  return Object.keys(grouped).sort((a, b) => rank(b) - rank(a));
}
export function groupBy(items, key) {
  const groups = Object.create(null);
  for (const item of items) (groups[key(item)] ??= []).push(item);
  return groups;
}
export function groupRecords(records, events) {
  const eventMap = new Map(events.map(e => [e.id, e]));
  const latest = new Map();
  for (const record of records) {
    const event = eventMap.get(record.eventId);
    if (!event) continue;
    const key = `${record.eventId}:${record.category}`;
    const previous = latest.get(key);
    if (!previous || (toDate(record.dateAdded)?.getTime() || 0) > (toDate(previous.dateAdded)?.getTime() || 0)) {
      latest.set(key, { ...record, event: event.name, type: event.type || 'Other' });
    }
  }
  const types = ['Cross Country', 'Track', 'Field', 'Road Races', 'Club Elections'];
  const rank = type => types.includes(type) ? types.indexOf(type) : types.length;
  return Object.entries(groupBy([...latest.values()], r => r.type)).sort(([a], [b]) => rank(a) - rank(b));
}
export function safeLink(value) {
  if (typeof value !== 'string') return null;
  const link = value.trim();
  if (link.startsWith('/') && !link.startsWith('//') && !link.includes('\\')) return link;
  try { const url = new URL(link); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
