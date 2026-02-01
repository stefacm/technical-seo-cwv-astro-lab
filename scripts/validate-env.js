#!/usr/bin/env node

/**
 * Environment validation script
 * Validates environment variables and configuration before build
 */

const REQUIRED_PRODUCTION_VARS = [
  'CONTENTFUL_SPACE_ID',
  'CONTENTFUL_DELIVERY_TOKEN',
  'CONTENTFUL_PREVIEW_TOKEN',
  'SITE_URL',
];

const OPTIONAL_VARS = ['CONTENTFUL_PREVIEW_SECRET', 'CONTENTFUL_ENVIRONMENT'];

function validateEnvironmentVariables() {
  console.log('🔍 Validating environment variables...');

  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const missingRequired = [];
  const presentOptional = [];

  // Check required variables
  for (const varName of REQUIRED_PRODUCTION_VARS) {
    if (!process.env[varName]) {
      missingRequired.push(varName);
    } else {
      console.log(`✅ ${varName} is configured`);
    }
  }

  // Check optional variables
  for (const varName of OPTIONAL_VARS) {
    if (process.env[varName]) {
      presentOptional.push(varName);
      console.log(`✅ ${varName} is configured (optional)`);
    }
  }

  // Handle missing required variables
  if (missingRequired.length > 0) {
    if (isProduction) {
      console.error('❌ Production build missing required environment variables:');
      missingRequired.forEach((varName) => {
        console.error(`  - ${varName}`);
      });
      console.error('');
      console.error('Production builds require all Contentful credentials.');
      console.error('The build will continue but may fail at runtime.');
      console.error('');
    } else {
      console.log('ℹ️  Development mode - missing variables will use mock data:');
      missingRequired.forEach((varName) => {
        console.log(`  - ${varName} (will use mock data)`);
      });
      console.log('');
      console.log('This is expected in development. Mock data will be used.');
      console.log('');
    }
  }

  return {
    isValid: isProduction ? missingRequired.length === 0 : true,
    missingRequired,
    presentOptional,
    mode: isProduction ? 'production' : isDevelopment ? 'development' : 'unknown',
  };
}

function validateSiteUrl() {
  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    console.warn('⚠️  SITE_URL not configured, using fallback');
    return false;
  }

  try {
    const url = new URL(siteUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }
    console.log(`✅ SITE_URL is valid: ${siteUrl}`);
    return true;
  } catch (error) {
    console.error(`❌ SITE_URL is invalid: ${siteUrl}`);
    console.error('   Must be a valid URL starting with http:// or https://');
    return false;
  }
}

function validateContentfulConfig() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

  if (!spaceId || !deliveryToken || !previewToken) {
    console.log('ℹ️  Contentful not fully configured - using mock data');
    return false;
  }

  // Basic format validation
  if (spaceId.length < 10) {
    console.error('❌ CONTENTFUL_SPACE_ID appears to be invalid (too short)');
    return false;
  }

  if (deliveryToken.length < 40) {
    console.error('❌ CONTENTFUL_DELIVERY_TOKEN appears to be invalid (too short)');
    return false;
  }

  if (previewToken.length < 40) {
    console.error('❌ CONTENTFUL_PREVIEW_TOKEN appears to be invalid (too short)');
    return false;
  }

  console.log('✅ Contentful configuration appears valid');
  return true;
}

function generateBuildReport(validation) {
  console.log('');
  console.log('📋 Build Configuration Report');
  console.log('================================');
  console.log(`Mode: ${validation.mode}`);
  console.log(`Environment valid: ${validation.isValid ? 'Yes' : 'No'}`);
  console.log(`Missing required vars: ${validation.missingRequired.length}`);
  console.log(`Optional vars present: ${validation.presentOptional.length}`);

  if (validation.missingRequired.length > 0) {
    console.log('');
    console.log('Missing required variables:');
    validation.missingRequired.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
  }

  if (validation.presentOptional.length > 0) {
    console.log('');
    console.log('Optional variables configured:');
    validation.presentOptional.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
  }

  console.log('');
}

function main() {
  try {
    console.log('🚀 Starting environment validation...');
    console.log('');

    const validation = validateEnvironmentVariables();
    const siteUrlValid = validateSiteUrl();
    const contentfulValid = validateContentfulConfig();

    generateBuildReport(validation);

    if (process.env.NODE_ENV === 'production' && !validation.isValid) {
      console.error('❌ Environment validation failed for production build');
      console.error('   Build will continue but may fail at runtime');
      console.error('   Please configure all required environment variables');
      // Don't exit with error code to allow build to continue with warnings
    } else {
      console.log('✅ Environment validation completed');
    }
  } catch (error) {
    console.error('❌ Environment validation error:', error.message);
    process.exit(1);
  }
}

main();
