// URL pattern consistency and generation utilities
// Implements consistent URL generation and validation for all content types

import type { BlogPost, Guide, Category } from './contentful.js';

// Content type URL patterns
export const URL_PATTERNS = {
  blog: '/blog/[slug]',
  guide: '/guides/[slug]',
  category: '/category/[slug]',
  faq: '/faq',
  homepage: '/',
  search: '/search',
  preview: '/preview/[type]/[slug]',
  api: '/api/[endpoint]',
} as const;

// URL pattern validation rules
export const URL_VALIDATION_RULES = {
  slug: {
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    minLength: 3,
    maxLength: 100,
    description: 'Lowercase letters, numbers, and hyphens only. Must start and end with alphanumeric.',
  },
  path: {
    pattern: /^\/[a-z0-9\-\/]*$/,
    description: 'Must start with slash, lowercase letters, numbers, hyphens, and slashes only.',
  },
} as const;

// Content type enumeration for URL generation
export type UrlContentType = 'blog' | 'guide' | 'category' | 'faq' | 'homepage' | 'search' | 'preview' | 'api';

/**
 * URL pattern generator and validator
 * Implements single responsibility principle for URL management
 */
export class UrlPatternManager {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Generate URL for blog post content type
   * Ensures consistent /blog/[slug] pattern
   */
  generateBlogPostUrl(post: BlogPost, absolute = false): string {
    const validatedSlug = this.validateAndFormatSlug(post.slug);
    const path = `/blog/${validatedSlug}`;
    return absolute ? `${this.baseUrl}${path}` : path;
  }

  /**
   * Generate URL for guide content type
   * Ensures consistent /guides/[slug] pattern
   */
  generateGuideUrl(guide: Guide, absolute = false): string {
    const validatedSlug = this.validateAndFormatSlug(guide.slug);
    const path = `/guides/${validatedSlug}`;
    return absolute ? `${this.baseUrl}${path}` : path;
  }

  /**
   * Generate URL for category content type
   * Ensures consistent /category/[slug] pattern
   */
  generateCategoryUrl(category: Category, absolute = false): string {
    const validatedSlug = this.validateAndFormatSlug(category.slug);
    const path = `/category/${validatedSlug}`;
    return absolute ? `${this.baseUrl}${path}` : path;
  }

  /**
   * Generate URL for FAQ page
   * Ensures consistent /faq pattern
   */
  generateFaqUrl(absolute = false): string {
    const path = '/faq';
    return absolute ? `${this.baseUrl}${path}` : path;
  }

  /**
   * Generate URL for homepage
   * Ensures consistent / pattern
   */
  generateHomepageUrl(absolute = false): string {
    const path = '/';
    return absolute ? `${this.baseUrl}${path}` : path;
  }

  /**
   * Generate URL for search page
   * Ensures consistent /search pattern with optional query
   */
  generateSearchUrl(query?: string, absolute = false): string {
    const path = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    return absolute ? `${this.baseUrl}${path}` : path;
  }

  /**
   * Generate URL for preview pages
   * Ensures consistent /preview/[type]/[slug] pattern
   */
  generatePreviewUrl(contentType: 'blog' | 'guide', slug: string, absolute = false): string {
    const validatedSlug = this.validateAndFormatSlug(slug);
    const path = `/preview/${contentType}/${validatedSlug}`;
    return absolute ? `${this.baseUrl}${path}` : path;
  }

  /**
   * Generate URL for API endpoints
   * Ensures consistent /api/[endpoint] pattern
   */
  generateApiUrl(endpoint: string, absolute = false): string {
    const validatedEndpoint = this.validateAndFormatSlug(endpoint);
    const path = `/api/${validatedEndpoint}`;
    return absolute ? `${this.baseUrl}${path}` : path;
  }

  /**
   * Generate canonical URL for any content type
   * Ensures all canonical URLs are absolute and consistent
   */
  generateCanonicalUrl(contentType: UrlContentType, content?: BlogPost | Guide | Category, query?: string): string {
    switch (contentType) {
      case 'blog':
        if (content && 'excerpt' in content) {
          return this.generateBlogPostUrl(content as BlogPost, true);
        }
        break;
      
      case 'guide':
        if (content && 'difficulty' in content) {
          return this.generateGuideUrl(content as Guide, true);
        }
        break;
      
      case 'category':
        if (content && 'color' in content) {
          return this.generateCategoryUrl(content as Category, true);
        }
        break;
      
      case 'faq':
        return this.generateFaqUrl(true);
      
      case 'homepage':
        return this.generateHomepageUrl(true);
      
      case 'search':
        return this.generateSearchUrl(query, true);
      
      default:
        return `${this.baseUrl}/`;
    }

    // Fallback to homepage if content type doesn't match
    return this.generateHomepageUrl(true);
  }

  /**
   * Validate and format slug according to URL pattern rules
   * Ensures all slugs follow consistent formatting
   */
  validateAndFormatSlug(slug: string): string {
    if (!slug) {
      throw new Error('Slug cannot be empty');
    }

    // Convert to lowercase and replace spaces/underscores with hyphens
    let formattedSlug = slug
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9\-]/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

    // Validate length
    if (formattedSlug.length < URL_VALIDATION_RULES.slug.minLength) {
      throw new Error(`Slug must be at least ${URL_VALIDATION_RULES.slug.minLength} characters long`);
    }

    if (formattedSlug.length > URL_VALIDATION_RULES.slug.maxLength) {
      formattedSlug = formattedSlug.substring(0, URL_VALIDATION_RULES.slug.maxLength);
      // Ensure we don't end with a hyphen after truncation
      formattedSlug = formattedSlug.replace(/-+$/, '');
    }

    // Validate pattern
    if (!URL_VALIDATION_RULES.slug.pattern.test(formattedSlug)) {
      throw new Error(`Invalid slug format: ${formattedSlug}. ${URL_VALIDATION_RULES.slug.description}`);
    }

    return formattedSlug;
  }

  /**
   * Validate URL path format
   * Ensures all paths follow consistent formatting rules
   */
  validateUrlPath(path: string): boolean {
    if (!path) return false;
    return URL_VALIDATION_RULES.path.pattern.test(path);
  }

  /**
   * Extract content type from URL path
   * Helps with automatic content type detection
   */
  extractContentTypeFromPath(path: string): UrlContentType | null {
    if (path === '/' || path === '') return 'homepage';
    if (path.startsWith('/blog/')) return 'blog';
    if (path.startsWith('/guides/')) return 'guide';
    if (path.startsWith('/category/')) return 'category';
    if (path.startsWith('/faq')) return 'faq';
    if (path.startsWith('/search')) return 'search';
    if (path.startsWith('/preview/')) return 'preview';
    if (path.startsWith('/api/')) return 'api';
    
    return null;
  }

  /**
   * Extract slug from URL path
   * Extracts slug parameter from dynamic routes
   */
  extractSlugFromPath(path: string, contentType: UrlContentType): string | null {
    switch (contentType) {
      case 'blog':
        const blogMatch = path.match(/^\/blog\/([^\/\?]+)/);
        return blogMatch ? blogMatch[1] : null;
      
      case 'guide':
        const guideMatch = path.match(/^\/guides\/([^\/\?]+)/);
        return guideMatch ? guideMatch[1] : null;
      
      case 'category':
        const categoryMatch = path.match(/^\/category\/([^\/\?]+)/);
        return categoryMatch ? categoryMatch[1] : null;
      
      case 'preview':
        const previewMatch = path.match(/^\/preview\/[^\/]+\/([^\/\?]+)/);
        return previewMatch ? previewMatch[1] : null;
      
      default:
        return null;
    }
  }

  /**
   * Generate breadcrumb URLs for content hierarchy
   * Ensures consistent breadcrumb navigation patterns
   */
  generateBreadcrumbUrls(contentType: UrlContentType, content?: BlogPost | Guide | Category): Array<{ name: string; url: string }> {
    const breadcrumbs: Array<{ name: string; url: string }> = [
      { name: 'Home', url: this.generateHomepageUrl() },
    ];

    switch (contentType) {
      case 'blog':
        breadcrumbs.push({ name: 'Blog', url: '/blog' });
        if (content && 'title' in content) {
          breadcrumbs.push({ 
            name: content.title, 
            url: this.generateBlogPostUrl(content as BlogPost) 
          });
        }
        break;
      
      case 'guide':
        breadcrumbs.push({ name: 'Guides', url: '/guides' });
        if (content && 'title' in content) {
          breadcrumbs.push({ 
            name: content.title, 
            url: this.generateGuideUrl(content as Guide) 
          });
        }
        break;
      
      case 'category':
        breadcrumbs.push({ name: 'Categories', url: '/categories' });
        if (content && 'name' in content) {
          breadcrumbs.push({ 
            name: content.name, 
            url: this.generateCategoryUrl(content as Category) 
          });
        }
        break;
      
      case 'faq':
        breadcrumbs.push({ name: 'FAQ', url: this.generateFaqUrl() });
        break;
      
      case 'search':
        breadcrumbs.push({ name: 'Search', url: this.generateSearchUrl() });
        break;
    }

    return breadcrumbs;
  }

  /**
   * Generate sitemap URLs for content type
   * Ensures consistent URL patterns in sitemaps
   */
  generateSitemapUrls(contentType: UrlContentType, content: BlogPost[] | Guide[] | Category[]): string[] {
    const urls: string[] = [];

    switch (contentType) {
      case 'blog':
        (content as BlogPost[]).forEach(post => {
          urls.push(this.generateBlogPostUrl(post, true));
        });
        break;
      
      case 'guide':
        (content as Guide[]).forEach(guide => {
          urls.push(this.generateGuideUrl(guide, true));
        });
        break;
      
      case 'category':
        (content as Category[]).forEach(category => {
          urls.push(this.generateCategoryUrl(category, true));
        });
        break;
    }

    return urls;
  }
}

/**
 * Factory function to create UrlPatternManager with site configuration
 * Uses environment variables with fallbacks for development
 */
export function createUrlPatternManager(): UrlPatternManager {
  const baseUrl = process.env.SITE_URL || 'http://localhost:4321';
  return new UrlPatternManager(baseUrl);
}

/**
 * Utility function to generate consistent URLs for any content type
 * Provides a unified interface for URL generation
 */
export function generateUrlForContentType(
  contentType: UrlContentType,
  content?: BlogPost | Guide | Category,
  options?: { absolute?: boolean; query?: string }
): string {
  const urlManager = createUrlPatternManager();
  const { absolute = false, query } = options || {};

  switch (contentType) {
    case 'blog':
      if (content && 'excerpt' in content) {
        return urlManager.generateBlogPostUrl(content as BlogPost, absolute);
      }
      break;
    
    case 'guide':
      if (content && 'difficulty' in content) {
        return urlManager.generateGuideUrl(content as Guide, absolute);
      }
      break;
    
    case 'category':
      if (content && 'color' in content) {
        return urlManager.generateCategoryUrl(content as Category, absolute);
      }
      break;
    
    case 'faq':
      return urlManager.generateFaqUrl(absolute);
    
    case 'homepage':
      return urlManager.generateHomepageUrl(absolute);
    
    case 'search':
      return urlManager.generateSearchUrl(query, absolute);
  }

  // Fallback to homepage
  return urlManager.generateHomepageUrl(absolute);
}

/**
 * Utility function to validate content slug format
 * Ensures all content follows consistent slug patterns
 */
export function validateContentSlug(slug: string): { isValid: boolean; error?: string; formatted?: string } {
  try {
    const urlManager = createUrlPatternManager();
    const formatted = urlManager.validateAndFormatSlug(slug);
    return { isValid: true, formatted };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Invalid slug format' 
    };
  }
}