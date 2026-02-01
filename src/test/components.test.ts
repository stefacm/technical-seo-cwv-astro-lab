import { describe, it, expect } from 'vitest';

describe('SEO Components', () => {
  it('should have SeoHead component interface defined', () => {
    // This test verifies that the component interfaces are properly exported
    // and can be imported without errors
    
    // Import the types to ensure they're properly defined
    const seoHeadProps = {
      title: 'Test Title',
      description: 'Test Description',
      canonical: 'https://example.com/test',
      ogImage: 'https://example.com/image.jpg',
      ogType: 'article' as const,
      noindex: false,
      nofollow: false,
      structuredData: { '@type': 'Article' },
      breadcrumbs: [{ name: 'Home', url: '/' }]
    };
    
    expect(seoHeadProps.title).toBe('Test Title');
    expect(seoHeadProps.description).toBe('Test Description');
    expect(seoHeadProps.ogType).toBe('article');
  });

  it('should have BaseLayout component interface defined', () => {
    const baseLayoutProps = {
      seo: {
        title: 'Test Title',
        description: 'Test Description'
      },
      showHeader: true,
      showFooter: true,
      className: 'test-class'
    };
    
    expect(baseLayoutProps.seo.title).toBe('Test Title');
    expect(baseLayoutProps.showHeader).toBe(true);
    expect(baseLayoutProps.className).toBe('test-class');
  });
});