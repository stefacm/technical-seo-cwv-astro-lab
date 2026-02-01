import { describe, expect, it } from 'vitest';
import { MockContentfulService, createContentService } from '../lib/mocks.js';

describe('Contentful Integration', () => {
  it('should create mock service when no credentials are provided', () => {
    const service = createContentService();
    expect(service).toBeInstanceOf(MockContentfulService);
  });

  it('should fetch blog posts from mock service', async () => {
    const service = new MockContentfulService();
    const posts = await service.getBlogPosts(2);

    expect(posts).toHaveLength(2);
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('slug');
    expect(posts[0]).toHaveProperty('excerpt');
    expect(posts[0]).toHaveProperty('author');
    expect(posts[0]).toHaveProperty('category');
  });

  it('should fetch single blog post by slug', async () => {
    const service = new MockContentfulService();
    const post = await service.getBlogPost('advanced-core-web-vitals-optimization-astro');

    expect(post).toBeDefined();
    expect(post?.title).toBe('Advanced Core Web Vitals Optimization with Astro');
    expect(post?.slug).toBe('advanced-core-web-vitals-optimization-astro');
  });

  it('should return null for non-existent blog post', async () => {
    const service = new MockContentfulService();
    const post = await service.getBlogPost('non-existent-slug');

    expect(post).toBeNull();
  });

  it('should fetch guides from mock service', async () => {
    const service = new MockContentfulService();
    const guides = await service.getGuides();

    expect(guides.length).toBeGreaterThan(0);
    expect(guides[0]).toHaveProperty('title');
    expect(guides[0]).toHaveProperty('difficulty');
    expect(guides[0]).toHaveProperty('estimatedTime');
    expect(guides[0]).toHaveProperty('steps');
  });

  it('should fetch categories from mock service', async () => {
    const service = new MockContentfulService();
    const categories = await service.getCategories();

    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('name');
    expect(categories[0]).toHaveProperty('slug');
    expect(categories[0]).toHaveProperty('color');
  });

  it('should fetch FAQ entries from mock service', async () => {
    const service = new MockContentfulService();
    const faqs = await service.getFaqEntries();

    expect(faqs.length).toBeGreaterThan(0);
    expect(faqs[0]).toHaveProperty('question');
    expect(faqs[0]).toHaveProperty('answer');
    expect(faqs[0]).toHaveProperty('order');
  });

  it('should maintain proper data structure for blog posts', async () => {
    const service = new MockContentfulService();
    const post = await service.getBlogPost('advanced-core-web-vitals-optimization-astro');

    expect(post).toBeDefined();
    expect(post?.sys).toHaveProperty('id');
    expect(post?.sys).toHaveProperty('createdAt');
    expect(post?.sys).toHaveProperty('updatedAt');
    expect(post?.author).toHaveProperty('name');
    expect(post?.category).toHaveProperty('name');
    expect(Array.isArray(post?.tags)).toBe(true);
  });
});
