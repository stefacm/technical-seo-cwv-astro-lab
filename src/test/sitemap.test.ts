import { describe, expect, test } from 'vitest';
import {
  type SitemapEntry,
  type SitemapIndex,
  formatSitemapTimestamp,
  formatSitemapUrl,
  generateSitemapEntry,
  generateSitemapIndexEntry,
  generateSitemapIndexXml,
  generateSitemapXml,
  getSitemapBaseUrl,
  shouldIncludeInSitemap,
  validateSitemapUrl,
} from '../lib/sitemap.js';

describe('Sitemap Utilities', () => {
  describe('formatSitemapUrl', () => {
    test('should format relative URLs to absolute URLs', () => {
      const result = formatSitemapUrl('/blog/test', 'https://example.com');
      expect(result).toBe('https://example.com/blog/test');
    });

    test('should handle URLs without leading slash', () => {
      const result = formatSitemapUrl('blog/test', 'https://example.com');
      expect(result).toBe('https://example.com/blog/test');
    });

    test('should return absolute URLs unchanged', () => {
      const absoluteUrl = 'https://example.com/blog/test';
      const result = formatSitemapUrl(absoluteUrl, 'https://other.com');
      expect(result).toBe(absoluteUrl);
    });

    test('should handle base URLs with trailing slash', () => {
      const result = formatSitemapUrl('/blog/test', 'https://example.com/');
      expect(result).toBe('https://example.com/blog/test');
    });
  });

  describe('validateSitemapUrl', () => {
    test('should validate HTTPS URLs', () => {
      expect(validateSitemapUrl('https://example.com/page')).toBe(true);
    });

    test('should validate HTTP URLs', () => {
      expect(validateSitemapUrl('http://example.com/page')).toBe(true);
    });

    test('should reject invalid URLs', () => {
      expect(validateSitemapUrl('not-a-url')).toBe(false);
      expect(validateSitemapUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('formatSitemapTimestamp', () => {
    test('should format Date objects to ISO string', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const result = formatSitemapTimestamp(date);
      expect(result).toBe('2024-01-15T10:00:00.000Z');
    });

    test('should format date strings to ISO string', () => {
      const result = formatSitemapTimestamp('2024-01-15T10:00:00Z');
      expect(result).toBe('2024-01-15T10:00:00.000Z');
    });

    test('should throw error for invalid timestamps', () => {
      expect(() => formatSitemapTimestamp('invalid-date')).toThrow('Invalid timestamp');
    });
  });

  describe('generateSitemapEntry', () => {
    test('should generate basic sitemap entry', () => {
      const entry: SitemapEntry = {
        url: 'https://example.com/page',
      };

      const result = generateSitemapEntry(entry);
      expect(result).toContain('<loc>https://example.com/page</loc>');
      expect(result).toContain('<url>');
      expect(result).toContain('</url>');
    });

    test('should include all optional fields when provided', () => {
      const entry: SitemapEntry = {
        url: 'https://example.com/page',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'weekly',
        priority: 0.8,
      };

      const result = generateSitemapEntry(entry);
      expect(result).toContain('<lastmod>2024-01-15T10:00:00.000Z</lastmod>');
      expect(result).toContain('<changefreq>weekly</changefreq>');
      expect(result).toContain('<priority>0.8</priority>');
    });
  });

  describe('generateSitemapIndexEntry', () => {
    test('should generate sitemap index entry', () => {
      const entry: SitemapIndex = {
        sitemap: 'https://example.com/sitemap-blog.xml',
        lastmod: '2024-01-15T10:00:00.000Z',
      };

      const result = generateSitemapIndexEntry(entry);
      expect(result).toContain('<loc>https://example.com/sitemap-blog.xml</loc>');
      expect(result).toContain('<lastmod>2024-01-15T10:00:00.000Z</lastmod>');
      expect(result).toContain('<sitemap>');
      expect(result).toContain('</sitemap>');
    });
  });

  describe('generateSitemapXml', () => {
    test('should generate complete XML sitemap', () => {
      const entries: SitemapEntry[] = [
        { url: 'https://example.com/page1' },
        { url: 'https://example.com/page2', lastmod: '2024-01-15T10:00:00.000Z' },
      ];

      const result = generateSitemapXml(entries);
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(result).toContain('</urlset>');
      expect(result).toContain('https://example.com/page1');
      expect(result).toContain('https://example.com/page2');
    });
  });

  describe('generateSitemapIndexXml', () => {
    test('should generate complete XML sitemap index', () => {
      const entries: SitemapIndex[] = [
        { sitemap: 'https://example.com/sitemap-blog.xml' },
        { sitemap: 'https://example.com/sitemap-guides.xml' },
      ];

      const result = generateSitemapIndexXml(entries);
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain(
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
      );
      expect(result).toContain('</sitemapindex>');
      expect(result).toContain('sitemap-blog.xml');
      expect(result).toContain('sitemap-guides.xml');
    });
  });

  describe('getSitemapBaseUrl', () => {
    test('should return localhost fallback when no environment variable is set', () => {
      // Clear environment variable for this test
      const originalSiteUrl = process.env.SITE_URL;
      // biome-ignore lint/performance/noDelete: Testing environment variable absence
      delete process.env.SITE_URL;

      const result = getSitemapBaseUrl();
      expect(result).toBe('http://localhost:4321');

      // Restore original value
      if (originalSiteUrl) {
        process.env.SITE_URL = originalSiteUrl;
      }
    });
  });

  describe('shouldIncludeInSitemap', () => {
    test('should include regular pages', () => {
      expect(shouldIncludeInSitemap('https://example.com/blog/post')).toBe(true);
      expect(shouldIncludeInSitemap('https://example.com/guides/guide')).toBe(true);
      expect(shouldIncludeInSitemap('https://example.com/')).toBe(true);
    });

    test('should exclude preview routes', () => {
      expect(shouldIncludeInSitemap('https://example.com/preview/blog/post')).toBe(false);
    });

    test('should exclude search routes', () => {
      expect(shouldIncludeInSitemap('https://example.com/search')).toBe(false);
    });

    test('should exclude API routes', () => {
      expect(shouldIncludeInSitemap('https://example.com/api/preview')).toBe(false);
    });

    test('should exclude admin routes', () => {
      expect(shouldIncludeInSitemap('https://example.com/admin/dashboard')).toBe(false);
    });
  });
});
