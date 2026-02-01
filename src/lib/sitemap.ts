// Sitemap generation utilities and shared logic
// Implements shared functionality for XML sitemap generation

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapIndex {
  sitemap: string;
  lastmod?: string;
}

/**
 * Formats a URL to be absolute and properly encoded for sitemap usage
 * Ensures all URLs are absolute and follow sitemap standards
 */
export function formatSitemapUrl(url: string, baseUrl: string): string {
  // If URL is already absolute, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;

  // Ensure baseUrl doesn't end with slash to avoid double slashes
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBaseUrl}/${cleanUrl}`;
}

/**
 * Validates that a URL is properly formatted for sitemap inclusion
 * Returns true if URL is valid for sitemap, false otherwise
 */
export function validateSitemapUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Must be HTTP or HTTPS
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Formats a timestamp for sitemap lastmod field
 * Converts various date formats to W3C datetime format (YYYY-MM-DDTHH:mm:ss+00:00)
 */
export function formatSitemapTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  // Validate date
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }

  // Return ISO string format (W3C datetime format)
  return date.toISOString();
}

/**
 * Generates XML for a single sitemap entry
 * Creates properly formatted <url> element with all provided fields
 */
export function generateSitemapEntry(entry: SitemapEntry): string {
  let xml = '  <url>\n';
  xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;

  if (entry.lastmod) {
    xml += `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n`;
  }

  if (entry.changefreq) {
    xml += `    <changefreq>${escapeXml(entry.changefreq)}</changefreq>\n`;
  }

  if (entry.priority !== undefined) {
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
  }

  xml += '  </url>\n';
  return xml;
}

/**
 * Generates XML for a sitemap index entry
 * Creates properly formatted <sitemap> element for sitemap index
 */
export function generateSitemapIndexEntry(entry: SitemapIndex): string {
  let xml = '  <sitemap>\n';
  xml += `    <loc>${escapeXml(entry.sitemap)}</loc>\n`;

  if (entry.lastmod) {
    xml += `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n`;
  }

  xml += '  </sitemap>\n';
  return xml;
}

/**
 * Generates complete XML sitemap with proper headers and structure
 * Takes array of sitemap entries and returns complete XML document
 */
export function generateSitemapXml(entries: SitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of entries) {
    xml += generateSitemapEntry(entry);
  }

  xml += '</urlset>\n';
  return xml;
}

/**
 * Generates complete XML sitemap index with proper headers and structure
 * Takes array of sitemap index entries and returns complete XML document
 */
export function generateSitemapIndexXml(entries: SitemapIndex[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of entries) {
    xml += generateSitemapIndexEntry(entry);
  }

  xml += '</sitemapindex>\n';
  return xml;
}

/**
 * Escapes XML special characters for safe inclusion in XML documents
 * Prevents XML parsing errors from special characters in URLs and content
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Gets the base URL for sitemap generation from environment or Astro config
 * Provides fallback to localhost for development
 */
export function getSitemapBaseUrl(): string {
  // Try environment variable first
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }

  // Fallback for development
  return 'http://localhost:4321';
}

/**
 * Filters out routes that should not be included in sitemaps
 * Excludes preview routes, search routes, and other non-indexable content
 */
export function shouldIncludeInSitemap(url: string): boolean {
  const excludePatterns = ['/preview/', '/search', '/api/', '/_', '/admin'];

  return !excludePatterns.some((pattern) => url.includes(pattern));
}
