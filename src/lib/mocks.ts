import type {
  Author,
  BlogPost,
  Category,
  ContentFetcher,
  ContentfulAsset,
  FaqEntry,
  Guide,
  GuideStep,
} from './contentful.js';

// Mock Contentful assets
export const mockAssets: ContentfulAsset[] = [
  {
    sys: {
      id: 'mock-asset-hero',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    fields: {
      title: 'Hero Image - Core Web Vitals',
      description: 'Hero image showcasing Core Web Vitals optimization',
      file: {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        details: {
          size: 245760,
          image: {
            width: 1200,
            height: 600,
          },
        },
        fileName: 'hero-cwv.jpg',
        contentType: 'image/jpeg',
      },
    },
  },
  {
    sys: {
      id: 'mock-asset-seo',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    fields: {
      title: 'SEO Optimization Guide',
      description: 'Technical SEO optimization illustration',
      file: {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        details: {
          size: 163840,
          image: {
            width: 800,
            height: 400,
          },
        },
        fileName: 'seo-guide.jpg',
        contentType: 'image/jpeg',
      },
    },
  },
  {
    sys: {
      id: 'mock-asset-performance',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    fields: {
      title: 'Performance Optimization',
      description: 'Web performance optimization techniques',
      file: {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        details: {
          size: 163840,
          image: {
            width: 800,
            height: 400,
          },
        },
        fileName: 'performance.jpg',
        contentType: 'image/jpeg',
      },
    },
  },
  {
    sys: {
      id: 'mock-asset-author-avatar',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    fields: {
      title: 'Author Avatar',
      description: 'Professional author avatar',
      file: {
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        details: {
          size: 12288,
          image: {
            width: 150,
            height: 150,
          },
        },
        fileName: 'author-avatar.jpg',
        contentType: 'image/jpeg',
      },
    },
  },
];

// Mock authors
export const mockAuthors: Author[] = [
  {
    sys: {
      id: 'mock-author-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    name: 'Alex Chen',
    slug: 'alex-chen',
    bio: 'Senior Frontend Engineer specializing in performance optimization and technical SEO. 8+ years of experience building high-performance web applications.',
    avatar: mockAssets[3],
    socialLinks: {
      twitter: 'https://twitter.com/alexchen',
      linkedin: 'https://linkedin.com/in/alexchen',
      github: 'https://github.com/alexchen',
    },
  },
  {
    sys: {
      id: 'mock-author-2',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    bio: 'Technical SEO consultant and Core Web Vitals expert. Helps companies achieve top search rankings through technical optimization.',
    socialLinks: {
      twitter: 'https://twitter.com/sarahjohnson',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
    },
  },
];

// Mock categories
export const mockCategories: Category[] = [
  {
    sys: {
      id: 'mock-category-performance',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    name: 'Performance',
    slug: 'performance',
    description:
      'Web performance optimization techniques, Core Web Vitals, and speed improvements.',
    featuredImage: mockAssets[2],
    color: '#10B981',
  },
  {
    sys: {
      id: 'mock-category-seo',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    name: 'Technical SEO',
    slug: 'technical-seo',
    description:
      'Advanced technical SEO strategies, structured data, and search engine optimization.',
    featuredImage: mockAssets[1],
    color: '#3B82F6',
  },
  {
    sys: {
      id: 'mock-category-astro',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    name: 'Astro Framework',
    slug: 'astro-framework',
    description: 'Astro framework tutorials, best practices, and advanced techniques.',
    color: '#8B5CF6',
  },
];

// Mock guide steps
const mockGuideSteps: GuideStep[] = [
  {
    title: 'Install and Configure Astro',
    content:
      'Start by creating a new Astro project with TypeScript support and configure the basic settings.',
    image: mockAssets[0],
  },
  {
    title: 'Set Up Contentful Integration',
    content:
      'Configure Contentful client with proper environment variables and create typed interfaces.',
  },
  {
    title: 'Implement SEO Components',
    content: 'Create reusable SEO components for meta tags, structured data, and canonical URLs.',
  },
  {
    title: 'Optimize Core Web Vitals',
    content: 'Apply performance optimizations for LCP, CLS, and FID metrics.',
  },
];

// Mock blog posts
export const mockBlogPosts: BlogPost[] = [
  {
    sys: {
      id: 'mock-blog-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    title: 'Advanced Core Web Vitals Optimization with Astro',
    slug: 'advanced-core-web-vitals-optimization-astro',
    excerpt:
      'Learn advanced techniques for optimizing Core Web Vitals in Astro applications, including selective hydration, image optimization, and layout stability.',
    content: `# Advanced Core Web Vitals Optimization with Astro

Core Web Vitals are essential metrics that measure user experience on your website. In this comprehensive guide, we'll explore advanced optimization techniques specifically for Astro applications.

## Understanding Core Web Vitals

The three main Core Web Vitals metrics are:

1. **Largest Contentful Paint (LCP)** - Measures loading performance
2. **Cumulative Layout Shift (CLS)** - Measures visual stability  
3. **First Input Delay (FID)** - Measures interactivity

## Astro-Specific Optimizations

### Selective Hydration

Astro's Islands Architecture allows you to selectively hydrate components:

\`\`\`astro
<!-- Only hydrate when visible -->
<InteractiveComponent client:visible />

<!-- Hydrate when idle -->
<SearchComponent client:idle />
\`\`\`

### Image Optimization

Always specify dimensions to prevent layout shifts:

\`\`\`astro
<img 
  src="/hero.jpg" 
  alt="Hero image"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
/>
\`\`\`

## Measuring Results

Use Lighthouse and real user monitoring to track improvements in your Core Web Vitals scores.`,
    featuredImage: mockAssets[0],
    author: mockAuthors[0],
    category: mockCategories[0],
    tags: ['performance', 'core-web-vitals', 'astro', 'optimization'],
    publishedAt: '2024-01-15T10:00:00Z',
    seo: {
      title: 'Advanced Core Web Vitals Optimization with Astro - Complete Guide',
      description:
        'Master Core Web Vitals optimization in Astro with selective hydration, image optimization, and layout stability techniques.',
      ogImage: mockAssets[0],
    },
  },
  {
    sys: {
      id: 'mock-blog-2',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
    },
    title: 'Technical SEO Best Practices for Modern Web Apps',
    slug: 'technical-seo-best-practices-modern-web-apps',
    excerpt:
      'Comprehensive guide to implementing technical SEO in modern web applications, covering structured data, meta tags, and search engine optimization.',
    content: `# Technical SEO Best Practices for Modern Web Apps

Technical SEO is crucial for ensuring your modern web application ranks well in search engines. This guide covers essential practices for optimal SEO implementation.

## Meta Tags and Structured Data

### Essential Meta Tags

Every page should include these fundamental meta tags:

\`\`\`html
<title>Page Title - Site Name</title>
<meta name="description" content="Page description">
<link rel="canonical" href="https://example.com/page">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://example.com/image.jpg">
\`\`\`

### JSON-LD Structured Data

Implement structured data for better search engine understanding:

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2024-01-20"
}
\`\`\`

## Server-Side Rendering

Ensure all SEO elements are rendered server-side for proper indexing by search engines.`,
    featuredImage: mockAssets[1],
    author: mockAuthors[1],
    category: mockCategories[1],
    tags: ['seo', 'technical-seo', 'structured-data', 'meta-tags'],
    publishedAt: '2024-01-20T14:30:00Z',
  },
  {
    sys: {
      id: 'mock-blog-3',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z',
    },
    title: 'Building SEO-First Applications with Astro and Contentful',
    slug: 'building-seo-first-applications-astro-contentful',
    excerpt:
      "Learn how to build SEO-optimized applications using Astro's hybrid rendering with Contentful as a headless CMS for maximum search visibility.",
    content: `# Building SEO-First Applications with Astro and Contentful

Combining Astro's hybrid rendering capabilities with Contentful's headless CMS creates a powerful foundation for SEO-optimized applications.

## Architecture Overview

The SEO-first architecture includes:

- **Static Generation (SSG)** for indexable content
- **Server-Side Rendering (SSR)** for dynamic features
- **Contentful Integration** for content management
- **Mock Data Fallback** for development

## Implementation Strategy

### 1. Content Structure

Design your Contentful content types with SEO in mind:

- Include dedicated SEO fields
- Structure content for rich snippets
- Plan URL patterns carefully

### 2. Rendering Strategy

Choose the right rendering method:

- Use SSG for blog posts, guides, and static pages
- Use SSR for search, preview, and dynamic content
- Exclude non-indexable pages from sitemaps

### 3. Performance Optimization

Optimize for Core Web Vitals:

- Implement selective hydration
- Use proper image optimization
- Prevent layout shifts

## Best Practices

Follow these guidelines for optimal results:

1. Always render SEO tags server-side
2. Implement comprehensive structured data
3. Use absolute URLs in sitemaps
4. Include proper meta tags for social sharing`,
    featuredImage: mockAssets[2],
    author: mockAuthors[0],
    category: mockCategories[2],
    tags: ['astro', 'contentful', 'seo', 'headless-cms', 'hybrid-rendering'],
    publishedAt: '2024-01-25T09:15:00Z',
  },
];

// Mock guides
export const mockGuides: Guide[] = [
  {
    sys: {
      id: 'mock-guide-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
    },
    title: 'Complete Guide to Astro SEO Optimization',
    slug: 'complete-guide-astro-seo-optimization',
    description:
      'Step-by-step guide to implementing comprehensive SEO optimization in Astro applications, from basic setup to advanced techniques.',
    content: `# Complete Guide to Astro SEO Optimization

This comprehensive guide will walk you through implementing world-class SEO in your Astro applications.

## Prerequisites

- Basic knowledge of Astro framework
- Understanding of HTML and TypeScript
- Familiarity with SEO concepts

## What You'll Learn

By the end of this guide, you'll have:

- A fully optimized Astro application for SEO
- Comprehensive structured data implementation
- Perfect Core Web Vitals scores
- Production-ready deployment configuration

Let's get started!`,
    difficulty: 'intermediate',
    estimatedTime: 120,
    steps: mockGuideSteps,
    featuredImage: mockAssets[1],
    category: mockCategories[1],
    tools: ['Astro', 'TypeScript', 'Contentful', 'Vercel', 'Lighthouse'],
    publishedAt: '2024-01-10T08:00:00Z',
  },
  {
    sys: {
      id: 'mock-guide-2',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z',
    },
    title: 'Core Web Vitals Optimization Masterclass',
    slug: 'core-web-vitals-optimization-masterclass',
    description:
      'Master Core Web Vitals optimization with practical techniques for improving LCP, CLS, and FID in modern web applications.',
    content: `# Core Web Vitals Optimization Masterclass

Master the art of Core Web Vitals optimization with this hands-on guide covering all three essential metrics.

## Overview

Core Web Vitals are Google's standardized metrics for measuring user experience:

- **LCP (Largest Contentful Paint)** - Loading performance
- **CLS (Cumulative Layout Shift)** - Visual stability
- **FID (First Input Delay)** - Interactivity

## Optimization Strategies

We'll cover advanced optimization techniques including:

- Image optimization and lazy loading
- Critical resource prioritization
- Layout stability techniques
- JavaScript optimization
- Performance monitoring

This masterclass includes practical examples and real-world case studies.`,
    difficulty: 'advanced',
    estimatedTime: 180,
    steps: [
      {
        title: 'Analyze Current Performance',
        content: 'Use Lighthouse and PageSpeed Insights to establish baseline metrics.',
      },
      {
        title: 'Optimize Largest Contentful Paint',
        content: 'Implement image optimization, preloading, and critical resource prioritization.',
      },
      {
        title: 'Prevent Layout Shifts',
        content: 'Add proper dimensions, reserve space, and avoid dynamic content insertion.',
      },
      {
        title: 'Improve Interactivity',
        content: 'Optimize JavaScript execution and implement selective hydration.',
      },
    ],
    featuredImage: mockAssets[0],
    category: mockCategories[0],
    tools: ['Lighthouse', 'PageSpeed Insights', 'Chrome DevTools', 'WebPageTest'],
    publishedAt: '2024-01-12T11:30:00Z',
  },
];

// Mock FAQ entries
export const mockFaqEntries: FaqEntry[] = [
  {
    sys: {
      id: 'mock-faq-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    question: 'What are Core Web Vitals and why are they important?',
    answer:
      'Core Web Vitals are a set of real-world, user-centered metrics that quantify key aspects of user experience. They measure loading performance (LCP), interactivity (FID), and visual stability (CLS). These metrics are important because they directly impact user experience and are used by Google as ranking factors in search results.',
    category: 'Performance',
    order: 1,
  },
  {
    sys: {
      id: 'mock-faq-2',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    question: 'How does Astro help with SEO optimization?',
    answer:
      'Astro helps with SEO through its hybrid rendering approach, allowing you to use Static Site Generation (SSG) for indexable content and Server-Side Rendering (SSR) for dynamic features. This ensures fast loading times, server-side rendered meta tags, and optimal Core Web Vitals scores while maintaining flexibility for interactive features.',
    category: 'SEO',
    order: 2,
  },
  {
    sys: {
      id: 'mock-faq-3',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    question: 'What is structured data and how do I implement it?',
    answer:
      'Structured data is code that helps search engines understand your content better. It uses Schema.org vocabulary in JSON-LD format. Implement it by adding JSON-LD scripts to your page head with relevant schema types like BlogPosting, HowTo, or FAQPage. Always render structured data server-side for proper indexing.',
    category: 'SEO',
    order: 3,
  },
  {
    sys: {
      id: 'mock-faq-4',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    question: 'How do I prevent Cumulative Layout Shift (CLS)?',
    answer:
      'Prevent CLS by: 1) Always specifying dimensions for images and videos, 2) Reserving space for dynamic content, 3) Avoiding inserting content above existing content, 4) Using CSS transforms instead of changing layout properties, and 5) Preloading fonts to prevent font swap layout shifts.',
    category: 'Performance',
    order: 4,
  },
  {
    sys: {
      id: 'mock-faq-5',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    question: 'What is the difference between SSG and SSR in Astro?',
    answer:
      'SSG (Static Site Generation) pre-builds pages at build time, creating static HTML files that are served quickly from a CDN. SSR (Server-Side Rendering) generates pages on-demand when requested. Use SSG for indexable content like blog posts and guides, and SSR for dynamic features like search and preview pages that should not be indexed.',
    category: 'Astro',
    order: 5,
  },
];

// Mock service implementation
export class MockContentfulService implements ContentFetcher {
  async getBlogPost(slug: string, _preview = false): Promise<BlogPost | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const post = mockBlogPosts.find((post) => post.slug === slug);
    return post || null;
  }

  async getBlogPosts(limit = 10, _preview = false): Promise<BlogPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return mockBlogPosts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getGuide(slug: string, _preview = false): Promise<Guide | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const guide = mockGuides.find((guide) => guide.slug === slug);
    return guide || null;
  }

  async getGuides(limit = 10, _preview = false): Promise<Guide[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return mockGuides
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getCategory(slug: string, _preview = false): Promise<Category | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const category = mockCategories.find((cat) => cat.slug === slug);
    return category || null;
  }

  async getCategories(_preview = false): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return [...mockCategories].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getFaqEntries(_preview = false): Promise<FaqEntry[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return [...mockFaqEntries].sort((a, b) => a.order - b.order);
  }
}

// Factory function to create the appropriate content service
export function createContentService(): ContentFetcher {
  // Try to create real Contentful service first
  const contentfulService = createContentfulService();

  if (contentfulService) {
    return contentfulService;
  }

  // Fallback to mock service in development or when credentials are missing
  console.log('Using mock data - Contentful credentials not found');
  return new MockContentfulService();
}

// Import the real service factory
import { createContentfulService } from './contentful.js';
