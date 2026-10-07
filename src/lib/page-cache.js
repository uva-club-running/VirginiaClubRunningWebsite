const pages = new Set(['records', 'meets', 'philanthropy']);
export function cachedPage(pathname) {
  const page = pathname.replace(/^\//, '').replace(/\/$/, '');
  return pages.has(page) ? page : null;
}
const freshFor = page => page === 'philanthropy' ? 300 : 3600;
export async function serveCachedPage({ request, next, cache, readRevision, version = 'local', waitUntil = promise => promise.catch(() => {}) }) {
  const url = new URL(request.url);
  const page = cachedPage(url.pathname);
  if (!page || !['GET', 'HEAD'].includes(request.method)) return next();
  // Revisions are intentionally not cached: a successful admin save must be visible
  // across every Cloudflare location, including requests racing an older render.
  const revision = await readRevision(page);
  const key = new Request(`${url.origin}/__page-cache/${encodeURIComponent(version)}/${page}/${encodeURIComponent(revision)}`);
  const found = cache && await cache.match(key);
  if (found) return browserResponse(found, request.method, 'HIT');
  const response = await next();
  if (request.method === 'GET' && response.status === 200 && !response.headers.has('Set-Cookie') && response.headers.get('Content-Type')?.includes('text/html') && cache) {
    const stored = new Response(response.clone().body, response);
    stored.headers.set('Cache-Control', `public, max-age=${freshFor(page)}`);
    stored.headers.delete('Vary');
    waitUntil(cache.put(key, stored).catch(error => console.error('Page cache write failed:', error.name)));
  }
  return browserResponse(response, request.method, 'MISS');
}
function browserResponse(response, method, state) {
  const result = new Response(method === 'HEAD' ? null : response.body, response);
  // Browsers and intermediary caches must not bypass the current revision check.
  result.headers.set('Cache-Control', 'no-store');
  result.headers.set('X-Page-Cache', state);
  return result;
}
