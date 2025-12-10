const fs = require('fs');
const path = require('path');

describe('Clerk Integration Preparation', () => {
  test('lockfile includes Clerk dependencies', () => {
    const lockfilePath = path.join(__dirname, '../../../pnpm-lock.yaml');
    const lockfile = fs.readFileSync(lockfilePath, 'utf8');
    expect(lockfile).toMatch(/@clerk\/nextjs/);
  });

  test('web app package.json is readable', () => {
    const packagePath = path.join(__dirname, '../../../apps/web/package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    expect(packageJson).toHaveProperty('name');
    expect(packageJson.name).toBe('web');
  });
});