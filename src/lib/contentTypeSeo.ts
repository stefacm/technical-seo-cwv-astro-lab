// Content type-specific SEO meta tag generation
// Implements centralized logic for generating meta tags based on content type

import type { BlogPost, Guide, Category, FaqEntry } from './contentful.js';

// SeoHeadProps interface (duplicated to avoid circular dependency)
interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: BreadcrumbItem[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

// Content type enumeration
export type ContentType = 'blog' | 'guide' | 'category' | 'faq' | 'homepage' | 'search';

// Base SEO configuration interface
interface BaseSeoConfig {
  siteName: string;
  siteUrl: string;
  defaultOgImage: string;
}

// Content type-specific meta tag generators
export class ContentTypeSeoGenerator {
  private readonly config: BaseSeoConfig;

  constructor(config: BaseSeoConfig) {
    this.config = config;
  }

  /**
   * Generate SEO meta tags for blog post content type
   * Optimized for article-type content with author and publication data
   */
  generateBlogPostSeo(post: BlogPost, canonicalPath: string): SeoHeadProps {
    const canonicalUrl = this.buildCanonicalUrl(canonicalPath);

    return {
      title: post.seo?.title || `${post.title} - ${this.config.siteName}`,
      description: post.seo?.description || post.excerpt,
      canonical: canonicalUrl,
      ogType: 'article',
      ogImage: this.getOptimalImage(
        post.seo?.ogImage?.fields.file.url,
        post.featuredImage?.fields.file.url,
        this.config.defaultOgImage
      ),
      noindex: false,
      nofollow: false,
    };
  }

  /**
   * Generate SEO meta tags for guide content type
   * Optimized for how-to content with difficulty and time indicators
   */
  generateGuideSeo(guide: Guide, canonicalPath: string): SeoHeadProps {
    const canonicalUrl = this.buildCanonicalUrl(canonicalPath);

    // Enhanced description with guide metadata
    const enhancedDescription = `${guide.description} ${guide.difficulty} level guide, estimated ${guide.estimatedTime} minutes.`;

    return {
      title: `${guide.title} - ${this.config.siteName}`,
      description: enhancedDescription,
      canonical: canonicalUrl,
      ogType: 'article',
      ogImage: this.getOptimalImage(
        guide.featuredImage?.fields.file.url,
        this.config.defaultOgImage
      ),
      noindex: false,
      nofollow: false,
    };
  }

  /**
   * Generate SEO meta tags for category content type
   * Optimized for category listing pages with content counts
   */
  generateCategorySeo(
    category: Category,
    canonicalPath: string,
    contentCounts?: { blogPosts: number; guides: number }
  ): SeoHeadProps {
    const canonicalUrl = this.buildCanonicalUrl(canonicalPath);

    // Enhanced description with content counts if available
    let description = `Explore ${category.name.toLowerCase()} articles and guides. ${category.description}`;
    if (contentCounts) {
      description += ` ${contentCounts.blogPosts} articles and ${contentCounts.guides} guides available.`;
    }

    return {
      title: `${category.name} - ${this.config.siteName}`,
      description,
      canonical: canonicalUrl,
      ogType: 'website',
      ogImage: this.getOptimalImage(
        category.featuredImage?.fields.file.url,
        this.config.defaultOgImage
      ),
      noindex: false,
      nofollow: false,
    };
  }

  /**
   * Generate SEO meta tags for FAQ content type
   * Optimized for FAQ pages with question count
   */
  generateFaqSeo(
    faqEntries: FaqEntry[],
    canonicalPath: string,
    customTitle?: string,
    customDescription?: string
  ): SeoHeadProps {
    const canonicalUrl = this.buildCanonicalUrl(canonicalPath);

    const title = customTitle || `Frequently Asked Questions - ${this.config.siteName}`;
    const description =
      customDescription ||
      `Find answers to common questions. ${faqEntries.length} frequently asked questions about technical SEO and Core Web Vitals.`;

    return {
      title,
      description,
      canonical: canonicalUrl,
      ogType: 'website',
      ogImage: this.config.defaultOgImage,
      noindex: false,
      nofollow: false,
    };
  }

  /**
   * Generate SEO meta tags for homepage
   * Optimized for main landing page with site overview
   */
  generateHomepageSeo(
    canonicalPath: string = '/',
    customTitle?: string,
    customDescription?: string
  ): SeoHeadProps {
    const canonicalUrl = this.buildCanonicalUrl(canonicalPath);

    const title =
      customTitle || `${this.config.siteName} - Advanced Technical SEO and Core Web Vitals`;
    const description =
      customDescription ||
      'Master technical SEO and Core Web Vitals optimization with comprehensive guides, articles, and best practices for modern web development.';

    return {
      title,
      description,
      canonical: canonicalUrl,
      ogType: 'website',
      ogImage: this.config.defaultOgImage,
      noindex: false,
      nofollow: false,
    };
  }

  /**
   * Generate SEO meta tags for search pages
   * Optimized for search functionality with NOINDEX/NOFOLLOW
   */
  generateSearchSeo(canonicalPath: string, query?: string): SeoHeadProps {
    const canonicalUrl = this.buildCanonicalUrl(canonicalPath);

    const title = query
      ? `Search results for "${query}" - ${this.config.siteName}`
      : `Search - ${this.config.siteName}`;

    const description = query
      ? `Search results for "${query}". Find relevant articles and guides.`
      : 'Search our comprehensive collection of technical SEO articles and guides.';

    return {
      title,
      description,
      canonical: canonicalUrl,
      ogType: 'website',
      ogImage: this.config.defaultOgImage,
      noindex: true, // Search pages should not be indexed
      nofollow: true, // Search pages should not be followed
    };
  }

  /**
   * Generate fallback SEO meta tags for any content type
   * Used when specific content type generator is not available
   */
  generateFallbackSeo(
    contentType: ContentType,
    canonicalPath: string,
    title?: string,
    description?: string
  ): SeoHeadProps {
    const canonicalUrl = this.buildCanonicalUrl(canonicalPath);

    const fallbackTitle =
      title || `${this.capitalizeContentType(contentType)} - ${this.config.siteName}`;
    const fallbackDescription =
      description ||
      `Explore ${contentType} content on ${this.config.siteName}. Technical SEO and Core Web Vitals optimization resources.`;

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      canonical: canonicalUrl,
      ogType: 'website',
      ogImage: this.config.defaultOgImage,
      noindex: false,
      nofollow: false,
    };
  }

  /**
   * Build absolute canonical URL from relative path
   */
  private buildCanonicalUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.config.siteUrl}${cleanPath}`;
  }

  /**
   * Get optimal image URL with fallback chain
   */
  private getOptimalImage(...imageUrls: (string | undefined)[]): string {
    for (const url of imageUrls) {
      if (url) {
        return url.startsWith('http') ? url : `${this.config.siteUrl}${url}`;
      }
    }
    return this.config.defaultOgImage;
  }

  /**
   * Capitalize content type for display
   */
  private capitalizeContentType(contentType: ContentType): string {
    return contentType.charAt(0).toUpperCase() + contentType.slice(1);
  }
}

/**
 * Factory function to create ContentTypeSeoGenerator with site configuration
 * Uses environment variables with fallbacks for development
 */
export function createContentTypeSeoGenerator(): ContentTypeSeoGenerator {
  const config: BaseSeoConfig = {
    siteName: 'Technical SEO CWV Astro Lab',
    siteUrl: process.env.SITE_URL || 'http://localhost:4321',
    defaultOgImage: '/images/default-og.jpg',
  };

  return new ContentTypeSeoGenerator(config);
}

/**
 * Utility function to determine content type from URL path
 * Helps with automatic content type detection
 */
export function detectContentTypeFromPath(path: string): ContentType {
  if (path === '/' || path === '') return 'homepage';
  if (path.startsWith('/blog/')) return 'blog';
  if (path.startsWith('/guides/')) return 'guide';
  if (path.startsWith('/category/')) return 'category';
  if (path.startsWith('/faq')) return 'faq';
  if (path.startsWith('/search')) return 'search';

  // Default fallback
  return 'homepage';
}
