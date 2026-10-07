import { env } from 'cloudflare:workers';
import { handleAdmin } from '../../../lib/admin-handler.js';
export const prerender = false;
export const ALL = ({ request }) => handleAdmin(request, env.ADMIN_UIDS);
