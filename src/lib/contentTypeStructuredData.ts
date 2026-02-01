// Content type-specific structured data generation
// Implements dynamic schema generation based on content type and context

import type { BlogPost, Guide, Category, FaqEntry } from './contentful.js';
import { createSchemaGenerator } from './schemas.js';

// Content type enumeration for structured data
export type StructuredDataContentType = 'blog' | 'guide' | 'category' | 'faq' | 'homepage' | 'search';

// Enhanced structured data configuration
interface StructuredDataConfig {
  siteUrl: string;
  siteName: string;
  organizationName: string;
  logoUrl?: string;
  socialLinks?: string[];
}

/**
 * Content type-specific structured data generator
 * Implements single responsibility principle for structured data generation
 */
export class ContentTypeStructuredDataGenerator {
  private readonly schemaGenerator: ReturnType<typeof createSchemaGenerator>;
  private readonly config: StructuredDataConfig;

  constructor(config: StructuredDataConfig) {
    this.config = config;
    this.schemaGenerator = createSchemaGenerator();
  }

  /**
   * Generate structured data for blog post content type
   * Returns BlogPosting schema with enhanced metadata
   */
  generateBlogPostStructuredData(
    post: BlogPost, 
    canonicalUrl: string,
    includeOrganization = true
  ): Record<string, unknown>[] {
    const schemas: Record<string, unknown>[] = [];

    // Add BlogPosting schema
    const blogPostingSchema = this.schemaGenerator.generateBlogPostingSchema(post, canonicalUrl);
    schemas.push(blogPostingSchema as unknown as Record<string, unknown>);

    // Add BreadcrumbList schema if applicable
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` },
    ];
    const breadcrumbSchema = this.schemaGenerator.generateBreadcrumbListSchema(breadcrumbs);
    schemas.push(breadcrumbSchema as unknown as Record<string, unknown>);

    // Add Organization schema for publisher context
    if (includeOrganization) {
      const organizationSchema = this.schemaGenerator.generateOrganizationSchema();
      schemas.push(organizationSchema as unknown as Record<string, unknown>);
    }

    return schemas;
  }

  /**
   * Generate structured data for guide content type
   * Returns HowTo schema with enhanced step-by-step information
   */
  generateGuideStructuredData(
    guide: Guide, 
    canonicalUrl: string,
    includeOrganization = true
  ): Record<string, unknown>[] {
    const schemas: Record<string, unknown>[] = [];

    // Add HowTo schema
    const howToSchema = this.schemaGenerator.generateHowToSchema(guide);
    schemas.push(howToSchema as unknown as Record<string, unknown>);

    // Add BreadcrumbList schema
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Guides', url: '/guides' },
      { name: guide.title, url: `/guides/${guide.slug}` },
    ];
    const breadcrumbSchema = this.schemaGenerator.generateBreadcrumbListSchema(breadcrumbs);
    schemas.push(breadcrumbSchema as unknown as Record<string, unknown>);

    // Add Organization schema for publisher context
    if (includeOrganization) {
      const organizationSchema = this.schemaGenerator.generateOrganizationSchema();
      schemas.push(organizationSchema as unknown as Record<string, unknown>);
    }

    // Add Course schema for educational content (optional enhancement)
    if (guide.difficulty && guide.estimatedTime) {
      const courseSchema = this.generateCourseSchema(guide, canonicalUrl);
      schemas.push(courseSchema);
    }

    return schemas;
  }

  /**
   * Generate structured data for category content type
   * Returns CollectionPage schema with content organization
   */
  generateCategoryStructuredData(
    category: Category,
    canonicalUrl: string,
    contentCounts?: { blogPosts: number; guides: number }
  ): Record<string, unknown>[] {
    const schemas: Record<string, unknown>[] = [];

    // Add CollectionPage schema
    const collectionPageSchema = this.generateCollectionPageSchema(category, canonicalUrl, contentCounts);
    schemas.push(collectionPageSchema);

    // Add BreadcrumbList schema
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Categories', url: '/categories' },
      { name: category.name, url: `/category/${category.slug}` },
    ];
    const breadcrumbSchema = this.schemaGenerator.generateBreadcrumbListSchema(breadcrumbs);
    schemas.push(breadcrumbSchema as unknown as Record<string, unknown>);

    // Add Organization schema
    const organizationSchema = this.schemaGenerator.generateOrganizationSchema();
    schemas.push(organizationSchema as unknown as Record<string, unknown>);

    return schemas;
  }

  /**
   * Generate structured data for FAQ content type
   * Returns FAQPage schema with question organization
   */
  generateFaqStructuredData(
    faqEntries: FaqEntry[],
    canonicalUrl: string
  ): Record<string, unknown>[] {
    const schemas: Record<string, unknown>[] = [];

    // Add FAQPage schema
    const faqPageSchema = this.schemaGenerator.generateFAQPageSchema(faqEntries);
    schemas.push(faqPageSchema as unknown as Record<string, unknown>);

    // Add BreadcrumbList schema
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'FAQ', url: '/faq' },
    ];
    const breadcrumbSchema = this.schemaGenerator.generateBreadcrumbListSchema(breadcrumbs);
    schemas.push(breadcrumbSchema as unknown as Record<string, unknown>);

    // Add Organization schema
    const organizationSchema = this.schemaGenerator.generateOrganizationSchema();
    schemas.push(organizationSchema as unknown as Record<string, unknown>);

    return schemas;
  }

  /**
   * Generate structured data for homepage
   * Returns Organization and WebSite schemas with enhanced metadata
   */
  generateHomepageStructuredData(): Record<string, unknown>[] {
    const schemas: Record<string, unknown>[] = [];

    // Add Organization schema
    const organizationSchema = this.schemaGenerator.generateOrganizationSchema();
    schemas.push(organizationSchema as unknown as Record<string, unknown>);

    // Add WebSite schema with search functionality
    const websiteSchema = this.schemaGenerator.generateWebSiteSchema();
    schemas.push(websiteSchema as unknown as Record<string, unknown>);

    return schemas;
  }

  /**
   * Generate structured data for search pages
   * Returns SearchResultsPage schema (no indexing)
   */
  generateSearchStructuredData(
    query?: string,
    resultCount?: number
  ): Record<string, unknown>[] {
    const schemas: Record<string, unknown>[] = [];

    // Add SearchResultsPage schema
    const searchResultsSchema = this.generateSearchResultsPageSchema(query, resultCount);
    schemas.push(searchResultsSchema);

    // Add Organization schema for context
    const organizationSchema = this.schemaGenerator.generateOrganizationSchema();
    schemas.push(organizationSchema as unknown as Record<string, unknown>);

    return schemas;
  }

  /**
   * Generate fallback structured data for any content type
   * Returns basic WebPage schema with organization context
   */
  generateFallbackStructuredData(
    contentType: StructuredDataContentType,
    canonicalUrl: string,
    title?: string,
    description?: string
  ): Record<string, unknown>[] {
    const schemas: Record<string, unknown>[] = [];

    // Add basic WebPage schema
    const webPageSchema = this.generateWebPageSchema(canonicalUrl, title, description);
    schemas.push(webPageSchema);

    // Add Organization schema
    const organizationSchema = this.schemaGenerator.generateOrganizationSchema();
    schemas.push(organizationSchema as unknown as Record<string, unknown>);

    return schemas;
  }

  /**
   * Generate Course schema for educational guide content
   * Enhances guides with educational context
   */
  private generateCourseSchema(guide: Guide, canonicalUrl: string): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: guide.title,
      description: guide.description,
      provider: {
        '@type': 'Organization',
        name: this.config.organizationName,
        url: this.config.siteUrl,
      },
      educationalLevel: guide.difficulty,
      timeRequired: `PT${guide.estimatedTime}M`,
      courseCode: guide.slug,
      url: canonicalUrl,
      ...(guide.featuredImage && {
        image: {
          '@type': 'ImageObject',
          url: guide.featuredImage.fields.file.url.startsWith('http')
            ? guide.featuredImage.fields.file.url
            : `${this.config.siteUrl}${guide.featuredImage.fields.file.url}`,
        },
      }),
    };
  }

  /**
   * Generate CollectionPage schema for category pages
   * Provides context for content organization
   */
  private generateCollectionPageSchema(
    category: Category,
    canonicalUrl: string,
    contentCounts?: { blogPosts: number; guides: number }
  ): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description: category.description,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        name: `${category.name} Content`,
        description: `Collection of articles and guides about ${category.name.toLowerCase()}`,
      },
    };

    // Add content counts if available
    if (contentCounts) {
      const totalItems = contentCounts.blogPosts + contentCounts.guides;
      schema.mainEntity = {
        ...schema.mainEntity as Record<string, unknown>,
        numberOfItems: totalItems,
      };
    }

    // Add featured image if available
    if (category.featuredImage) {
      schema.image = {
        '@type': 'ImageObject',
        url: category.featuredImage.fields.file.url.startsWith('http')
          ? category.featuredImage.fields.file.url
          : `${this.config.siteUrl}${category.featuredImage.fields.file.url}`,
      };
    }

    return schema;
  }

  /**
   * Generate SearchResultsPage schema for search functionality
   * Provides context for search results (not indexed)
   */
  private generateSearchResultsPageSchema(
    query?: string,
    resultCount?: number
  ): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: query ? `Search results for "${query}"` : 'Search',
      description: query 
        ? `Search results for "${query}" on ${this.config.siteName}`
        : `Search ${this.config.siteName} for articles and guides`,
      url: `${this.config.siteUrl}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    };

    // Add search query and result count if available
    if (query) {
      schema.mainEntity = {
        '@type': 'SearchAction',
        query: query,
        ...(resultCount !== undefined && { resultCount }),
      };
    }

    return schema;
  }

  /**
   * Generate basic WebPage schema for fallback cases
   * Provides minimal structured data for any page
   */
  private generateWebPageSchema(
    canonicalUrl: string,
    title?: string,
    description?: string
  ): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title || this.config.siteName,
      description: description || `Content from ${this.config.siteName}`,
      url: canonicalUrl,
      publisher: {
        '@type': 'Organization',
        name: this.config.organizationName,
        url: this.config.siteUrl,
      },
    };
  }
}

/**
 * Factory function to create ContentTypeStructuredDataGenerator with site configuration
 * Uses environment variables with fallbacks for development
 */
export function createContentTypeStructuredDataGenerator(): ContentTypeStructuredDataGenerator {
  const config: StructuredDataConfig = {
    siteUrl: process.env.SITE_URL || 'http://localhost:4321',
    siteName: 'Technical SEO CWV Astro Lab',
    organizationName: 'Technical SEO Lab',
    logoUrl: process.env.SITE_URL
      ? `${process.env.SITE_URL}/images/logo.png`
      : 'http://localhost:4321/images/logo.png',
    socialLinks: [
      'https://github.com/technical-seo-lab',
      'https://twitter.com/techseolab',
      'https://linkedin.com/company/technical-seo-lab',
    ],
  };

  return new ContentTypeStructuredDataGenerator(config);
}

/**
 * Utility function to determine appropriate structured data based on content type
 * Helps with automatic structured data selection
 */
export function generateStructuredDataForContentType(
  contentType: StructuredDataContentType,
  content: BlogPost | Guide | Category | FaqEntry[] | null,
  canonicalUrl: string,
  additionalContext?: Record<string, unknown>
): Record<string, unknown>[] {
  const generator = createContentTypeStructuredDataGenerator();

  switch (contentType) {
    case 'blog':
      if (content && 'excerpt' in content) {
        return generator.generateBlogPostStructuredData(content as BlogPost, canonicalUrl);
      }
      break;
    
    case 'guide':
      if (content && 'difficulty' in content) {
        return generator.generateGuideStructuredData(content as Guide, canonicalUrl);
      }
      break;
    
    case 'category':
      if (content && 'color' in content) {
        const contentCounts = additionalContext?.contentCounts as { blogPosts: number; guides: number } | undefined;
        return generator.generateCategoryStructuredData(content as Category, canonicalUrl, contentCounts);
      }
      break;
    
    case 'faq':
      if (Array.isArray(content)) {
        return generator.generateFaqStructuredData(content as FaqEntry[], canonicalUrl);
      }
      break;
    
    case 'homepage':
      return generator.generateHomepageStructuredData();
    
    case 'search':
      const query = additionalContext?.query as string | undefined;
      const resultCount = additionalContext?.resultCount as number | undefined;
      return generator.generateSearchStructuredData(query, resultCount);
    
    default:
      return generator.generateFallbackStructuredData(contentType, canonicalUrl);
  }

  // Fallback if content type doesn't match
  return generator.generateFallbackStructuredData(contentType, canonicalUrl);
}