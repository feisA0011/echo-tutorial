const {
  loadLockfile,
  hasPackage,
  extractPackageVersion,
  validateLockfileStructure
} = require('./lockfile-parser');

describe('Lockfile Parser Utilities', () => {
  let lockfileContent;

  beforeAll(() => {
    lockfileContent = loadLockfile();
  });

  test('loads lockfile successfully', () => {
    expect(lockfileContent).toBeDefined();
    expect(typeof lockfileContent).toBe('string');
    expect(lockfileContent.length).toBeGreaterThan(0);
  });

  test('hasPackage detects existing packages', () => {
    expect(hasPackage(lockfileContent, '@clerk/nextjs')).toBe(true);
    expect(hasPackage(lockfileContent, 'react')).toBe(true);
  });

  test('hasPackage returns false for non-existent packages', () => {
    expect(hasPackage(lockfileContent, 'non-existent-xyz')).toBe(false);
  });

  test('extractPackageVersion works for Clerk', () => {
    const version = extractPackageVersion(lockfileContent, '@clerk/nextjs');
    expect(version).toBeTruthy();
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  test('extractPackageVersion returns null for missing package', () => {
    const version = extractPackageVersion(lockfileContent, 'non-existent-xyz');
    expect(version).toBeNull();
  });

  test('validateLockfileStructure confirms valid structure', () => {
    const validation = validateLockfileStructure(lockfileContent);
    expect(validation.isValid).toBe(true);
    expect(validation.sections.lockfileVersion).toBe(true);
    expect(validation.sections.importers).toBe(true);
    expect(validation.sections.packages).toBe(true);
  });
});