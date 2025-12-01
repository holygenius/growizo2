# What is GroWizard?

**GroWizard** is a modern React-based Progressive Web Application (PWA) designed to help indoor gardeners plan and configure their grow tent setups. It provides a comprehensive, guided wizard experience for selecting and configuring all the essential components needed for an indoor growing environment.

## 🎯 Purpose

The application serves as a **grow tent setup planner and configurator** that:
- Guides users through selecting equipment for their indoor growing space
- Calculates power consumption and estimated costs
- Visualizes light placement with an interactive PPFD (Photosynthetic Photon Flux Density) heatmap
- Provides cost estimation tools for electricity and equipment
- Supports multiple languages (English and Turkish)

## 🏗️ Core Features

### 1. Multi-Step Builder Wizard
The heart of the application is an 8-step guided builder flow:

| Step | Feature | Description |
|------|---------|-------------|
| 1 | **Tent Selection** | Choose from preset tent sizes (2x2 to 4x8 ft) or define custom dimensions |
| 2 | **Lighting Selection** | Select LED or HPS lights with PPFD visualization and coverage calculations |
| 3 | **Ventilation Selection** | Choose inline fans, carbon filters, and ducting |
| 4 | **Environment Control** | Select environmental control equipment |
| 5 | **Growing Media** | Choose between soil, coco coir, or hydroponic systems |
| 6 | **Nutrients** | Select nutrient systems compatible with chosen media |
| 7 | **Monitoring** | Add monitoring equipment (sensors, controllers) |
| 8 | **Summary View** | Review complete setup with cost breakdown and export options |

### 2. Interactive PPFD Light Placement Tool
- 3D visualization of grow tent with light placement
- Real-time PPFD heatmap showing light intensity across the canopy
- Drag-and-drop light positioning
- Coverage optimization recommendations

### 3. Utility Tools
The app includes standalone tools accessible via `/tools`:

| Tool | Purpose |
|------|---------|
| **Electricity Cost Calculator** | Calculate monthly power costs based on equipment and local electricity rates |
| **Unit Converter** | Convert between various growing-related measurements |
| **CO2 Calculator** | Calculate CO2 supplementation requirements |
| **PPFD Heatmap Tool** | Standalone light coverage analysis |

### 4. Feeding Schedule Tools
Pre-configured nutrient feeding schedules for popular brands:
- **BioBizz** - Organic nutrient line
- **Advanced Nutrients** - Professional nutrient systems
- **Canna** - Dutch nutrient manufacturer

### 5. Blog System
Integrated blog with growing guides and educational content.

## 🌍 Internationalization

The app supports:
- **English (en)** - Default language with imperial units (ft, USD)
- **Turkish (tr)** - With metric units (cm, TRY)

Language detection is automatic based on browser settings, with URL-based routing (`/en/...` or `/tr/...`).

## 💻 Technical Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **React Router** | Client-side routing |
| **React Three Fiber** | 3D visualization (PPFD heatmap) |
| **Framer Motion** | Animations |
| **Service Worker** | PWA offline support |

## 📁 Project Structure

```
grow-tent-builder/
├── src/
│   ├── App.jsx              # Main router and app structure
│   ├── main.jsx             # Application entry point
│   ├── components/          # Reusable UI components
│   │   ├── Blog/            # Blog system components
│   │   ├── LandingPage/     # Landing page sections
│   │   └── Tools/           # Standalone tool components
│   ├── context/             # React context providers
│   │   ├── BuilderContext   # Wizard state management
│   │   ├── SettingsContext  # Language, currency, units
│   │   └── OnboardingContext# First-time user experience
│   ├── features/            # Builder step components
│   ├── data/                # Static data (nutrients, schedules)
│   ├── utils/               # Utility functions
│   │   └── translations/    # i18n translation files
│   └── styles/              # Global CSS styles
├── public/                  # Static assets
├── index.html               # HTML entry point
├── vite.config.js           # Build configuration
└── package.json             # Dependencies and scripts
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Key Design Patterns

1. **Context-Driven State** - Application state managed via React Context for easy sharing between components
2. **Component-First Architecture** - Small, reusable UI building blocks
3. **Feature-Based Organization** - Builder steps organized as features
4. **Responsive Design** - Mobile-first with PWA support for offline use

## 🔧 Configuration

Environment variables (via `.env`):
- `VITE_GTAG_ID` - Google Analytics tracking ID

## 📱 PWA Features

- **Offline Support** - Works without internet connection
- **Install Prompt** - Can be installed as a native app
- **Auto Updates** - Prompts users when new version available
- **Fast Loading** - Service worker caching for instant loads

---

*GroWizard is designed to be a starting point for growers planning their indoor setup, with room for extension into a full grow management dashboard.*
