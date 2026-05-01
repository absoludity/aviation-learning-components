/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Module-scoped state shared by every <flight-path-overview> on the page.
// Mirrors the Vue composables `useFlightTimer` / `useFlightPlan` from the slides
// project: a single flight plan + a single set of recorded actual times are
// reused across every instance, so consecutive slides showing the same plan
// stay in sync.

export type Topic = {
  label: string
  time?: number
  color?: string
  labelColor?: string
}

let _departureTime: number | null = null
let _actualWaypointTimes: Array<number | null> = []
let _actualArrivalTime: number | null = null
let _varianceMinutes: number | null = null
let _flightTopics: Topic[] | null = null
let _flightArrivalLabel: string = 'ARRIVAL'

const _subscribers = new Set<() => void>()

function notify(): void {
  for (const fn of [..._subscribers]) fn()
}

export function getDepartureTime(): number | null { return _departureTime }
export function getActualWaypointTimes(): ReadonlyArray<number | null> { return _actualWaypointTimes }
export function getActualArrivalTime(): number | null { return _actualArrivalTime }
export function getVarianceMinutes(): number | null { return _varianceMinutes }
export function getFlightTopics(): Topic[] | null { return _flightTopics }
export function getFlightArrivalLabel(): string { return _flightArrivalLabel }

export function recordDeparture(): void {
  if (_departureTime !== null) return
  _departureTime = Date.now()
  notify()
}

export function setWaypointActual(index: number, t: number): void {
  if (_actualWaypointTimes[index]) return  // first-write-wins (mirrors Vue line 340)
  const updated = [..._actualWaypointTimes]
  updated[index] = t
  _actualWaypointTimes = updated
  notify()
}

export function setArrivalActual(t: number): void {
  if (_actualArrivalTime !== null) return
  _actualArrivalTime = t
  notify()
}

export function setVariance(v: number | null): void {
  if (_varianceMinutes === v) return
  _varianceMinutes = v
  notify()
}

export function seedPlan(topics: Topic[], arrivalLabel: string): void {
  let changed = false
  if (_flightTopics !== topics) { _flightTopics = topics; changed = true }
  if (_flightArrivalLabel !== arrivalLabel) { _flightArrivalLabel = arrivalLabel; changed = true }
  if (changed) notify()
}

export function resetTimer(): void {
  _departureTime = null
  _actualWaypointTimes = []
  _actualArrivalTime = null
  _varianceMinutes = null
  notify()
}

export function resetFlightPlan(): void {
  _flightTopics = null
  _flightArrivalLabel = 'ARRIVAL'
  resetTimer()  // resetTimer also calls notify
}

export function subscribe(fn: () => void): () => void {
  _subscribers.add(fn)
  return () => { _subscribers.delete(fn) }
}
