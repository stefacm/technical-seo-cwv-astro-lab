// Static pages sitemap generation
// Implements requirement 7.5: Create sitemap-pages.xml.ts for static pages

import type { APIRoute } from 'astro';
import { createContentService } from '../lib/mocks.js';
import {
  type SitemapEntry,
  formatSitemapUrl,
  generateSitemapXml,
  getSitemapBaseUrl,
  shouldIncludeInSitemap,
} from '../lib/sitemap.js';

export const prerender = true;

export const GET: APIRoute = async () => {
  const baseUrl = getSitemapBaseUrl();
  const contentService = createContentService();

  try {
    // Define static pages that should be included in sitemap
    const staticPages = [
      {
        url: '/',
        changefreq: 'daily' as const,
        priority: 1.0, // Homepage gets highest priority
      },
      {
        url: '/faq',
        changefreq: 'monthly' as const,
        priority: 0.7,
      },
    ];

    // Get categories for category pages
    const categories = await contentService.getCategories(false);
    const categoryPages = categories.map((category) => ({
      url: `/category/${category.slug}`,
      changefreq: 'weekly' as const,
      priority: 0.6,
    }));

    // Combine all static pages
    const allPages = [...staticPages, ...categoryPages];

    // Convert to sitemap entries with proper URL formatting
    const sitemapEntries = allPages
      .map((page) => {
        const url = formatSitemapUrl(page.url, baseUrl);

        // Only include if URL should be in sitemap (excludes preview routes, etc.)
        if (!shouldIncludeInSitemap(url)) {
          return null;
        }

        return {
          url,
          // Static pages don't have dynamic lastmod, so we omit it
          changefreq: page.changefreq,
          priority: page.priority,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    // Generate the complete sitemap XML
    const xml = generateSitemapXml(sitemapEntries);

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating pages sitemap:', error);

    // Return minimal sitemap with just homepage on error
    const fallbackEntries: SitemapEntry[] = [
      {
        url: formatSitemapUrl('/', baseUrl),
        changefreq: 'daily',
        priority: 1.0,
      },
    ];

    const fallbackXml = generateSitemapXml(fallbackEntries);

    return new Response(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Shorter cache on error
      },
    });
  }
};
