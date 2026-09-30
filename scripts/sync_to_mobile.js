const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'build');
const destDir = path.resolve(__dirname, '..', 'mobile', 'assets', 'web');

console.log(`[sync_to_mobile] Syncing from ${srcDir} to ${destDir}...`);

if (!fs.existsSync(srcDir)) {
  console.error(`Error: build directory not found at ${srcDir}. Please run 'npm run build' first.`);
  process.exit(1);
}

if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}

fs.cpSync(srcDir, destDir, { recursive: true });

console.log(`[sync_to_mobile] Success! Mobile app assets updated with latest web build.`);
