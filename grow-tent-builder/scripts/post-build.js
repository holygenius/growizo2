import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');

// Copy index.html to 404.html for GitHub Pages SPA support
// This ensures that when GitHub Pages serves a 404, it serves the full app
// instead of just a redirect script
try {
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('✅ Copied index.html to 404.html for GitHub Pages SPA support');
  } else {
    console.error('❌ index.html not found in dist directory');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error copying index.html to 404.html:', error);
  process.exit(1);
}
