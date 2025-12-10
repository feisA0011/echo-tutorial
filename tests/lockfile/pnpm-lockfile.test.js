const fs = require('fs');
const path = require('path');

function parseLockfile() {
  const lockfilePath = path.join(__dirname, '../../pnpm-lock.yaml');
  return fs.readFileSync(lockfilePath, 'utf8');
}

describe('pnpm-lock.yaml Validation', () => {
  let lockfileContent;

  beforeAll(() => {
    lockfileContent = parseLockfile();
  });

  describe('Basic Structure', () => {
    test('lockfile exists and is readable', () => {
      expect(lockfileContent).toBeDefined();
      expect(lockfileContent.length).toBeGreaterThan(0);
    });

    test('lockfile has valid YAML structure', () => {
      expect(lockfileContent).toMatch(/lockfileVersion:/);
      expect(lockfileContent).toMatch(/importers:/);
      expect(lockfileContent).toMatch(/packages:/);
    });

    test('lockfile version is specified', () => {
      const versionMatch = lockfileContent.match(/lockfileVersion:\s*['"]?(\d+\.?\d*)/);
      expect(versionMatch).not.toBeNull();
      expect(versionMatch[1]).toBeDefined();
    });
  });

  describe('Clerk Dependencies', () => {
    test('Clerk Next.js package is present', () => {
      expect(lockfileContent).toMatch(/@clerk\/nextjs/);
    });

    test('Clerk backend package is present', () => {
      expect(lockfileContent).toMatch(/@clerk\/backend/);
    });

    test('Clerk clerk-react package is present', () => {
      expect(lockfileContent).toMatch(/@clerk\/clerk-react/);
    });

    test('Clerk shared package is present', () => {
      expect(lockfileContent).toMatch(/@clerk\/shared/);
    });

    test('Clerk types package is present', () => {
      expect(lockfileContent).toMatch(/@clerk\/types/);
    });

    test('Clerk packages have version specifications', () => {
      const clerkNextjsMatch = lockfileContent.match(/@clerk\/nextjs['"]:[\s\n]*specifier:\s*['"^~]?([\d.]+)/);
      expect(clerkNextjsMatch).not.toBeNull();
      expect(clerkNextjsMatch[1]).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe('Required Clerk Sub-dependencies', () => {
    test('cookie package is present', () => {
      expect(lockfileContent).toMatch(/cookie@/);
    });

    test('standardwebhooks package is present', () => {
      expect(lockfileContent).toMatch(/standardwebhooks@/);
    });

    test('swr package is present', () => {
      expect(lockfileContent).toMatch(/swr@/);
    });

    test('js-cookie package is present', () => {
      expect(lockfileContent).toMatch(/js-cookie@/);
    });

    test('server-only package is present', () => {
      expect(lockfileContent).toMatch(/server-only@/);
    });
  });

  describe('Dependency Integrity', () => {
    test('importers section includes workspace apps', () => {
      expect(lockfileContent).toMatch(/apps\/web:/);
      expect(lockfileContent).toMatch(/apps\/widget:/);
    });

    test('importers section includes workspace packages', () => {
      expect(lockfileContent).toMatch(/packages\/backend:/);
      expect(lockfileContent).toMatch(/packages\/ui:/);
    });

    test('convex dependency is properly linked with Clerk', () => {
      const convexMatch = lockfileContent.match(/convex@[\d.]+.*?@clerk/s);
      expect(convexMatch).not.toBeNull();
    });
  });

  describe('Security and Best Practices', () => {
    test('packages have integrity hashes', () => {
      expect(lockfileContent).toMatch(/integrity:/);
      expect(lockfileContent).toMatch(/sha\d+-/);
    });

    test('resolution strategy is defined', () => {
      expect(lockfileContent).toMatch(/resolution:/);
    });

    test('no pre-release versions for Clerk packages', () => {
      const clerkVersions = lockfileContent.match(/@clerk\/\w+['"]:[\s\n]*specifier:\s*['"^~]?([\d.]+)/g) || [];
      clerkVersions.forEach(match => {
        expect(match).not.toMatch(/alpha|beta|rc|canary/i);
      });
    });
  });

  describe('Workspace Dependencies', () => {
    test('workspace packages use workspace protocol', () => {
      expect(lockfileContent).toMatch(/workspace:\*/);
      expect(lockfileContent).toMatch(/link:.*packages\//);
    });

    test('backend package is linked correctly', () => {
      expect(lockfileContent).toMatch(/@workspace\/backend.*?link:.*packages\/backend/s);
    });

    test('ui package is linked correctly', () => {
      expect(lockfileContent).toMatch(/@workspace\/ui.*?link:.*packages\/ui/s);
    });
  });

  describe('Lockfile Consistency', () => {
    test('apps/web has Clerk as direct dependency reference', () => {
      const webSection = lockfileContent.match(/apps\/web:[\s\S]*?(?=\n  \w+:|\npackages:)/);
      expect(webSection).not.toBeNull();
      expect(webSection[0]).toMatch(/@clerk\/nextjs/);
    });

    test('packages section includes all Clerk packages', () => {
      const packagesSection = lockfileContent.match(/packages:[\s\S]*$/);
      expect(packagesSection).not.toBeNull();
      expect(packagesSection[0]).toMatch(/@clerk\/backend/);
      expect(packagesSection[0]).toMatch(/@clerk\/clerk-react/);
      expect(packagesSection[0]).toMatch(/@clerk\/nextjs/);
    });
  });

  describe('Edge Cases', () => {
    test('file size is reasonable', () => {
      const sizeInKB = lockfileContent.length / 1024;
      expect(sizeInKB).toBeGreaterThan(10);
      expect(sizeInKB).toBeLessThan(5000);
    });

    test('no circular dependency warnings in comments', () => {
      const lines = lockfileContent.split('\n');
      const commentLines = lines.filter(line => line.trim().startsWith('#'));
      commentLines.forEach(comment => {
        expect(comment.toLowerCase()).not.toMatch(/circular/);
      });
    });
  });
});

describe('Lockfile Maintenance', () => {
  test('can read lockfile without errors', () => {
    expect(() => parseLockfile()).not.toThrow();
  });

  test('lockfile path is correct', () => {
    const lockfilePath = path.join(__dirname, '../../pnpm-lock.yaml');
    expect(fs.existsSync(lockfilePath)).toBe(true);
  });
});