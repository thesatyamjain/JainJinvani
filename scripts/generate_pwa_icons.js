// Wrapper script to execute PowerShell icon generator on Windows or ensure icons exist
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const requiredIcons = [
  'pwa-192x192.png',
  'pwa-512x512.png',
  'pwa-maskable-192x192.png',
  'pwa-maskable-512x512.png',
  'apple-touch-icon.png'
];

const allExist = fs.existsSync(iconsDir) && requiredIcons.every(icon => fs.existsSync(path.join(iconsDir, icon)));

if (!allExist) {
  console.log('Generating missing PWA icons...');
  try {
    const psScript = path.join(__dirname, 'generate_pwa_icons.ps1');
    execSync(`powershell -ExecutionPolicy Bypass -File "${psScript}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to generate PWA icons with PowerShell:', err.message);
  }
} else {
  console.log('All PWA icons are present and verified.');
}
