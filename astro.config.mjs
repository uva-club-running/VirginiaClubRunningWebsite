import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://virginia.clubrunning.org',
  output: 'static',
  session: false,
  adapter: cloudflare({ imageService: 'passthrough' }),
  trailingSlash: 'ignore',
  vite: { plugins: [tailwindcss()] },
});
