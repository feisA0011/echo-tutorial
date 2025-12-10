const fs = require('fs');
const path = require('path');

function loadLockfile() {
  const lockfilePath = path.join(__dirname, '../../pnpm-lock.yaml');
  return fs.readFileSync(lockfilePath, 'utf8');
}

function hasPackage(content, packageName) {
  return content.includes(packageName);
}

function extractPackageVersion(content, packageName) {
  const escapedName = packageName.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  const pattern = new RegExp(`${escapedName}.*?version:\\s*([\\d.]+)`, 's');
  const match = content.match(pattern);
  return match ? match[1] : null;
}

function validateLockfileStructure(content) {
  const requiredSections = ['lockfileVersion', 'importers', 'packages'];
  const results = {};
  
  requiredSections.forEach(section => {
    results[section] = content.includes(`${section}:`);
  });
  
  return {
    isValid: Object.values(results).every(v => v),
    sections: results
  };
}

module.exports = {
  loadLockfile,
  hasPackage,
  extractPackageVersion,
  validateLockfileStructure
};