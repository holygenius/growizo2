# SEO Setup for GroWizard

This document explains the SEO configuration for the GroWizard web application.

## Problem Statement

Google Search Console was reporting 404 errors when crawling language-specific routes like `www.growizard.app/tr`, even though these pages work correctly in browsers. This is a common issue with Single Page Applications (SPAs) deployed on GitHub Pages.

## Root Cause

The original `404.html` file contained only a minimal redirect script with "Redirecting..." text. When Google's crawler accessed routes like `/tr`:

1. GitHub Pages returned an HTTP 404 status code
2. Served the minimal `404.html` with just redirect script
3. Google's crawler saw the 404 status before JavaScript executed
4. The page was marked as "Not Found" in Google Search Console

## Solution Implemented

### 1. Full App in 404.html

**File**: `scripts/post-build.js`

A post-build script now copies `index.html` to `404.html`, ensuring that the full React application loads even when GitHub Pages returns a 404 status. This allows:

- The React app to load completely
- React Router to handle the routing client-side
- Proper content to be rendered for Google's crawler

**Build Process**:
```bash
npm run build
# Runs: sitemap → vite build → post-build
```

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

1. **GitHub Pages**: Returns HTTP 404 status (unavoidable limitation)
2. **Content**: Serves `404.html` which contains the full React app
3. **JavaScript**: React app loads and initializes
4. **Routing**: React Router routes to the Turkish landing page
5. **Rendering**: Page renders with proper content and SEO meta tags
6. **Indexing**: Google can index the rendered content

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

### GitHub Pages 404 Status

GitHub Pages will always return an HTTP 404 status code for non-existent files. While we serve the full app content in `404.html`, the status code remains 404. 

**Impact**: 
- Modern crawlers (including Google) can handle this because they execute JavaScript and see the rendered content
- Very old crawlers that don't execute JavaScript might still see it as a 404

**Alternative Solutions**:
If the 404 status becomes a significant issue, consider:
1. **Netlify**: Properly handles SPA routing with 200 status codes (config already present in `netlify.toml`)
2. **Vercel**: Similar to Netlify (config already present in `vercel.json`)
3. **Pre-rendering**: Generate static HTML for key pages

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
