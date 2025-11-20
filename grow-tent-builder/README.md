# Grow Tent Builder

Grow Tent Builder is a small React + Vite web application for planning and configuring indoor grow tent setups.

The app provides a guided builder flow where users choose a tent, lighting, ventilation, nutrients and environmental settings, then review a summary of the configured grow. It is intended as a lightweight planning tool and starting point for a more feature-rich grow management dashboard.

Key concepts:

- Guided selections: step-based components under `src/features/` for tent, lighting, ventilation, nutrients, environment, monitoring, and a summary view.
- Context-driven state: app-level state is managed with React contexts in `src/context/` so components can share builder and settings data.
- Component-first structure: UI parts live in `src/components/` and are small, reusable building blocks.

## Features

- Multi-step builder flow (tent → lighting → ventilation → nutrients → environment → monitoring → summary)
- Persisted settings via centralized `SettingsContext` (easy to extend)
- Lightweight, Vite-powered dev experience with fast refresh
- ESLint configuration for consistent code style

## Quick Start

Prerequisites:

- Node.js 18+ and npm (or compatible package manager)

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:5173 (or the URL printed by Vite) in your browser.

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint the code:

```bash
npm run lint
```

## Project Structure

Relevant files and folders:

- `index.html` — App entry HTML
- `vite.config.js` — Vite configuration
- `package.json` — Scripts and dependencies
- `src/main.jsx` — Application bootstrap
- `src/App.jsx` — Main app component and routing/flow
- `src/index.css` — Global styles
- `src/components/` — Reusable UI components (`Layout.jsx`, `ProgressTracker.jsx`, `SettingsBar.jsx`, `StatsBar.jsx`)
- `src/context/` — React contexts (`BuilderContext.jsx`, `SettingsContext.jsx`)
- `src/features/` — Feature pages / builder steps:
	- `TentSelection.jsx`
	- `LightingSelection.jsx`
	- `VentilationSelection.jsx`
	- `NutrientSelection.jsx`
	- `EnvironmentSelection.jsx`
	- `MonitoringSelection.jsx`
	- `MediaSelection.jsx`
	- `SummaryView.jsx`
- `src/utils/translations.js` — Simple translation helper / strings

This structure favors clarity for a step-based builder app and is easy to extend with routing, persistence, or server APIs.

## Usage and Extensibility

- Add new builder steps by creating a new component inside `src/features/` and wiring it into the flow in `src/App.jsx`.
- Persist builder state to localStorage, IndexedDB, or a backend by enhancing `BuilderContext.jsx`.
- Replace or extend the presentational components in `src/components/` to adapt the UI.

## Development Notes

- This project uses Vite for fast local development. The `dev` script runs the Vite dev server with HMR.
- ESLint is configured; run `npm run lint` and follow suggestions to keep code consistent.
- The project currently targets React 19 and uses the official React plugin for Vite.

## Contributions

Contributions are welcome. Suggested workflow:

1. Fork the repo and create a feature branch.
2. Implement your changes and add tests where appropriate.
3. Ensure linter passes: `npm run lint`.
4. Open a pull request with a clear description of the change.

If you plan on a larger feature (persisting user projects, authentication, or telemetry), open an issue first to discuss design and API shape.

## Screenshots

- Add screenshots or a demo GIF here to showcase the builder flow. (Optional — include in `public/` and reference from this README.)

Example screenshot (auto-generated placeholder):

![App screenshot](public/screenshot.svg)

## License

Add a `LICENSE` file to declare the project license. If you are the repo owner, we recommend adding an SPDX-compatible license such as `MIT`.

## Contact

For questions or collaboration, open an issue in this repository or contact the maintainer.

---

Generated and maintained for the `grow-tent-builder` project.
