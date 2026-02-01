// Test setup configuration
import { beforeEach } from 'vitest';

// Property test configuration
export const propertyTestConfig = {
  numRuns: 100, // Minimum 100 iterations per property test
  timeout: 5000,
  verbose: true,
};

// Reset environment before each test
beforeEach(() => {
  // Reset any global state if needed
});

// Global test utilities
declare global {
  // biome-ignore lint/suspicious/noRedeclare: Global type augmentation
  // biome-ignore lint/style/noVar: Required for global declaration
  var propertyTestConfig: typeof import('./setup').propertyTestConfig;
}

// biome-ignore lint/suspicious/noExplicitAny: Required for global assignment
(globalThis as any).propertyTestConfig = propertyTestConfig;
