# Website (demo)

The `website/` directory is the Vite root for the demo site. It is not part of the library distribution.

## Adding a new component demo

1. Create `website/<slug>/index.html` and `website/<slug>/main.ts`.
2. Add a `rollupOptions.input` entry in `vite.config.js`.
3. Append a `NAV` entry in `website/demo/sidebar.ts` (single source of truth for nav links).

## Side-effect import pattern

Each demo `main.ts` **must** import the component source as a side-effect import, not as a named import:

```ts
// ✓ correct — import is preserved, customElements.define() runs
import '../../src/components/FlightPathOverview'

// ✗ wrong — esbuild/Vite strips this if FlightPathOverviewElement is only
//   used in a TypeScript type cast (e.g. "as FlightPathOverviewElement"),
//   so customElements.define() never runs and the element is never upgraded
import { FlightPathOverviewElement } from '../../src/components/FlightPathOverview'
```

If the class type is needed for TypeScript, use `import type` separately and keep the side-effect import:

```ts
import type { FlightPathOverviewElement } from '../../src/components/FlightPathOverview'
import '../../src/components/FlightPathOverview'
```

## Slider max for flight-path-overview demos

The sequential `plane-position` range is `0` through `topics.length` (i.e. `max` = number of entries in the `topics` array, including the departure label). See `src/components/FlightPathOverview/INSTRUCTIONS.md` for details.
