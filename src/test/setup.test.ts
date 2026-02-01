import { describe, expect, test } from 'vitest';
import { propertyTestConfig } from './setup';

describe('Test Setup', () => {
  test('should have property test configuration', () => {
    expect(propertyTestConfig).toBeDefined();
    expect(propertyTestConfig.numRuns).toBe(100);
    expect(propertyTestConfig.timeout).toBe(5000);
    expect(propertyTestConfig.verbose).toBe(true);
  });

  test('should have global property test config', () => {
    expect(globalThis.propertyTestConfig).toBeDefined();
    expect(globalThis.propertyTestConfig.numRuns).toBe(100);
  });
});
