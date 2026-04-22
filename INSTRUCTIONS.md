# INSTRUCTIONS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173/open-aviation-components/)
npm run build     # Build demo app + library to dist/
npm run preview   # Preview production build locally
```

No test or lint commands are configured.

## Code style

Use descriptive variable names — avoid single-letter or two-letter abbreviations for local variables, even in short blocks. For example, prefer `asiCanvas` over `ac` and `vsiRadius` over `vR`.

## Commit style

Do **not** add `Co-Authored-By` trailers. The developer is solely responsible for authorship of all commits, regardless of tooling used.

## Architecture

This is a **web component library** for interactive aviation training visualizations, deployed as a GitHub Pages demo at https://open-aviation-solutions.github.io/open-aviation-components/.

**Stack:** Vite + Three.js (3D rendering). Components are plain custom elements (`HTMLElement` subclasses). No framework dependency — the library and demo are both vanilla JS.

**Library entry:** `src/index.js` registers `FourForces` — the only component so far.

**Demo app** is a plain multi-page HTML site. The landing page at the project root (`index.html`) links to each component demo, which lives in its own top-level directory (e.g. `four-forces/index.html` + `four-forces/main.js`). Shared infrastructure — `demo/shared.css`, `demo/sidebar.js` (single source of truth for nav entries), and `demo/landing.js` — lives under `demo/`. Each component demo's `main.js` imports `shared.css`, calls `renderSidebar(<slug>)`, and wires up any per-page controls. Adding a new component means adding a top-level directory with `index.html` + `main.js`, declaring it as a Vite input in `vite.config.js`, and appending an entry to the `NAV` array in `demo/sidebar.js`. The demo is not part of the library distribution.

Component-specific instructions live alongside each component's source (e.g. `src/components/FourForces/INSTRUCTIONS.md`).

## Naming conventions

- **Component source directory:** `src/components/<ComponentName>/` — PascalCase matching the class name (e.g. `FourForces/`)
- **Component CSS:** `src/components/<ComponentName>/index.css` — always `index.css`, not a named file
- **Demo directory:** kebab-case at the project root, matching the HTML element tag (e.g. `four-forces/`)
- **Nav slug** in `demo/sidebar.js`: kebab-case matching the demo directory name (e.g. `'four-forces'`)
- **HTML custom element tag:** kebab-case per the HTML spec (e.g. `<four-forces>`)

### Deployment

`vite.config.js` sets `base: '/open-aviation-components/'` for GitHub Pages. The `dist/` output of `npm run build` is what gets deployed.
