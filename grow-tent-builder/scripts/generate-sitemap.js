import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/components/Blog/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://growwizard.com';

const staticRoutes = [
    '/',
    '/builder',
    '/tools',
    '/tools/cost-calculator',
    '/tools/unit-converter',
    '/tools/co2-calculator',
    '/blog',
    '/faq'
];

const generateSitemap = () => {
    const routes = [...staticRoutes];

    // Add blog posts for both languages
    blogPosts.forEach(post => {
        routes.push(`/blog/${post.slug.en}`);
        routes.push(`/blog/${post.slug.tr}`);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
            .map(route => {
                return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
            })
            .join('')}
</urlset>`;

    const publicDir = path.join(__dirname, '../public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');
};

generateSitemap();
