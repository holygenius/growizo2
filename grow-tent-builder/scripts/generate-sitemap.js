import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase client - only create if credentials are available
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseCredentials = supabaseUrl && supabaseKey;
const supabase = hasSupabaseCredentials ? createClient(supabaseUrl, supabaseKey) : null;

const BASE_URL = 'https://growizard.app';
const LANGUAGES = ['en', 'tr'];

const STATIC_ROUTES = [
    '', // Home
    '/builder',
    '/tools',
    '/tools/electricity-cost-calculator',
    '/tools/unit-converter',
    '/tools/co2-calculator',
    '/tools/ppfd-heatmap',
    '/blog',
    '/faq'
];

const generateSitemap = async () => {
    // Skip sitemap generation if Supabase credentials are not available
    // This preserves the existing sitemap.xml with blog posts in CI environments
    if (!supabase) {
        console.log('Supabase credentials not available. Skipping sitemap generation (using existing sitemap.xml).');
        return;
    }

    let blogPosts = [];
    const { data, error } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('is_published', true);
    
    if (error) {
        console.error('Error fetching blog posts:', error.message);
        // Continue with empty blogPosts array - sitemap will have static routes only
    } else {
        blogPosts = data || [];
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static routes
    LANGUAGES.forEach(lang => {
        STATIC_ROUTES.forEach(route => {
            const url = `${BASE_URL}/${lang}${route}`;
            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        });
    });

    // Add blog posts
    blogPosts.forEach(post => {
        LANGUAGES.forEach(lang => {
            if (post.slug && post.slug[lang]) {
                const url = `${BASE_URL}/${lang}/blog/${post.slug[lang]}`;
                xml += '  <url>\n';
                xml += `    <loc>${url}</loc>\n`;
                xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
                xml += '    <changefreq>weekly</changefreq>\n';
                xml += '    <priority>0.8</priority>\n';
                xml += '  </url>\n';
            }
        });
    });

    xml += '</urlset>';

    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap generated at ${outputPath}`);
    console.log(`  - Static routes: ${STATIC_ROUTES.length * LANGUAGES.length}`);
    console.log(`  - Blog posts: ${blogPosts.length * LANGUAGES.length}`);
};

generateSitemap();
