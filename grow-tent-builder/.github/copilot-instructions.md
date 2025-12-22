# GroWizard - AI Coding Agent Instructions

## Project Overview
GroWizard is a React 18 + Vite PWA for planning indoor grow tent setups with real-time PPFD lighting simulation. Multi-step builder (tent → lighting → ventilation → environment → nutrients → monitoring → summary) with bilingual support (EN/TR), admin panel, and tool suite (cost calculator, CO2 planner, feeding schedules). Production deployments to Netlify.

## Architecture Essentials

### State Management: React Context + Reducer Pattern
**BuilderContext** (`src/context/BuilderContext.jsx`): 9-step builder flow (preset selection → tent → lighting → ventilation → environment → media → nutrients → monitoring → summary). State shape:
```javascript
{
  currentStep, tentSize, selectedItems: {tent, lighting, ventilation, ...},
  totals: {cost, power, cfmRequired}, selectedPreset, mediaType
}
```
Reducer actions: `NEXT_STEP`, `PREV_STEP`, `ADD_ITEM`, `REMOVE_ITEM`, `INCREMENT_ITEM`, `DECREMENT_ITEM`, `LOAD_PRESET`. All equipment additions auto-recalculate totals via `calculateTotals()`. **Critical**: Cost is in TRY (Turkish Lira, base currency), converted at display time.

**SettingsContext** (`src/context/SettingsContext.jsx`): Language (EN/TR), Currency (USD/EUR/TRY), UnitSystem (IMPERIAL/METRIC). Auto-syncs to localStorage. Language selection cascades to currency/units (TR→TRY/METRIC, EN→USD/IMPERIAL). Provides `t('key')` translation function and format utilities.

**OnboardingContext**: First-time UX flow tracking.

### Bilingual Routing Architecture
Routes follow `/:lang/*` pattern:
- EN: `/en/builder`, `/en/tools/ppfd`, `/en/blog`
- TR: `/tr/olusturucu`, `/tr/araclar/ppfd`, `/tr/blog`

`LanguageWrapper` component (in `App.jsx`) syncs URL lang param with `SettingsContext.setLanguage()`. **When adding routes**: Create BOTH language variants in `App.jsx` with proper path slugs. Example:
```jsx
<Route path="/en/builder" element={<BuilderApp />} />
<Route path="/tr/olusturucu" element={<BuilderApp />} />
```

### CSS Module + Design System
All components use CSS Modules (`.module.css`) for scoped styles. Global tokens in `src/styles/variables.css` (colors: `--primary`, `--bg-dark`, etc., spacing: `--spacing-*`). Reusable patterns in `src/styles/mixins.css` (glassmorphism, hover effects, gradients). Import pattern:
```jsx
import styles from './Component.module.css'
// className={styles.containerClass}
```

## Core Components Map

### Builder Flow: `src/features/` (9 steps)
Sequential selection pages dispatching to BuilderContext. Each step is a controlled component receiving `useBuilder()` hook:
- **PresetSetSelector** (Step 0): Load saved configurations
- **TentSelection** (Step 1): Pick tent, sets `tentSize` and `dimensionsFt`
- **LightingSelection** (Step 2): Multi-select lights, each has `id, name, watts, ppfd, maxPPFD, beamAngle, recommendedHeight`
- **VentilationSelection** (Step 3): Exhaust fans, inline fans (filtered by required CFM)
- **EnvironmentSelection** (Step 4): Heaters, humidifiers, controllers
- **MediaSelection** (Step 5): Substrate selection
- **NutrientSelection** (Step 6): Nutrient lines (BioBizz, Advanced Nutrients, Canna)
- **MonitoringSelection** (Step 7): Sensors, probes
- **SummaryView** (Step 8): Review, export, save preset

Navigation via `dispatch({ type: 'NEXT_STEP' })` or `dispatch({ type: 'SET_STEP', payload: stepNum })`.

### PPFD Lighting Simulation
**LightPlacementCanvas.jsx**: Interactive canvas with light source placement and real-time PPFD heatmap. Uses HTML5 Canvas for rendering.

**lightingUtils.js** exports:
- `calculatePPFD(light, targetX, targetY, lightX, lightY, height)`: Lambertian model, PPFD = maxPPFD × cos(θ). Accounts for inverse-square law if height differs from recommendedHeight.
- `generatePPFDMap()`: Grid-based heatmap generation.
- `interpolatePPFDColor()`: Color coding (blue=low → red=high µmol/m²/s).

Parameters always in **feet** internally; UI converts based on `unitSystem` setting.

### Tools Suite: `src/components/Tools/`
Self-contained tools with no BuilderContext dependency:
- **CostCalculator**: Quick equipment pricing
- **PPFDHeatMapTool**: Light placement simulator
- **CO2Calculator**: CO2 requirements (ppm, room volume)
- **UnitConverter**: Metric ↔ Imperial
- **FeedingSchedule**: BioBizz/Canna schedule viewer
- **AdvancedNutrientsSchedule**: AN schedule with week-by-week breakdown
- **CannaSchedule**: Canna A+B schedule

Each has own route: `/en/tools/ppfd`, `/tr/araclar/ppfd`, etc.

### Admin Panel: `src/pages/admin/`
Full CRUD interface for:
- **Catalog**: Brands, Categories, Products (with image upload)
- **Growth**: Feeding schedules, Preset sets
- **Content**: Blog posts
- **Users**: User management
- **Settings**: System config, admin logs

Requires Supabase auth with admin role (checked via `userService.checkAdminStatus()`). Data flows via service layer in `src/services/`. AdminContext provides admin-specific `t()` translations and toast notifications.

## Product Data & Equipment Structure

Equipment stored in `src/data/builderProducts.js`:
```javascript
{
  id: 'unique-slug',
  brand: 'Manufacturer',
  name: 'Model',
  price: 5000,           // in TRY
  watts: 150,            // power draw
  ppfd: 500,             // PAR at recommended height (µmol/m²/s)
  quantity: 1,           // initially 1, incremented by user
  // ... equipment-specific fields
}
```

Nutrient schedules: `src/data/feedingScheduleData.js` (complex structures with week-by-week phases). Admin panel can edit via Supabase.

## Development Commands & Workflows

```bash
npm run dev              # Vite dev on :5173 with HMR
npm run build            # Prod build (runs sitemap generator first)
npm run preview          # Local preview of production build
npm run lint             # ESLint on all .js/.jsx
npm run sitemap          # Generate sitemap.xml for SEO
```

**Environment setup** (`.env.local`):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GTAG_ID=G-XXXXXXX  # Optional: Google Analytics
```

**Add new builder step**:
1. Create component in `src/features/StepName.jsx`
2. Import in `src/components/BuilderApp.jsx`
3. Add case in `StepRenderer` switch (increment step number)
4. Update `BuilderContext` initialState if new equipment category
5. Add translations to `src/utils/translations/builder.js` for both `en` and `tr`

**Add new tool**: Create `src/components/Tools/ToolName.jsx`, register routes in `App.jsx` (both `/en/tools/` and `/tr/araclar/` versions).

**Add translation key**: Edit `src/utils/translations/{domain}.js` (domains: `admin.js`, `builder.js`, `tools.js`, `feeding.js`, `navigation.js`, `landing.js`, `onboarding.js`, `errors.js`, `common.js`). Use key pattern: `'camelCaseKey'`. Always add to both `en` and `tr` objects. Access via `const { t } = useSettings(); t('keyName')`. Admin panel uses separate `useAdmin().t()` from AdminContext.

## Critical Patterns & Conventions

**Unit System**: Internal calculations use feet. Convert at display with `SettingsContext` helper. Example:
```javascript
const { unitSystem } = useSettings();
const displayWidth = unitSystem === 'METRIC' 
  ? Math.round(tenWidth * 30.48 * 100) / 100  // cm
  : tentWidth;  // feet
```

**Currency & Price Display**: All prices stored in TRY. Convert at display:
```javascript
const { currency } = useSettings();
const displayPrice = Math.round(priceTRY * CURRENCIES[currency].rate * 100) / 100;
```

**Unused Variables**: ESLint rule `varsIgnorePattern: '^[A-Z_]'` ignores uppercase constants. Safe to use `const MAX_PPFD = 1200;` without warnings.

**PWA & Service Worker**: Auto-configured in `vite.config.js` with Workbox. `UpdatePrompt.jsx` notifies users of new versions. Browser auto-updates in background.

**Vite Config**: Uses `rolldown-vite` fork (see `package.json` overrides) for speed. HMR enabled for development.

## Common Modifications

| Task | File | Notes |
|------|------|-------|
| Add equipment category | `BuilderContext.jsx` initialState, new reducer action | Update `calculateTotals()` if affects cost/power |
| Tweak PPFD formula | `src/utils/lightingUtils.js` `calculatePPFD()` | All heights in feet, PPFD in µmol/m²/s |
| Change color scheme | `src/styles/variables.css` | CSS custom properties (--primary, --success, etc.) |
| Add new nutrient line | `src/data/feedingScheduleData.js` | Update admin panel to manage via UI |
| Fix language string | `src/utils/translations/*.js` | Edit both `en` and `tr` objects |

## External Dependencies Worth Knowing

- **@react-three/fiber** + **three**: 3D visualizations (used minimally)
- **framer-motion**: Animations (only feeding schedule tools)
- **lucide-react**: Icon library (consistent icon set)
- **react-router-dom**: Client-side routing (7.x version)
- **@supabase/supabase-js**: Backend (auth, DB, storage)
- **react-helmet-async**: SEO meta tags
- **vite-plugin-pwa**: Service worker generation

## Service Layer Architecture

**Always use service functions** - never call Supabase client directly from components:

| Service | Purpose |
|---------|---------|
| `productService.js` | Product CRUD, filtering by brand/category/type |
| `brandService.js` | Brand management |
| `scheduleService.js` | Feeding schedules |
| `presetService.js` | Preset sets management |
| `userService.js` | User profiles, onboarding, admin checks |
| `adminService.js` | Admin logs, settings |
| `blogApi.js` | Blog post operations |
| `ikasService.js` | IKAS vendor product sync (OAuth2) |

**Database fields are i18n jsonb**: Access localized content as `product.name['tr']` or `product.name['en']`. Schema reference: `scripts/supabase-schema.sql`.

## File Reference by Purpose

| Purpose | Location |
|---------|----------|
| State hooks | `src/context/` |
| UI components | `src/components/` |
| Builder steps | `src/features/` |
| Calculations | `src/utils/` |
| Static data | `src/data/` |
| Styling | `src/styles/` |
| Admin pages | `src/pages/admin/` |
| Service layer | `src/services/` |
| DB schema | `scripts/supabase-schema.sql` |
