# Task 0002 — Remove Vue dependency from the demo site

**Status:** Complete

## Goal

Rewrite the demo app (`demo/`) as a small set of plain HTML + vanilla JS files, and drop Vue, Vue Router, and `@vitejs/plugin-vue` from the project. The library itself (`src/`) already uses only custom elements and has no Vue dependency — this task removes the framework from the one place it is still used: the GitHub Pages showcase.

## Motivation

The demo currently uses:

- `vue` (^3.5.0)
- `vue-router` (^4.5.0)
- `@vitejs/plugin-vue` (^5.2.1)

…to render a sidebar + content layout wrapping a **single** page (`FourForcesPage.vue`) that itself only needs: a heading, a block of prose, one checkbox that toggles the `banking` attribute on `<four-forces>`, the component itself, and a static documentation table. There is no meaningful reactivity, no data flow between views, no shared state, and — until a second component lands — no real routing either. The component is a custom element, so the surrounding Vue layer adds nothing except bundle size, build complexity, and a dependency footprint that misrepresents what the library needs.

Removing Vue:

- Makes the `package.json` `devDependencies` honestly reflect that the library has no framework dependency.
- Shrinks the deployed demo bundle.
- Makes the demo pages easier for contributors to read — plain HTML is the shortest path to showing "here is how you consume the component".
- Keeps the door open to adding a second component later without reintroducing a framework: a sidebar that lists N static pages is a handful of lines of vanilla JS (or, for a truly static version, one HTML file per component linked from an index).

## Current state

- `demo/main.js` — creates a Vue app, registers Vue Router with `createWebHashHistory`, mounts to `#app` in `index.html`.
- `demo/App.vue` — layout shell: fixed-width sidebar with a title, a nav list (hard-coded single entry), a GitHub footer link, and a `<RouterView />`. All styling is in `<style>` (not scoped).
- `demo/pages/FourForcesPage.vue` — one page. Uses `ref` + `v-model` for the `banking` checkbox; everything else is static markup and scoped styles.
- `index.html` — mounts `#app` and loads `/demo/main.js`.
- `vite.config.js` — imports and registers `@vitejs/plugin-vue`.

## Plan

### 1. Replace the router shell with static HTML pages

Create one directory per component demo with its own `index.html`, so URLs are directory-style (`/open-aviation-components/four-forces/`) rather than file-style (`.../four-forces.html`). This is a nicer public URL, matches what most static-site generators produce, and leaves room to add per-component assets alongside the page without cluttering a flat `demo/` directory. Proposed layout:

```
index.html                       # landing page — intro + list of components
demo/
  shared.css                     # layout + sidebar + page styles (from App.vue + FourForcesPage.vue)
  sidebar.js                     # shared sidebar renderer — single source of truth for nav entries
  four-forces/
    index.html                   # was FourForcesPage.vue
    main.js                      # page-specific entry: imports the component, wires banking toggle
```

Directory-style URLs on GitHub Pages: Pages serves `foo/index.html` when the URL path is `foo/` (with or without the trailing slash — Pages adds it), so `https://open-aviation-solutions.github.io/open-aviation-components/four-forces/` just works. No special config needed server-side.

Vite multi-page build: Vite only auto-discovers `index.html` at the project root. Nested HTML entries must be declared explicitly. Update `vite.config.js`:

```js
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/open-aviation-components/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        fourForces: resolve(__dirname, 'demo/four-forces/index.html'),
      },
    },
  },
})
```

Each additional component demo adds one line to `input`. In dev, Vite serves nested `index.html` files directly — `http://localhost:5173/open-aviation-components/demo/four-forces/` resolves without configuration. (The `demo/` prefix in the dev URL is an artefact of the directory layout; on the built/deployed site the entries land at `/open-aviation-components/four-forces/` as intended because Rollup emits each input relative to the project root — verify this assumption during Step 6 and, if the built output preserves the `demo/` directory, either move the component directories to the project root or use `rollupOptions.output` to rewrite the emitted paths.)

Routing: the browser's own URL is the routing mechanism. The current hash-based route `#/four-forces` becomes `/open-aviation-components/four-forces/`. Sidebar links use root-relative hrefs (`/open-aviation-components/four-forces/`) so they work identically from the landing page and from any component page.

### 2. Port `FourForcesPage.vue` to plain HTML + JS

- Copy the template markup into `demo/four-forces/index.html`, stripping `<template>` / `<script setup>` / `<style scoped>` wrappers.
- Move all styles into `demo/shared.css` (see Step 3) — do not keep per-page `<style>` blocks.
- Replace the `v-model="banking"` checkbox with a plain `<input type="checkbox" id="banking-toggle" checked>` plus a small script in `demo/four-forces/main.js`:
  ```js
  import '../../src/components/FourForces.js'
  import { renderSidebar } from '../sidebar.js'

  renderSidebar('four-forces')

  const toggle = document.getElementById('banking-toggle')
  const element = document.querySelector('four-forces')
  toggle.addEventListener('change', () => {
    if (toggle.checked) element.setAttribute('banking', '')
    else element.removeAttribute('banking')
  })
  ```
  The component already reads `banking` as a boolean attribute, so this matches the current `:banking="banking || undefined"` behaviour without any framework glue.
- Set the initial `banking` attribute in HTML to match the current default (`checked` / attribute present).

### 3. Extract shared layout: sidebar + CSS

Both are extracted up-front (not deferred) since a second component is imminent.

**`demo/shared.css`** — holds every style rule currently in `App.vue` and `FourForcesPage.vue`. Consolidate into one file with generic class names (`.page`, `.description`, `.demo-container`, `.code`, `.sidebar`, etc.). The class names in `FourForcesPage.vue` are already page-scoped enough that they won't collide across demos; if a future page needs a truly local rule, it can scope with a page-specific wrapper class (e.g. `.page--four-forces`).

**`demo/sidebar.js`** — single source of truth for the nav list. Every page calls `renderSidebar(activeSlug)` from its entry script. Sketch:

```js
const NAV = [
  { slug: 'four-forces', label: 'FourForces', href: '/open-aviation-components/four-forces/' },
  // future components appended here
]

export function renderSidebar(activeSlug) {
  const container = document.getElementById('sidebar')
  container.innerHTML = `
    <div class="sidebar-header">
      <span class="sidebar-title">Open Aviation<br>Components</span>
    </div>
    <ul>
      ${NAV.map(item => `
        <li><a href="${item.href}" class="${item.slug === activeSlug ? 'active' : ''}">${item.label}</a></li>
      `).join('')}
    </ul>
    <div class="sidebar-footer">
      <a href="https://github.com/open-aviation-solutions/open-aviation-components" target="_blank" rel="noopener">GitHub</a>
    </div>
  `
}
```

Each component's HTML file contains only a layout skeleton:

```html
<div class="layout">
  <nav class="sidebar" id="sidebar"></nav>
  <main class="content">
    <!-- page content -->
  </main>
</div>
```

Notes:

- Using a full URL (`/open-aviation-components/<slug>/`) in each `NAV` entry keeps links working from both the landing page and from any component page, and avoids fragile relative-path arithmetic.
- The `active` class reproduces Vue Router's `active-class="active"` behaviour. Rendering the sidebar from JS means a brief flash of empty sidebar on first paint; if that becomes bothersome, move the sidebar skeleton markup into each HTML file statically and have `renderSidebar` only inject the `<ul>` and toggle the active class. Do not bother with SSR / pre-rendering.
- The landing page (`index.html` at the project root) calls `renderSidebar(null)` — no active entry — and relative paths inside `sidebar.js` must still resolve to the root-level `/open-aviation-components/` base (absolute `href`s handle this).

### 4. Update `index.html` (landing page)

- Make it the landing page: a short "what is this library" intro, a one-paragraph positioning statement, and a list of components linking to each `demo/<component>/` directory. No redirect.
- Drop the `<script type="module" src="/demo/main.js">` tag. Add a page-specific entry that calls `renderSidebar(null)` so the landing page also gets the shared layout chrome.
- Update the `<title>` (currently still `Aviation Learning Components`).

### 5. Remove Vue from the build

- `vite.config.js`: remove `import vue from '@vitejs/plugin-vue'` and the `plugins: [vue()]` entry. Add the multi-page `rollupOptions.input` block shown in Step 1.
- `package.json`: remove `@vitejs/plugin-vue`, `vue`, and `vue-router` from `devDependencies`. Run `npm install` to refresh `package-lock.json`.
- Delete `demo/main.js`, `demo/App.vue`, and `demo/pages/FourForcesPage.vue` once their replacements are in place and working. Also delete the empty `demo/pages/` directory.

### 6. Verify

- `npm run dev` — the sidebar renders, the `FourForces` demo loads, the banking toggle works, the GLB model loads (path `/open-aviation-components/aircraft.glb` is still correct under Vite's `base`), ASI/VSI gauges render, airflow particles animate.
- Click between pages — even with only one entry, confirm the sidebar link resolves and the active-link highlight works.
- `npm run build` — builds cleanly. Inspect `dist/`:
  - No `vue`/`vue-router` chunks in the output.
  - Each HTML page is present under its expected path.
  - Bundle size is meaningfully smaller than before (sanity check — Vue 3 + Router is ~60–80 KB gzipped).
- `npm run preview` — serves the built site locally under `/open-aviation-components/`; smoke-test the same flows.
- Deploy to GitHub Pages and confirm the live site still works at `https://open-aviation-solutions.github.io/open-aviation-components/` and at the per-component page URLs.

### 7. Update documentation

- `CLAUDE.md`: the **Stack** line currently says "Vue 3 is used only in the demo app, not in the library itself" — rewrite to reflect that the demo is now plain HTML/JS, and update the `demo/` description accordingly.
- `README.md`: check for any mention of Vue in the demo and remove it.

## Decisions (locked in)

1. **Structure:** `index.html` at the project root is the landing page; each component demo is its own directory under `demo/` with an `index.html`, giving clean directory-style URLs (`/open-aviation-components/four-forces/`).
2. **Sidebar:** extracted into `demo/sidebar.js` up-front as the single source of truth for nav entries, since a second component is expected soon.
3. **Styling:** consolidated into `demo/shared.css` with generic class names. The existing class names are already page-scoped enough to avoid collisions; page-specific rules can scope with a `.page--<slug>` wrapper if ever needed.

## Out of scope

- Adding new components or demos.
- Any change to `src/` — the library is already framework-free.
- npm publishing (tracked separately).
