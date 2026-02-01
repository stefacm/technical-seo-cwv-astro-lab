# Technical SEO CWV Astro Lab

A production-grade demonstration project showcasing advanced technical SEO and Core Web Vitals optimization using Astro's hybrid rendering capabilities with Contentful as a headless CMS.

## Quick Start

### Prerequisites

- Node.js LTS (18+)
- pnpm package manager

### Installation

```bash
pnpm install
```

### Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. **For development**: The project works without Contentful credentials using mock data
3. **For production**: Fill in your Contentful credentials in `.env`

### Development

```bash
pnpm run dev
```

The site will be available at `http://localhost:4321`

### Build

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run preview
```

## Code Quality

### Linting and Formatting

```bash
# Check code quality
pnpm run lint

# Auto-fix formatting issues
pnpm run format

# Type checking
pnpm run check
```

### Testing

```bash
# Run all tests
pnpm run test

# Run unit tests only
pnpm run test:unit

# Run property-based tests only
pnpm run test:pbt

# Run tests in watch mode
pnpm run test:watch
```

## Architecture

This project demonstrates:

- **SEO-First Architecture**: Server-side rendered meta tags and structured data
- **Core Web Vitals Optimization**: LCP, CLS, and FID optimization
- **Hybrid Rendering**: SSG for content, SSR for dynamic features
- **SOLID Principles**: Clean, maintainable architecture
- **Property-Based Testing**: Comprehensive correctness validation

## Deployment

The project is configured for Vercel deployment with the `@astrojs/vercel` adapter.

## Mock Mode vs Real Contentful

- **Mock Mode**: Works without Contentful credentials for development
- **Real Mode**: Connects to Contentful when credentials are provided

The system automatically detects and switches between modes based on environment variable availability.