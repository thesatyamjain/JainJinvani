const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Ensure mobile icons are generated
const androidIcon = path.resolve(__dirname, '..', 'mobile', 'android', 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher.png');
if (!fs.existsSync(androidIcon) || process.platform === 'win32') {
  try {
    const iconScript = path.resolve(__dirname, 'generate_mobile_icons.ps1');
    if (fs.existsSync(iconScript) && process.platform === 'win32') {
      console.log(`[sync_to_mobile] Generating mobile launcher icons...`);
      execSync(`powershell -ExecutionPolicy Bypass -File "${iconScript}"`, { stdio: 'inherit' });
    }
  } catch (err) {
    console.warn(`[sync_to_mobile] Warning: Could not regenerate mobile icons: ${err.message}`);
  }
}
