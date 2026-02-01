#!/usr/bin/env node

import { existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Build validation script for Vercel deployment
 * Validates build output and ensures all required files are present
 */

const DIST_DIR = '.vercel/output/static';
const FUNCTIONS_DIR = '.vercel/output/functions';
const REQUIRED_FILES = [
  'index.html',
  'sitemap-index.xml',
  'sitemap-blog.xml',
  'sitemap-guides.xml',
  'sitemap-pages.xml',
];

const REQUIRED_DIRECTORIES = ['_astro', 'blog', 'guides', 'category'];

function validateBuildOutput() {
  console.log('🔍 Validating build output...');

  // Check if dist directory exists
  if (!existsSync(DIST_DIR)) {
    console.error('❌ Build failed: dist directory not found');
    process.exit(1);
  }

  console.log('✅ Build directory exists');

  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = join(DIST_DIR, file);
    if (!existsSync(filePath)) {
      console.error(`❌ Build validation failed: ${file} not found`);
      process.exit(1);
    }

    // Check file size (should not be empty)
    const stats = statSync(filePath);
    if (stats.size === 0) {
      console.error(`❌ Build validation failed: ${file} is empty`);
      process.exit(1);
    }

    console.log(`✅ ${file} exists (${stats.size} bytes)`);
  }

  // Check required directories
  for (const dir of REQUIRED_DIRECTORIES) {
    const dirPath = join(DIST_DIR, dir);
    if (!existsSync(dirPath)) {
      console.error(`❌ Build validation failed: ${dir} directory not found`);
      process.exit(1);
    }
    console.log(`✅ ${dir} directory exists`);
  }

  // Check for serverless functions
  if (existsSync(FUNCTIONS_DIR)) {
    const functions = readdirSync(FUNCTIONS_DIR);
    console.log(`✅ Serverless functions generated: ${functions.length} functions`);
    functions.forEach((fn) => console.log(`  - ${fn}`));
  } else {
    console.log('ℹ️  No serverless functions directory found (static build)');
  }

  // Validate static assets
  const astroDir = join(DIST_DIR, '_astro');
  if (existsSync(astroDir)) {
    const assets = readdirSync(astroDir);
    const cssFiles = assets.filter((file) => file.endsWith('.css'));
    const jsFiles = assets.filter((file) => file.endsWith('.js'));

    console.log(`✅ Static assets: ${cssFiles.length} CSS, ${jsFiles.length} JS files`);

    // Check for critical CSS
    if (cssFiles.length === 0) {
      console.warn('⚠️  Warning: No CSS files found in build output');
    }
  }

  console.log('🎉 Build validation completed successfully!');
}

function validateEnvironment() {
  console.log('🔍 Validating environment configuration...');

  const requiredForProduction = [
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_DELIVERY_TOKEN',
    'CONTENTFUL_PREVIEW_TOKEN',
    'SITE_URL',
  ];

  const isProduction = process.env.NODE_ENV === 'production';
  const missingVars = [];

  for (const varName of requiredForProduction) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    if (isProduction) {
      console.error('❌ Production build missing required environment variables:');
      missingVars.forEach((varName) => console.error(`  - ${varName}`));
      console.error('Build will use mock data fallback');
    } else {
      console.log('ℹ️  Development build - using mock data for missing variables:');
      missingVars.forEach((varName) => console.log(`  - ${varName}`));
    }
  } else {
    console.log('✅ All environment variables configured');
  }

  // Validate SITE_URL format
  const siteUrl = process.env.SITE_URL;
  if (siteUrl && !siteUrl.startsWith('http')) {
    console.error('❌ SITE_URL must start with http:// or https://');
    process.exit(1);
  }

  if (siteUrl) {
    console.log(`✅ Site URL: ${siteUrl}`);
  }
}

function main() {
  try {
    validateEnvironment();
    validateBuildOutput();
  } catch (error) {
    console.error('❌ Build validation failed:', error.message);
    process.exit(1);
  }
}

main();
