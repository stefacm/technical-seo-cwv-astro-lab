// Schema.org structured data generators
// Implements Organization, WebSite, BlogPosting, HowTo, BreadcrumbList, and FAQPage schemas

import type { BlogPost, FaqEntry, Guide } from './contentful.js';

// Base schema interface
interface BaseSchema {
  '@context': string;
  '@type': string;
}

// Organization schema interface
interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: {
    '@type': 'ImageObject';
    url: string;
  };
  sameAs?: string[];
}

// WebSite schema interface
interface WebSiteSchema extends BaseSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

// BlogPosting schema interface
interface BlogPostingSchema extends BaseSchema {
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: OrganizationSchema;
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  image?: {
    '@type': 'ImageObject';
    url: string;
    width?: number;
    height?: number;
  };
  articleSection?: string;
  keywords?: string[];
}

// HowTo schema interface
interface HowToSchema extends BaseSchema {
  '@type': 'HowTo';
  name: string;
  description: string;
  image?: {
    '@type': 'ImageObject';
    url: string;
  };
  estimatedCost?: {
    '@type': 'MonetaryAmount';
    currency: string;
    value: string;
  };
  totalTime?: string;
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
    image?: {
      '@type': 'ImageObject';
      url: string;
    };
  }>;
  tool?: string[];
}

// BreadcrumbList schema interface
interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

// FAQPage schema interface
interface FAQPageSchema extends BaseSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// Schema generator configuration
interface SchemaConfig {
  siteUrl: string;
  siteName: string;
  organizationName: string;
  logoUrl?: string;
  socialLinks?: string[];
}

/**
 * Schema.org structured data generator class
 * Implements single responsibility principle - only handles schema generation
 */
export class SchemaGenerator {
  private config: SchemaConfig;

  constructor(config: SchemaConfig) {
    this.config = config;
  }

  /**
   * Generate Organization schema
   * Used for establishing the website's organization identity
   */
  generateOrganizationSchema(): OrganizationSchema {
    const schema: OrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.config.organizationName,
      url: this.config.siteUrl,
    };

    if (this.config.logoUrl) {
      schema.logo = {
        '@type': 'ImageObject',
        url: this.config.logoUrl,
      };
    }

    if (this.config.socialLinks && this.config.socialLinks.length > 0) {
      schema.sameAs = this.config.socialLinks;
    }

    return schema;
  }

  /**
   * Generate WebSite schema with search functionality
   * Enables search box in Google search results
   */
  generateWebSiteSchema(): WebSiteSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.config.siteName,
      url: this.config.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.config.siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  /**
   * Generate BlogPosting schema for blog articles
   * Enables rich snippets for blog posts in search results
   */
  generateBlogPostingSchema(post: BlogPost, canonicalUrl: string): BlogPostingSchema {
    const schema: BlogPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
      publisher: this.generateOrganizationSchema(),
      datePublished: post.publishedAt,
      dateModified: post.sys.updatedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    };

    // Add author URL if available
    if (post.author.slug) {
      schema.author.url = `${this.config.siteUrl}/author/${post.author.slug}`;
    }

    // Add featured image if available
    if (post.featuredImage) {
      schema.image = {
        '@type': 'ImageObject',
        url: post.featuredImage.fields.file.url.startsWith('http')
          ? post.featuredImage.fields.file.url
          : `${this.config.siteUrl}${post.featuredImage.fields.file.url}`,
      };

      // Add image dimensions if available
      if (post.featuredImage.fields.file.details.image) {
        schema.image.width = post.featuredImage.fields.file.details.image.width;
        schema.image.height = post.featuredImage.fields.file.details.image.height;
      }
    }

    // Add article section (category)
    if (post.category) {
      schema.articleSection = post.category.name;
    }

    // Add keywords (tags)
    if (post.tags && post.tags.length > 0) {
      schema.keywords = post.tags;
    }

    return schema;
  }

  /**
   * Generate HowTo schema for guide content
   * Enables rich snippets for how-to guides in search results
   */
  generateHowToSchema(guide: Guide): HowToSchema {
    const schema: HowToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: guide.title,
      description: guide.description,
      step: guide.steps.map((step) => {
        const howToStep: HowToSchema['step'][0] = {
          '@type': 'HowToStep',
          name: step.title,
          text: step.content,
        };

        // Add step image if available
        if (step.image) {
          howToStep.image = {
            '@type': 'ImageObject',
            url: step.image.fields.file.url.startsWith('http')
              ? step.image.fields.file.url
              : `${this.config.siteUrl}${step.image.fields.file.url}`,
          };
        }

        return howToStep;
      }),
    };

    // Add featured image if available
    if (guide.featuredImage) {
      schema.image = {
        '@type': 'ImageObject',
        url: guide.featuredImage.fields.file.url.startsWith('http')
          ? guide.featuredImage.fields.file.url
          : `${this.config.siteUrl}${guide.featuredImage.fields.file.url}`,
      };
    }

    // Add estimated time in ISO 8601 duration format
    if (guide.estimatedTime) {
      schema.totalTime = `PT${guide.estimatedTime}M`;
    }

    // Add tools if available
    if (guide.tools && guide.tools.length > 0) {
      schema.tool = guide.tools;
    }

    return schema;
  }

  /**
   * Generate BreadcrumbList schema for navigation context
   * Helps search engines understand page hierarchy
   */
  generateBreadcrumbListSchema(
    breadcrumbs: Array<{ name: string; url: string }>
  ): BreadcrumbListSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${this.config.siteUrl}${crumb.url}`,
      })),
    };
  }

  /**
   * Generate FAQPage schema for FAQ content
   * Enables FAQ rich snippets in search results
   */
  generateFAQPageSchema(faqEntries: FaqEntry[]): FAQPageSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqEntries.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: entry.answer,
        },
      })),
    };
  }
}

/**
 * Factory function to create SchemaGenerator with site configuration
 * Uses environment variables with fallbacks for development
 */
export function createSchemaGenerator(): SchemaGenerator {
  const config: SchemaConfig = {
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

  return new SchemaGenerator(config);
}
