import { type ContentfulClientApi, type Entry, createClient } from 'contentful';

// Use any for Contentful entries due to dynamic nature of CMS content
// This is acceptable here as we're transforming to strongly typed interfaces
// biome-ignore lint/suspicious/noExplicitAny: Contentful entries have dynamic structure
type ContentfulEntry = Entry<any>;

// Helper function to safely convert Contentful fields to strings
function safeString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  // Only convert primitive types to avoid Object stringification
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return fallback;
}

// Helper function to safely convert optional Contentful fields to strings
function safeOptionalString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  // Only convert primitive types to avoid Object stringification
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return undefined;
}

// Contentful asset file type
interface ContentfulAssetFile {
  url: string;
  details: {
    size: number;
    image?: {
      width: number;
      height: number;
    };
  };
  fileName: string;
  contentType: string;
}

// Environment configuration interface
interface ContentfulConfig {
  spaceId: string;
  environment: string;
  deliveryToken: string;
  previewToken: string;
  host?: string;
}

// Base Contentful system fields
interface ContentfulSys {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Contentful asset interface
export interface ContentfulAsset {
  sys: ContentfulSys;
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

// Author content type interface
export interface Author {
  sys: ContentfulSys;
  name: string;
  slug: string;
  bio?: string;
  avatar?: ContentfulAsset;
  socialLinks?: Record<string, string>;
}

// Category content type interface
export interface Category {
  sys: ContentfulSys;
  name: string;
  slug: string;
  description: string;
  featuredImage?: ContentfulAsset;
  color: string;
}

// Blog post content type interface
export interface BlogPost {
  sys: ContentfulSys;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: ContentfulAsset;
  author: Author;
  category: Category;
  tags: string[];
  publishedAt: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: ContentfulAsset;
  };
}

// Guide step interface
export interface GuideStep {
  title: string;
  content: string;
  image?: ContentfulAsset;
}

// Guide content type interface
export interface Guide {
  sys: ContentfulSys;
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: GuideStep[];
  featuredImage?: ContentfulAsset;
  category: Category;
  tools: string[];
  publishedAt: string;
}

// FAQ entry content type interface
export interface FaqEntry {
  sys: ContentfulSys;
  question: string;
  answer: string;
  category: string;
  order: number;
}

// Content fetcher interface defining the contract
export interface ContentFetcher {
  getBlogPost(slug: string, preview?: boolean): Promise<BlogPost | null>;
  getBlogPosts(limit?: number, preview?: boolean): Promise<BlogPost[]>;
  getGuide(slug: string, preview?: boolean): Promise<Guide | null>;
  getGuides(limit?: number, preview?: boolean): Promise<Guide[]>;
  getCategory(slug: string, preview?: boolean): Promise<Category | null>;
  getCategories(preview?: boolean): Promise<Category[]>;
  getFaqEntries(preview?: boolean): Promise<FaqEntry[]>;
}

// Client factory functions for dependency injection
export function createDeliveryClient(config: ContentfulConfig): ContentfulClientApi<undefined> {
  return createClient({
    space: config.spaceId,
    environment: config.environment,
    accessToken: config.deliveryToken,
    host: config.host,
  });
}

export function createPreviewClient(config: ContentfulConfig): ContentfulClientApi<undefined> {
  return createClient({
    space: config.spaceId,
    environment: config.environment,
    accessToken: config.previewToken,
    host: 'preview.contentful.com',
  });
}

// Main Contentful service implementation
export class ContentfulService implements ContentFetcher {
  constructor(
    private readonly deliveryClient: ContentfulClientApi<undefined>,
    private readonly previewClient: ContentfulClientApi<undefined>
  ) {}

  private getClient(preview: boolean): ContentfulClientApi<undefined> {
    return preview ? this.previewClient : this.deliveryClient;
  }

  private async fetchBlogPost(slug: string, preview: boolean): Promise<BlogPost | null> {
    const client = this.getClient(preview);
    const entries = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
      include: 2,
    });

    if (entries.items.length === 0) {
      return null;
    }

    return this.transformBlogPost(entries.items[0]);
  }

  private async fetchBlogPosts(limit: number, preview: boolean): Promise<BlogPost[]> {
    const client = this.getClient(preview);
    const entries = await client.getEntries({
      content_type: 'blogPost',
      limit,
      order: ['-fields.publishedAt'],
      include: 2,
    });

    return entries.items.map((entry: ContentfulEntry) => this.transformBlogPost(entry));
  }

  private transformAsset(asset: ContentfulEntry | undefined): ContentfulAsset | undefined {
    if (!asset || !asset.fields) return undefined;

    return {
      sys: {
        id: asset.sys.id,
        createdAt: asset.sys.createdAt,
        updatedAt: asset.sys.updatedAt,
      },
      fields: {
        title: safeString(asset.fields.title),
        description: safeOptionalString(asset.fields.description),
        file: asset.fields.file as unknown as ContentfulAssetFile,
      },
    };
  }

  private transformAuthor(entry: ContentfulEntry): Author {
    if (!entry || !entry.fields) {
      throw new Error('Invalid author entry');
    }

    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      name: safeString(entry.fields.name),
      slug: safeString(entry.fields.slug),
      bio: safeOptionalString(entry.fields.bio),
      avatar: entry.fields.avatar
        ? this.transformAsset(entry.fields.avatar as ContentfulEntry)
        : undefined,
      socialLinks: entry.fields.socialLinks as Record<string, string> | undefined,
    };
  }

  private transformCategory(entry: ContentfulEntry): Category {
    if (!entry || !entry.fields) {
      throw new Error('Invalid category entry');
    }

    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      name: safeString(entry.fields.name),
      slug: safeString(entry.fields.slug),
      description: safeString(entry.fields.description),
      featuredImage: entry.fields.featuredImage
        ? this.transformAsset(entry.fields.featuredImage as ContentfulEntry)
        : undefined,
      color: safeString(entry.fields.color),
    };
  }

  private transformBlogPost(entry: ContentfulEntry): BlogPost {
    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      title: safeString(entry.fields.title),
      slug: safeString(entry.fields.slug),
      excerpt: safeString(entry.fields.excerpt),
      content: safeString(entry.fields.content),
      featuredImage: entry.fields.featuredImage
        ? this.transformAsset(entry.fields.featuredImage as ContentfulEntry)
        : undefined,
      author: this.transformAuthor(entry.fields.author as ContentfulEntry),
      category: this.transformCategory(entry.fields.category as ContentfulEntry),
      tags: Array.isArray(entry.fields.tags) ? entry.fields.tags.map(String) : [],
      publishedAt: safeString(entry.fields.publishedAt),
      seo:
        entry.fields.seoTitle || entry.fields.seoDescription || entry.fields.seoImage
          ? {
              title: safeOptionalString(entry.fields.seoTitle),
              description: safeOptionalString(entry.fields.seoDescription),
              ogImage: entry.fields.seoImage
                ? this.transformAsset(entry.fields.seoImage as ContentfulEntry)
                : undefined,
            }
          : undefined,
    };
  }

  private transformGuide(entry: ContentfulEntry): Guide {
    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      title: safeString(entry.fields.title),
      slug: safeString(entry.fields.slug),
      description: safeString(entry.fields.description),
      content: safeString(entry.fields.content),
      difficulty: entry.fields.difficulty as 'beginner' | 'intermediate' | 'advanced',
      estimatedTime: Number(entry.fields.estimatedTime),
      steps: Array.isArray(entry.fields.steps)
        ? (entry.fields.steps as unknown as GuideStep[])
        : [],
      featuredImage: entry.fields.featuredImage
        ? this.transformAsset(entry.fields.featuredImage as ContentfulEntry)
        : undefined,
      category: this.transformCategory(entry.fields.category as ContentfulEntry),
      tools: Array.isArray(entry.fields.tools) ? entry.fields.tools.map(String) : [],
      publishedAt: safeString(entry.fields.publishedAt),
    };
  }

  private transformFaqEntry(entry: ContentfulEntry): FaqEntry {
    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      question: safeString(entry.fields.question),
      answer: safeString(entry.fields.answer),
      category: safeString(entry.fields.category),
      order: Number(entry.fields.order),
    };
  }

  async getBlogPost(slug: string, preview = false): Promise<BlogPost | null> {
    try {
      return await this.fetchBlogPost(slug, preview);
    } catch (error) {
      console.error(`Error fetching blog post ${slug}:`, error);
      throw new Error(`Failed to fetch blog post: ${slug}`);
    }
  }

  async getBlogPosts(limit = 10, preview = false): Promise<BlogPost[]> {
    try {
      return await this.fetchBlogPosts(limit, preview);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw new Error('Failed to fetch blog posts');
    }
  }

  async getGuide(slug: string, preview = false): Promise<Guide | null> {
    try {
      const client = this.getClient(preview);
      const entries = await client.getEntries({
        content_type: 'guide',
        'fields.slug': slug,
        limit: 1,
        include: 2,
      });

      if (entries.items.length === 0) {
        return null;
      }

      return this.transformGuide(entries.items[0]);
    } catch (error) {
      console.error(`Error fetching guide ${slug}:`, error);
      throw new Error(`Failed to fetch guide: ${slug}`);
    }
  }

  async getGuides(limit = 10, preview = false): Promise<Guide[]> {
    try {
      const client = this.getClient(preview);
      const entries = await client.getEntries({
        content_type: 'guide',
        limit,
        order: ['-fields.publishedAt'],
        include: 2,
      });

      return entries.items.map((entry: ContentfulEntry) => this.transformGuide(entry));
    } catch (error) {
      console.error('Error fetching guides:', error);
      throw new Error('Failed to fetch guides');
    }
  }

  async getCategory(slug: string, preview = false): Promise<Category | null> {
    try {
      const client = this.getClient(preview);
      const entries = await client.getEntries({
        content_type: 'category',
        'fields.slug': slug,
        limit: 1,
        include: 1,
      });

      if (entries.items.length === 0) {
        return null;
      }

      return this.transformCategory(entries.items[0]);
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error);
      throw new Error(`Failed to fetch category: ${slug}`);
    }
  }

  async getCategories(preview = false): Promise<Category[]> {
    try {
      const client = this.getClient(preview);
      const entries = await client.getEntries({
        content_type: 'category',
        order: ['fields.name'],
        include: 1,
      });

      return entries.items.map((entry: ContentfulEntry) => this.transformCategory(entry));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  async getFaqEntries(preview = false): Promise<FaqEntry[]> {
    try {
      const client = this.getClient(preview);
      const entries = await client.getEntries({
        content_type: 'faqEntry',
        order: ['fields.order'],
        include: 1,
      });

      return entries.items.map((entry: ContentfulEntry) => this.transformFaqEntry(entry));
    } catch (error) {
      console.error('Error fetching FAQ entries:', error);
      throw new Error('Failed to fetch FAQ entries');
    }
  }
}

// Factory function to create ContentfulService with environment configuration
export function createContentfulService(): ContentfulService | null {
  const config: ContentfulConfig = {
    spaceId: process.env.CONTENTFUL_SPACE_ID || '',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    deliveryToken: process.env.CONTENTFUL_DELIVERY_TOKEN || '',
    previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN || '',
  };

  // Return null if required environment variables are missing
  // This allows fallback to mock data in development
  if (!config.spaceId || !config.deliveryToken || !config.previewToken) {
    return null;
  }

  const deliveryClient = createDeliveryClient(config);
  const previewClient = createPreviewClient(config);

  return new ContentfulService(deliveryClient, previewClient);
}
