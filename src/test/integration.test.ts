import { describe, it, expect } from 'vitest';
import { createContentService } from '../lib/mocks.js';

describe('Content Service Integration', () => {
  it('should create a working content service', async () => {
    const service = createContentService();
    
    // Test that the service implements all required methods
    expect(typeof service.getBlogPost).toBe('function');
    expect(typeof service.getBlogPosts).toBe('function');
    expect(typeof service.getGuide).toBe('function');
    expect(typeof service.getGuides).toBe('function');
    expect(typeof service.getCategory).toBe('function');
    expect(typeof service.getCategories).toBe('function');
    expect(typeof service.getFaqEntries).toBe('function');
  });

  it('should fetch and return properly structured blog posts', async () => {
    const service = createContentService();
    const posts = await service.getBlogPosts(1);
    
    expect(posts).toHaveLength(1);
    
    const post = posts[0];
    expect(post.sys).toHaveProperty('id');
    expect(post.sys).toHaveProperty('createdAt');
    expect(post.sys).toHaveProperty('updatedAt');
    expect(typeof post.title).toBe('string');
    expect(typeof post.slug).toBe('string');
    expect(typeof post.excerpt).toBe('string');
    expect(typeof post.content).toBe('string');
    expect(typeof post.publishedAt).toBe('string');
    expect(Array.isArray(post.tags)).toBe(true);
    expect(post.author).toHaveProperty('name');
    expect(post.category).toHaveProperty('name');
  });

  it('should fetch and return properly structured guides', async () => {
    const service = createContentService();
    const guides = await service.getGuides(1);
    
    expect(guides).toHaveLength(1);
    
    const guide = guides[0];
    expect(guide.sys).toHaveProperty('id');
    expect(typeof guide.title).toBe('string');
    expect(typeof guide.slug).toBe('string');
    expect(typeof guide.description).toBe('string');
    expect(['beginner', 'intermediate', 'advanced']).toContain(guide.difficulty);
    expect(typeof guide.estimatedTime).toBe('number');
    expect(Array.isArray(guide.steps)).toBe(true);
    expect(Array.isArray(guide.tools)).toBe(true);
    expect(guide.category).toHaveProperty('name');
  });

  it('should fetch and return properly structured categories', async () => {
    const service = createContentService();
    const categories = await service.getCategories();
    
    expect(categories.length).toBeGreaterThan(0);
    
    const category = categories[0];
    expect(category.sys).toHaveProperty('id');
    expect(typeof category.name).toBe('string');
    expect(typeof category.slug).toBe('string');
    expect(typeof category.description).toBe('string');
    expect(typeof category.color).toBe('string');
    expect(category.color).toMatch(/^#[0-9A-F]{6}$/i); // Hex color format
  });

  it('should fetch and return properly structured FAQ entries', async () => {
    const service = createContentService();
    const faqs = await service.getFaqEntries();
    
    expect(faqs.length).toBeGreaterThan(0);
    
    const faq = faqs[0];
    expect(faq.sys).toHaveProperty('id');
    expect(typeof faq.question).toBe('string');
    expect(typeof faq.answer).toBe('string');
    expect(typeof faq.category).toBe('string');
    expect(typeof faq.order).toBe('number');
  });

  it('should maintain consistent data relationships', async () => {
    const service = createContentService();
    
    // Get a blog post and verify its relationships
    const post = await service.getBlogPost('advanced-core-web-vitals-optimization-astro');
    expect(post).toBeDefined();
    
    // Verify author relationship
    expect(post?.author.name).toBe('Alex Chen');
    expect(post?.author.slug).toBe('alex-chen');
    
    // Verify category relationship
    expect(post?.category.name).toBe('Performance');
    expect(post?.category.slug).toBe('performance');
    
    // Get the same category directly and verify consistency
    const category = await service.getCategory('performance');
    expect(category).toBeDefined();
    expect(category?.name).toBe(post?.category.name);
    expect(category?.slug).toBe(post?.category.slug);
  });
});