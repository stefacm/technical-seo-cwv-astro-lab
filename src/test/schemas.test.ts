import { describe, expect, it } from 'vitest';
import { mockBlogPosts, mockFaqEntries, mockGuides } from '../lib/mocks.js';
import { SchemaGenerator, createSchemaGenerator } from '../lib/schemas.js';

describe('Schema Generators', () => {
  const schemaGenerator = createSchemaGenerator();

  it('should generate valid Organization schema', () => {
    const schema = schemaGenerator.generateOrganizationSchema();

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('Technical SEO Lab');
    expect(schema.url).toMatch(/^https?:\/\//);
    expect(schema.sameAs).toBeInstanceOf(Array);
  });

  it('should generate valid WebSite schema with search functionality', () => {
    const schema = schemaGenerator.generateWebSiteSchema();

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBe('Technical SEO CWV Astro Lab');
    expect(schema.url).toMatch(/^https?:\/\//);
    expect(schema.potentialAction).toBeDefined();
    expect(schema.potentialAction?.['@type']).toBe('SearchAction');
    expect(schema.potentialAction?.target['@type']).toBe('EntryPoint');
    expect(schema.potentialAction?.target.urlTemplate).toContain('/search?q=');
  });

  it('should generate valid BlogPosting schema', () => {
    const blogPost = mockBlogPosts[0];
    const canonicalUrl = 'https://example.com/blog/test-post';
    const schema = schemaGenerator.generateBlogPostingSchema(blogPost, canonicalUrl);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.headline).toBe(blogPost.title);
    expect(schema.description).toBe(blogPost.excerpt);
    expect(schema.author['@type']).toBe('Person');
    expect(schema.author.name).toBe(blogPost.author.name);
    expect(schema.publisher['@type']).toBe('Organization');
    expect(schema.datePublished).toBe(blogPost.publishedAt);
    expect(schema.dateModified).toBe(blogPost.sys.updatedAt);
    expect(schema.mainEntityOfPage['@id']).toBe(canonicalUrl);

    if (blogPost.featuredImage) {
      expect(schema.image).toBeDefined();
      expect(schema.image?.['@type']).toBe('ImageObject');
    }

    if (blogPost.category) {
      expect(schema.articleSection).toBe(blogPost.category.name);
    }

    if (blogPost.tags && blogPost.tags.length > 0) {
      expect(schema.keywords).toEqual(blogPost.tags);
    }
  });

  it('should generate valid HowTo schema', () => {
    const guide = mockGuides[0];
    const schema = schemaGenerator.generateHowToSchema(guide);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('HowTo');
    expect(schema.name).toBe(guide.title);
    expect(schema.description).toBe(guide.description);
    expect(schema.step).toBeInstanceOf(Array);
    expect(schema.step.length).toBe(guide.steps.length);

    // Check first step structure
    const firstStep = schema.step[0];
    expect(firstStep['@type']).toBe('HowToStep');
    expect(firstStep.name).toBe(guide.steps[0].title);
    expect(firstStep.text).toBe(guide.steps[0].content);

    if (guide.estimatedTime) {
      expect(schema.totalTime).toBe(`PT${guide.estimatedTime}M`);
    }

    if (guide.tools && guide.tools.length > 0) {
      expect(schema.tool).toEqual(guide.tools);
    }
  });

  it('should generate valid BreadcrumbList schema', () => {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'Article', url: '/blog/article' },
    ];

    const schema = schemaGenerator.generateBreadcrumbListSchema(breadcrumbs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toBeInstanceOf(Array);
    expect(schema.itemListElement.length).toBe(3);

    // Check first breadcrumb
    const firstItem = schema.itemListElement[0];
    expect(firstItem['@type']).toBe('ListItem');
    expect(firstItem.position).toBe(1);
    expect(firstItem.name).toBe('Home');
    expect(firstItem.item).toMatch(/\/$/);
  });

  it('should generate valid FAQPage schema', () => {
    const faqEntries = mockFaqEntries.slice(0, 3); // Use first 3 entries
    const schema = schemaGenerator.generateFAQPageSchema(faqEntries);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toBeInstanceOf(Array);
    expect(schema.mainEntity.length).toBe(3);

    // Check first FAQ item
    const firstFaq = schema.mainEntity[0];
    expect(firstFaq['@type']).toBe('Question');
    expect(firstFaq.name).toBe(faqEntries[0].question);
    expect(firstFaq.acceptedAnswer['@type']).toBe('Answer');
    expect(firstFaq.acceptedAnswer.text).toBe(faqEntries[0].answer);
  });

  it('should create schema generator with proper configuration', () => {
    const generator = createSchemaGenerator();
    expect(generator).toBeInstanceOf(SchemaGenerator);

    // Test that it generates valid schemas
    const orgSchema = generator.generateOrganizationSchema();
    expect(orgSchema.name).toBe('Technical SEO Lab');

    const websiteSchema = generator.generateWebSiteSchema();
    expect(websiteSchema.name).toBe('Technical SEO CWV Astro Lab');
  });
});
