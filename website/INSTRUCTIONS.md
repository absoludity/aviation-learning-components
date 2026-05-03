# Website (demo)

The `website/` directory is the Vite root for the demo site. It is not part of the library distribution.

## Adding a new component demo

1. Create `website/<slug>/index.html` and `website/<slug>/main.ts`.
2. Add a `rollupOptions.input` entry in `vite.config.js`.
3. Append a `NAV` entry in `website/demo/sidebar.ts` (single source of truth for nav links).

## Registration pattern

Each demo `main.ts` registers all components via the side-effect import of `src/define`:

```ts
import '../../src/define'
```

This is the demo equivalent of the published `./define` entry point. Component class files no longer call `customElements.define()` themselves — registration is explicit.

If the class type is needed for TypeScript, import it separately with `import type`:

```ts
import '../../src/define'
import type { FlightPathOverviewElement } from '../../src/components/FlightPathOverview'
```

## Slider max for flight-path-overview demos

The sequential `plane-position` range is `0` through `topics.length` (i.e. `max` = number of entries in the `topics` array, including the departure label). See `src/components/FlightPathOverview/INSTRUCTIONS.md` for details.
