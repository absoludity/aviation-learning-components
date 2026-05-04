# INSTRUCTIONS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # Start Astro dev server (http://localhost:4321/open-aviation-components/)
npm run build       # Build docs site to dist/ (Astro)
npm run preview     # Preview production build locally
npm run build:lib   # Build library to dist/lib/ (Vite — unchanged)
npm run typecheck   # Type-check library source (src/ only)
```

No test or lint commands are configured.

## Code style

Use descriptive variable names — avoid single-letter or two-letter abbreviations for local variables, even in short blocks. For example, prefer `asiCanvas` over `ac` and `vsiRadius` over `vR`.

## Commit style

Do **not** add `Co-Authored-By` trailers. The developer is solely responsible for authorship of all commits, regardless of tooling used.

## Architecture

This is a **web component library** for interactive aviation training visualizations, deployed as a GitHub Pages demo at https://open-aviation-solutions.github.io/open-aviation-components/.

**Library stack:** Vite + Three.js (3D rendering). Components are plain custom elements (`HTMLElement` subclasses). No framework dependency.

**Library entry:** `src/index.ts` — exports component classes. `src/define.ts` — registers all custom elements (side-effect import).

**Website** (docs + live demos) is an Astro + Starlight site under `docs/`. The Astro config is `astro.config.mjs` at the repo root, with `srcDir: './docs/src'` and `publicDir: './docs/public'`. Content pages (MDX) live at `docs/src/content/docs/`. Web component wrappers live at `docs/src/components/` as `.astro` files. The website is not part of the library distribution.

**Adding a new component page:**
1. Create `docs/src/components/<ComponentName>.astro` — place the custom element tag in the template; add a `<script>` block that imports `'../../../src/define'` (three hops from `docs/src/components/` to `src/`).
2. Create `docs/src/content/docs/<slug>.mdx` — import the wrapper with `import <ComponentName> from '../../components/<ComponentName>.astro'` and embed `<ComponentName />`.
3. Add a sidebar entry in `astro.config.mjs` under the Components group: `{ label: '...', slug: '<slug>' }`.

Component-specific instructions live alongside each component's source (e.g. `src/components/FourForces/INSTRUCTIONS.md`).

## Naming conventions

- **Component source directory:** `src/components/<ComponentName>/` — PascalCase matching the class name (e.g. `FourForces/`)
- **Component CSS:** `src/components/<ComponentName>/index.css` — always `index.css`, not a named file
- **Astro wrapper:** `docs/src/components/<ComponentName>.astro` — PascalCase matching the class name
- **MDX page:** `docs/src/content/docs/<slug>.mdx` — kebab-case matching the HTML element tag
- **Sidebar slug** in `astro.config.mjs`: kebab-case matching the MDX filename (e.g. `'four-forces'`)
- **HTML custom element tag:** kebab-case per the HTML spec (e.g. `<four-forces>`)

## Deployment

`astro.config.mjs` sets `base: '/open-aviation-components'` and `outDir: './dist'`. The `dist/` output of `npm run build` is deployed to GitHub Pages by the existing `deploy.yml` workflow without modification. Static assets (e.g. `aircraft.glb`) go in `docs/public/` and are served at `/open-aviation-components/<filename>`.
