# FourForces component

Source: `src/components/FourForces/index.js` (custom element `four-forces`), CSS in `index.css`.

The core component is a self-contained 3D aerodynamic force visualizer implemented as a custom element (`FourForcesElement extends HTMLElement`). Key internals:

- **Three.js scene** — renderer, orbit-controlled camera, loads `aircraft.glb` (GLTF)
- **Physics tick loop** — computes lift, drag, thrust, speed convergence, and VSI each frame using aerodynamic coefficients (CL, CD). Power and attitude sliders drive the simulation.
- **Arrow objects** — scaled 3D arrows for each of the four forces; `_updateArrows()` repositions them each tick
- **2D label overlay** — `_updateLabels()` projects 3D arrow tips to screen coordinates and positions absolutely-placed HTML labels
- **Weight component decomposition** — `_updateWeightComponents()` shows weight resolved along and perpendicular to the flight path during climbs/descents
- **Lift component decomposition** — `_updateLiftComponents()` (shown when `banking` attribute is set) shows lift resolved into vertical and horizontal components in the plane perpendicular to airflow
- **Particle system** — 120 particles animate an airflow stream
- **Gauge canvases** — ASI and VSI instruments drawn imperatively onto separate overlay `<canvas>` elements (`.ff-gauge-asi` top-left, `.ff-gauge-vsi` top-right); attitude indicator includes bank rotation
- **BroadcastChannel** — syncs state across browser tabs

**Attributes:**
- `height` (default `'400px'`) — CSS height of the component
- `model-path` (default `'/aircraft.glb'`) — URL to the GLTF model
- `v_ne`, `v_no`, `v_1`, `cruise-kts` — airspeed envelope values for ASI gauge
- `banking` — boolean; when present, shows bank angle slider and lift component decomposition

## Slidev compatibility

The component imports `useSlideContext` from `@slidev/client`. The `vite.config.js` aliases this to `src/slidev-stub.js` so the component works outside Slidev without changes.
