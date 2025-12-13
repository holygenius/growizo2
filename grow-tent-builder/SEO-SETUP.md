# SEO Setup for GroWizard

This document explains the SEO configuration for the GroWizard web application.

## Problem Statement

Google Search Console was reporting 404 errors when crawling language-specific routes like `www.growizard.app/tr`, even though these pages work correctly in browsers. This was tied to GitHub Pages' SPA limitations and is now addressed with a different hosting approach.

## Hosting Update

The app is no longer deployed on GitHub Pages. Production deploys now run on Netlify using the repo workflow. Netlify’s SPA-aware rewrites (see `netlify.toml`) route all paths to `index.html` with a 200 status. The GitHub Pages-specific 404 copy step has been removed.

## Root Cause

The original `404.html` file contained only a minimal redirect script with "Redirecting..." text. When Google's crawler accessed routes like `/tr`:

1. GitHub Pages returned an HTTP 404 status code
2. Served the minimal `404.html` with just redirect script
3. Google's crawler saw the 404 status before JavaScript executed
4. The page was marked as "Not Found" in Google Search Console

## Solution Implemented

### 1. SPA rewrites on the hosting provider

**Files**:
- `netlify.toml`: Redirects all routes to `/index.html` with HTTP 200
- `vercel.json`: Rewrites `/(.*)` to `/index.html` (kept for local parity; production uses Netlify)

These platform-level rewrites serve the full React app for any route without returning a 404. The old GitHub Pages workflow and the post-build `404.html` copy have been removed from the build.

### 2. SEO Meta Tags

**Files Modified**:
- `src/App.jsx`: Added base Open Graph and Twitter Card meta tags
- `src/components/LandingPage.jsx`: Added language-specific canonical URLs and hreflang tags

**Meta Tags Added**:
- Canonical URLs pointing to the correct page URL
- hreflang tags for English (`en`) and Turkish (`tr`) versions
- Open Graph tags for social media sharing
- Twitter Card tags
- Language-specific locale tags

### 3. URL Consistency

**Files Modified**:
- `public/robots.txt`: Updated sitemap URL to use `www.growizard.app`
- `public/sitemap.xml`: All URLs now use `www.growizard.app` (instead of `growizard.app`)
- `scripts/generate-sitemap.js`: Base URL updated to `https://www.growizard.app`

## How It Works

When a crawler (or user) requests `https://www.growizard.app/tr`:

1. **Hosting layer**: Rewrites any route to `index.html` and returns HTTP 200
2. **JavaScript**: React app loads and initializes
3. **Routing**: React Router routes to the Turkish landing page
4. **Rendering**: Page renders with proper content and SEO meta tags
5. **Indexing**: Google can index the rendered content

## Testing Instructions

### 1. Google Search Console

After deployment, request indexing for key pages:
- `https://www.growizard.app/en`
- `https://www.growizard.app/tr`
- `https://www.growizard.app/en/builder`
- `https://www.growizard.app/tr/olusturucu`

### 2. Google Mobile-Friendly Test

Test pages at: https://search.google.com/test/mobile-friendly

Enter URLs and verify:
- ✓ Page is mobile-friendly
- ✓ Content is visible
- ✓ No 404 errors shown

### 3. Google Rich Results Test

Test at: https://search.google.com/test/rich-results

Verify:
- ✓ Meta tags are detected
- ✓ Open Graph tags are present
- ✓ No errors or warnings

### 4. Manual Verification

Visit the pages in a browser and check:
- ✓ Pages load correctly
- ✓ Content is in the correct language
- ✓ Meta tags are present (view page source)

## Limitations

### Routing Considerations

- Keep the SPA rewrites in `netlify.toml` (and `vercel.json` if used locally) aligned with production hosting.
- If a different platform is used later, ensure it serves `index.html` for all unknown routes with HTTP 200.
- Pre-rendering remains an option for critical pages if needed.

## Future Improvements

1. **Pre-rendering**: Consider using a pre-rendering service like Prerender.io or generating static HTML for critical pages
2. **Server-Side Rendering (SSR)**: Migrate to Next.js or similar framework for true SSR
3. **Structured Data**: Add JSON-LD structured data for rich snippets
4. **Performance**: Implement code splitting to reduce initial bundle size

## Maintenance

### Updating Sitemap

The sitemap is generated during build via `npm run sitemap`. To regenerate manually:

```bash
cd grow-tent-builder
npm run sitemap
```

**Note**: If Supabase credentials are not available, the script preserves the existing `public/sitemap.xml` file.

### Adding New Routes

When adding new routes:

1. Add them to the sitemap generation script (`scripts/generate-sitemap.js`)
2. If language-specific, add translations to `ROUTE_TRANSLATIONS`
3. Add to `STATIC_ROUTES` array
4. Rebuild and deploy

### Monitoring

Regularly check:
- Google Search Console for crawl errors
- Page indexing status
- Mobile usability issues
- Core Web Vitals

## References

- [GitHub Pages SPA Setup](https://github.com/rafgraph/spa-github-pages)
- [Google's JavaScript SEO Guide](https://developers.google.com/search/docs/advanced/javascript/javascript-seo-basics)
- [hreflang Tags](https://developers.google.com/search/docs/advanced/crawling/localized-versions)
- [Open Graph Protocol](https://ogp.me/)
