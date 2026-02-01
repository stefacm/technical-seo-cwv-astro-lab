import { type Asset, type ContentfulClientApi, type Entry, createClient } from 'contentful';

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

// Client factory for dependency injection
export class ContentfulClientFactory {
  static createDeliveryClient(config: ContentfulConfig): ContentfulClientApi<undefined> {
    return createClient({
      space: config.spaceId,
      environment: config.environment,
      accessToken: config.deliveryToken,
      host: config.host,
    });
  }

  static createPreviewClient(config: ContentfulConfig): ContentfulClientApi<undefined> {
    return createClient({
      space: config.spaceId,
      environment: config.environment,
      accessToken: config.previewToken,
      host: 'preview.contentful.com',
    });
  }
}

// Main Contentful service implementation
export class ContentfulService implements ContentFetcher {
  constructor(
    private deliveryClient: ContentfulClientApi<undefined>,
    private previewClient: ContentfulClientApi<undefined>
  ) {}

  private getClient(preview: boolean): ContentfulClientApi<undefined> {
    return preview ? this.previewClient : this.deliveryClient;
  }

  private transformAsset(asset: any): ContentfulAsset | undefined {
    if (!asset || !asset.fields) return undefined;

    return {
      sys: {
        id: asset.sys.id,
        createdAt: asset.sys.createdAt,
        updatedAt: asset.sys.updatedAt,
      },
      fields: {
        title: String(asset.fields.title || ''),
        description: asset.fields.description ? String(asset.fields.description) : undefined,
        file: asset.fields.file as any,
      },
    };
  }

  private transformAuthor(entry: any): Author {
    if (!entry || !entry.fields) {
      throw new Error('Invalid author entry');
    }

    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      name: String(entry.fields.name),
      slug: String(entry.fields.slug),
      bio: entry.fields.bio ? String(entry.fields.bio) : undefined,
      avatar: entry.fields.avatar ? this.transformAsset(entry.fields.avatar) : undefined,
      socialLinks: entry.fields.socialLinks as Record<string, string> | undefined,
    };
  }

  private transformCategory(entry: any): Category {
    if (!entry || !entry.fields) {
      throw new Error('Invalid category entry');
    }

    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      name: String(entry.fields.name),
      slug: String(entry.fields.slug),
      description: String(entry.fields.description),
      featuredImage: entry.fields.featuredImage
        ? this.transformAsset(entry.fields.featuredImage)
        : undefined,
      color: String(entry.fields.color),
    };
  }

  private transformBlogPost(entry: Entry<any>): BlogPost {
    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      title: String(entry.fields.title),
      slug: String(entry.fields.slug),
      excerpt: String(entry.fields.excerpt),
      content: String(entry.fields.content),
      featuredImage: entry.fields.featuredImage
        ? this.transformAsset(entry.fields.featuredImage)
        : undefined,
      author: this.transformAuthor(entry.fields.author),
      category: this.transformCategory(entry.fields.category),
      tags: Array.isArray(entry.fields.tags) ? entry.fields.tags.map(String) : [],
      publishedAt: String(entry.fields.publishedAt),
      seo:
        entry.fields.seoTitle || entry.fields.seoDescription || entry.fields.seoImage
          ? {
              title: entry.fields.seoTitle ? String(entry.fields.seoTitle) : undefined,
              description: entry.fields.seoDescription
                ? String(entry.fields.seoDescription)
                : undefined,
              ogImage: entry.fields.seoImage
                ? this.transformAsset(entry.fields.seoImage)
                : undefined,
            }
          : undefined,
    };
  }

  private transformGuide(entry: Entry<any>): Guide {
    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      title: String(entry.fields.title),
      slug: String(entry.fields.slug),
      description: String(entry.fields.description),
      content: String(entry.fields.content),
      difficulty: entry.fields.difficulty as 'beginner' | 'intermediate' | 'advanced',
      estimatedTime: Number(entry.fields.estimatedTime),
      steps: Array.isArray(entry.fields.steps)
        ? (entry.fields.steps as unknown as GuideStep[])
        : [],
      featuredImage: entry.fields.featuredImage
        ? this.transformAsset(entry.fields.featuredImage)
        : undefined,
      category: this.transformCategory(entry.fields.category),
      tools: Array.isArray(entry.fields.tools) ? entry.fields.tools.map(String) : [],
      publishedAt: String(entry.fields.publishedAt),
    };
  }

  private transformFaqEntry(entry: Entry<any>): FaqEntry {
    return {
      sys: {
        id: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt,
      },
      question: String(entry.fields.question),
      answer: String(entry.fields.answer),
      category: String(entry.fields.category),
      order: Number(entry.fields.order),
    };
  }

  async getBlogPost(slug: string, preview = false): Promise<BlogPost | null> {
    try {
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
    } catch (error) {
      console.error(`Error fetching blog post ${slug}:`, error);
      throw new Error(`Failed to fetch blog post: ${slug}`);
    }
  }

  async getBlogPosts(limit = 10, preview = false): Promise<BlogPost[]> {
    try {
      const client = this.getClient(preview);
      const entries = await client.getEntries({
        content_type: 'blogPost',
        limit,
        order: ['-fields.publishedAt'] as any,
        include: 2,
      });

      return entries.items.map((entry: Entry<any>) => this.transformBlogPost(entry));
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
        order: ['-fields.publishedAt'] as any,
        include: 2,
      });

      return entries.items.map((entry: Entry<any>) => this.transformGuide(entry));
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
        order: ['fields.name'] as any,
        include: 1,
      });

      return entries.items.map((entry: Entry<any>) => this.transformCategory(entry));
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
        order: ['fields.order'] as any,
        include: 1,
      });

      return entries.items.map((entry: Entry<any>) => this.transformFaqEntry(entry));
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

  const deliveryClient = ContentfulClientFactory.createDeliveryClient(config);
  const previewClient = ContentfulClientFactory.createPreviewClient(config);

  return new ContentfulService(deliveryClient, previewClient);
}
