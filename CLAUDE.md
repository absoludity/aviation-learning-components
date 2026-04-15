# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173/aviation-learning-components/)
npm run build     # Build demo app + library to dist/
npm run preview   # Preview production build locally
```

No test or lint commands are configured.

## Architecture

This is a **Vue 3 component library** for interactive aviation training visualizations, deployed as a GitHub Pages demo at https://absoludity.github.io/aviation-learning-components/.

**Stack:** Vue 3 + Vite + Three.js (3D rendering)

**Library entry:** `src/index.js` exports `FourForces` — the only component so far. The intent is to eventually migrate to web components.

**Demo app** (`demo/`) is a separate Vue Router app that imports and showcases the components. It is not part of the library distribution.

### FourForces component (`src/components/FourForces.vue`)

The core component (~761 lines) is a self-contained 3D aerodynamic force visualizer. Key internals:

- **Three.js scene** — renderer, orbit-controlled camera, loads `aircraft.glb` (GLTF)
- **Physics tick loop** — computes lift, drag, thrust, speed convergence, and VSI each frame using aerodynamic coefficients (CL, CD). Power and attitude sliders drive the simulation.
- **Arrow objects** — scaled 3D arrows for each of the four forces; `updateArrows()` repositions them each tick
- **2D label overlay** — `updateLabels()` projects 3D arrow tips to screen coordinates and positions absolutely-placed HTML labels
- **Weight component decomposition** — `updateWeightComponents()` shows weight resolved along and perpendicular to the flight path during climbs/descents
- **Particle system** — 120 particles animate an airflow stream
- **Gauge canvas** — ASI and VSI instruments drawn imperatively onto an overlay `<canvas>`
- **BroadcastChannel** — syncs state across browser tabs

**Props:**
- `height` (String, default `'400px'`)
- `modelPath` (String, default `'/aircraft.glb'`) — URL to the GLTF model

### Slidev compatibility

The component imports `useSlideContext` from `@slidev/client`. The `vite.config.js` aliases this to `src/slidev-stub.js` so the component works outside Slidev without changes.

### Deployment

`vite.config.js` sets `base: '/aviation-learning-components/'` for GitHub Pages. The `dist/` output of `npm run build` is what gets deployed.
