import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

// Validate environment variables at build time
function validateEnvironment() {
  const requiredVars = ['SITE_URL'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Using fallback values for missing variables');
  }

  // Validate SITE_URL format if provided
  if (process.env.SITE_URL && !process.env.SITE_URL.startsWith('http')) {
    throw new Error('SITE_URL must be a valid URL starting with http:// or https://');
  }
}

// Run validation
validateEnvironment();

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
    imageService: true,
    imagesConfig: {
      sizes: [320, 640, 768, 1024, 1280, 1600],
      formats: ['image/avif', 'image/webp'],
      domains: [],
    },
  }),
  integrations: [tailwind()],
  site: process.env.SITE_URL || 'http://localhost:4321',
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    define: {
      // Validate required environment variables at build time
      __CONTENTFUL_SPACE_ID__: JSON.stringify(process.env.CONTENTFUL_SPACE_ID || 'mock'),
      __SITE_URL__: JSON.stringify(process.env.SITE_URL || 'http://localhost:4321'),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            contentful: ['contentful'],
            astro: ['astro'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['contentful'],
    },
  },
});
