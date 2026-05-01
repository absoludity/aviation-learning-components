# FlightPathOverview component

Source: `src/components/FlightPathOverview/index.ts` (custom element `flight-path-overview`), CSS in `index.css`.

A pure SVG visualisation of a flight plan as a sequence of lesson topics. Two runways (departure on the left, arrival on the right) with a dashed flight path between them, numbered waypoint circles at each topic, segment-time labels on each leg, and an animated piper that moves through the waypoints. As the plane reaches each waypoint, the actual elapsed time is recorded and compared against the planned time, with a variance indicator in the footer.

The SVG has an intrinsic `viewBox="0 0 900 362"` and scales to its container's width.

## Properties and attributes

- **`topics`** (property only — not an attribute): `Array<{ label: string, time?: number, color?: string, labelColor?: string }>`. The first entry is the departure label (rendered under the left runway); the remaining entries are waypoints. Each `time` is the duration in minutes of the segment *starting* at that topic (so the first `time` is climb, the last is descent). Use `\n` in `label` for line breaks. Set via the DOM property: `element.topics = [...]`. In Vue, `:topics="..."` on a registered custom element does this automatically.
- **`plane-position`** attribute (number): controls where the plane sits and triggers time recording.
  - `0` — departure runway, no timer running.
  - `0 → 1` transition — records the departure timestamp; plane **stays at the departure runway** (this step is purely for timing).
  - `2 … topics.length` — waypoints 1 … N (plane animates to each).
  - `topics.length + 1` — arrival runway.

  For sequential use (e.g. Slidev `$clicks`, or a slider stepped with next/prev), the full range is `0` through `topics.length + 1`. Skipping the `0 → 1` step (e.g. jumping directly to `2`) bypasses departure recording and shifts all positions down by one.
- **`arrival-label`** attribute (string, default `ARRIVAL`): label shown under the right runway.

## Shared state

Every `<flight-path-overview>` on the page shares the same flight plan and the same recorded actual times. The first instance to receive a `topics` value seeds the shared plan; subsequent instances without an explicit `topics` reuse it. The first transition `plane-position: 0 → 1` records the departure time; subsequent transitions on any instance record per-waypoint actuals (first-write-wins).

To reset the shared state, import the module-level mutators from the package:

```ts
import { resetTimer, resetFlightPlan } from '@open-aviation-solutions/components'

resetTimer()        // clears recorded times, keeps the plan
resetFlightPlan()   // clears both
```

## No Three.js, no Canvas

Pure SVG DOM in the shadow root. The piper plane is a bundled SVG, embedded as a data URL on the `<image>` element so the library has no runtime asset dependencies.
