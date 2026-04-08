# aviation-learning-components

Interactive components for aviation training. Currently implemented as Vue 3 single-file components, with a view to migrating to standard web components in future.

**Live demo:** https://absoludity.github.io/aviation-learning-components/

---

## Components

| Component | Purpose | Key props |
|-----------|---------|-----------|
| [FourForces](#fourforces) | 3D visualization of aerodynamic forces with physics model | `height`, `modelPath` |

---

## FourForces

An interactive 3D visualization of the four aerodynamic forces — Lift, Weight, Thrust, and Drag — shown as arrows on an aircraft model. Power and Attitude sliders drive a physics model; the arrows scale dynamically to reflect the force balance. Includes airspeed (ASI) and vertical speed (VSI) instrument gauges, airflow particle stream visualization, and weight-component decomposition during climbs.

### Peer dependencies

```
npm install three
```

### Usage

```vue
<script setup>
import FourForces from 'aviation-learning-components/src/components/FourForces.vue'
</script>

<template>
  <FourForces height="400px" model-path="/path/to/aircraft.glb" />
</template>
```

You will need to serve the `aircraft.glb` file as a static asset. A copy is included in the `public/` directory of this repository.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | String | `'400px'` | CSS height of the component container |
| `modelPath` | String | `'/aircraft.glb'` | URL to the GLTF aircraft model served as a static asset |

### Using in a Slidev project

The component imports `useSlideContext` from `@slidev/client` to skip rendering in overview/preview modes. This works automatically in a Slidev project.

When using the component outside of Slidev, add an alias in your `vite.config.js` to stub the import:

```js
// vite.config.js
import { fileURLToPath, URL } from 'node:url'

export default {
  resolve: {
    alias: {
      '@slidev/client': fileURLToPath(
        new URL('./node_modules/aviation-learning-components/src/slidev-stub.js', import.meta.url)
      ),
    },
  },
}
```

---

## Contributing

Improvements to the component files must be shared under the same [MPL 2.0](LICENSE) license — fork, improve, and open a pull request. Projects that merely *use* the components are not affected by this requirement.

## Support

If these components have saved you time, consider [buying me a coffee](https://ko-fi.com) or [sponsoring on GitHub](https://github.com/sponsors/absoludity). ☕

## License

[Mozilla Public License 2.0](LICENSE) — modifications to the component source files must stay open; applications using them do not have to be.
