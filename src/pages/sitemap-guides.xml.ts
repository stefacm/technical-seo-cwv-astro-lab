// Guides sitemap generation
// Implements requirement 7.4: Create sitemap-guides.xml.ts for guides

import type { APIRoute } from 'astro';
import { createContentService } from '../lib/mocks.js';
import {
  formatSitemapTimestamp,
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
    // Fetch all published guides (not preview mode)
    const guides = await contentService.getGuides(1000, false);

    // Convert guides to sitemap entries
    const sitemapEntries = guides
      .map((guide) => {
        const url = formatSitemapUrl(`/guides/${guide.slug}`, baseUrl);

        // Only include if URL should be in sitemap (excludes preview routes, etc.)
        if (!shouldIncludeInSitemap(url)) {
          return null;
        }

        return {
          url,
          lastmod: formatSitemapTimestamp(guide.sys.updatedAt),
          changefreq: 'monthly' as const,
          priority: 0.9, // Higher priority for guides as they're comprehensive content
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
    console.error('Error generating guides sitemap:', error);

    // Return empty sitemap on error to prevent build failures
    const emptyXml = generateSitemapXml([]);

    return new Response(emptyXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Shorter cache on error
      },
    });
  }
};
