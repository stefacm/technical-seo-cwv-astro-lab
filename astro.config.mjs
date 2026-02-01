import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [tailwind()],
  site: process.env.SITE_URL || 'http://localhost:4321',
  vite: {
    define: {
      // Validate required environment variables at build time
      __CONTENTFUL_SPACE_ID__: JSON.stringify(process.env.CONTENTFUL_SPACE_ID || 'mock'),
      __SITE_URL__: JSON.stringify(process.env.SITE_URL || 'http://localhost:4321'),
    },
  },
});
