// Blog posts sitemap generation
// Implements requirement 7.3: Create sitemap-blog.xml.ts for blog posts

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
    // Fetch all published blog posts (not preview mode)
    const blogPosts = await contentService.getBlogPosts(1000, false);

    // Convert blog posts to sitemap entries
    const sitemapEntries = blogPosts
      .map((post) => {
        const url = formatSitemapUrl(`/blog/${post.slug}`, baseUrl);

        // Only include if URL should be in sitemap (excludes preview routes, etc.)
        if (!shouldIncludeInSitemap(url)) {
          return null;
        }

        return {
          url,
          lastmod: formatSitemapTimestamp(post.sys.updatedAt),
          changefreq: 'weekly' as const,
          priority: 0.8,
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
    console.error('Error generating blog sitemap:', error);

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
