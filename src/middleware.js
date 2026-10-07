import { env } from 'cloudflare:workers';
import { defineMiddleware } from 'astro:middleware';
import { getDocument } from './lib/firestore.js';
import { cachedPage, serveCachedPage } from './lib/page-cache.js';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered || !cachedPage(context.url.pathname)) return next();
  try {
    return await serveCachedPage({
      request: context.request, next,
      cache: caches.default,
      version: env.CF_VERSION_METADATA?.id || 'local',
      readRevision: async page => (await getDocument('SiteCache', page))?.revision || 'initial',
      waitUntil: promise => context.locals.cfContext.waitUntil(promise),
    });
  } catch (error) {
    console.error('Public page unavailable:', error.name);
    return new Response('This page is temporarily unavailable. Please try again shortly.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '30' } });
  }
});
