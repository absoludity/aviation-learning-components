# 0004 — Lib build: separate registration and fix Three.js externalisation

**Status:** open

## Background

The published lib (`dist/lib/open-aviation-components.es.js`) has two problems
that make it awkward to use as a normal dependency:

1. **Auto-registration as a side effect.** Each component file calls
   `customElements.define(...)` unconditionally at the module level. Importing
   a class also registers it — consumers cannot import the element class
   without triggering the side effect, and cannot register elements selectively
   or lazily.

2. **Three.js bundled in the ES module despite `external: ['three']`.**
   `vite.lib.config.js` lists `three` as external with a UMD global of `THREE`,
   and the UMD output does correctly emit `require("three")`. But the ES output
   (`open-aviation-components.es.js`) has no `import` statement for Three.js —
   instead Three.js classes (`WebGLRenderer`, `BufferGeometry`,
   `PerspectiveCamera`, etc.) are inlined. This is an inconsistency: the ES
   module is self-contained (~189KB) but the package advertises `three` as a
   peer dependency and the UMD is not self-contained. Anyone trying to use the
   UMD build in a browser needs `THREE` as a global, but nobody would expect
   the ES build to have a different behaviour.

## What to fix

### 1. Separate registration from export

Move `customElements.define(...)` calls out of the component source files and
into explicit registration helpers, following the pattern used by Lit, FAST,
and other web component libraries:

```ts
// src/components/FourForces/index.ts
export class FourForcesElement extends HTMLElement { ... }
// No customElements.define here.

// src/index.ts — named export for manual use
export { FourForcesElement } from './components/FourForces'
export { ClimbPerformanceElement } from './components/ClimbPerformance'
export { FlightPathOverviewElement } from './components/FlightPathOverview'

// src/define.ts — side-effect entry point for script-tag / CDN use
import { FourForcesElement } from './components/FourForces'
import { ClimbPerformanceElement } from './components/ClimbPerformance'
import { FlightPathOverviewElement } from './components/FlightPathOverview'

customElements.define('four-forces',          FourForcesElement)
customElements.define('climb-performance',    ClimbPerformanceElement)
customElements.define('flight-path-overview', FlightPathOverviewElement)
```

Add `src/define.ts` as a second build entry alongside `src/index.ts`. The
outputs:

| File | Purpose |
|---|---|
| `dist/lib/open-aviation-components.es.js` | Class exports, no side effects — for bundlers |
| `dist/lib/open-aviation-components.umd.js` | Same, UMD wrapper |
| `dist/lib/define.es.js` | Self-registering drop-in — for `<script type="module">` / CDN |

Update `package.json`:

```json
"exports": {
  ".": {
    "import": "./dist/lib/open-aviation-components.es.js",
    "require": "./dist/lib/open-aviation-components.umd.js"
  },
  "./define": "./dist/lib/define.es.js"
}
```

CDN users then do:
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@open-aviation-solutions/components@VERSION/dist/lib/define.es.js"></script>
```

Bundler users import classes directly and register where they want:
```ts
import { FourForcesElement } from '@open-aviation-solutions/components'
customElements.define('four-forces', FourForcesElement)
```

### 2. Decide on Three.js bundling and make it consistent

Two options:

**Option A — Bundle Three.js in `define.es.js`, keep it external in the main entry.**
- `src/index.ts` (main): `external: ['three']` — consumers provide Three.js.
- `src/define.ts` (CDN drop-in): Three.js bundled in — self-contained for
  `<script>` tag use. Rename to `define.bundled.es.js` or just `define.es.js`
  and document that it is self-contained.
- Remove `three` from `peerDependencies` (or keep it only for the main entry
  and document the distinction).

**Option B — Always bundle Three.js.**
- Remove `external: ['three']` from the lib build config.
- Remove `three` from `peerDependencies`.
- Both ES and UMD outputs are self-contained.
- Simpler, but consumers using a bundler will double-bundle Three.js if they
  already depend on it.

Option A is more correct for a library. Option B is simpler and reasonable
given that the ES module already bundles it today (accidentally).

**Either way, fix the current inconsistency** — the ES and UMD builds should
behave the same with respect to Three.js.

## Impact on open-aviation-lessons

Once this is done, `marp.config.js` can inject a single CDN script to
`dist/lib/define.es.js` (or the bundled variant) instead of the current
per-component hashed-filename map. See `open-aviation-lessons/tasks/0002`.
