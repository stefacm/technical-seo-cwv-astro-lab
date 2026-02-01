// Main sitemap index that references all content-specific sitemaps
// Implements requirement 7.2: Generate sitemap-index.xml.ts as the main sitemap index

import type { APIRoute } from 'astro';
import {
  type SitemapIndex,
  formatSitemapUrl,
  generateSitemapIndexXml,
  getSitemapBaseUrl,
} from '../lib/sitemap.js';

export const prerender = true;

export const GET: APIRoute = async () => {
  const baseUrl = getSitemapBaseUrl();

  // Define all content-specific sitemaps
  const sitemaps: SitemapIndex[] = [
    {
      sitemap: formatSitemapUrl('/sitemap-pages.xml', baseUrl),
      // Static pages don't have dynamic lastmod, so we omit it
    },
    {
      sitemap: formatSitemapUrl('/sitemap-blog.xml', baseUrl),
      // Blog sitemap will include its own lastmod based on latest post
    },
    {
      sitemap: formatSitemapUrl('/sitemap-guides.xml', baseUrl),
      // Guides sitemap will include its own lastmod based on latest guide
    },
  ];

  // Generate the complete sitemap index XML
  const xml = generateSitemapIndexXml(sitemaps);

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
