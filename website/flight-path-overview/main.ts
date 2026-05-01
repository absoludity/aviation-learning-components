import '../demo/shared.css'
import { renderSidebar } from '../demo/sidebar'
import '../../src/components/FlightPathOverview'
import { setEstimatedTimes, resetTimer, resetFlightPlan } from '../../src/components/FlightPathOverview/sharedState'

renderSidebar('flight-path-overview')

const fpo = document.getElementById('fpo') as HTMLElement & { topics: unknown[] }
fpo.topics = [
  { label: 'Overview', time: 1 },
  { label: "Risk Analysis\nI'M SAFE & PAVE", time: 3 },
  { label: '"See and Avoid"\nOur joint responsibility', time: 2 },
  { label: 'Who has control', time: 2 },
  { label: "Today's Flight", time: 2 },
  { label: 'Recap and Fly', time: 2 },
]

const slider = document.getElementById('pos') as HTMLInputElement
const label = document.getElementById('posLabel') as HTMLElement
const prevButton = document.getElementById('prev') as HTMLButtonElement
const nextButton = document.getElementById('next') as HTMLButtonElement

function update(position: number): void {
  fpo.setAttribute('plane-position', String(position))
  slider.value = String(position)
  label.textContent = String(position)
}

slider.addEventListener('input', () => update(parseInt(slider.value, 10)))
prevButton.addEventListener('click', () => update(Math.max(0, parseInt(slider.value, 10) - 1)))
nextButton.addEventListener('click', () => update(Math.min(parseInt(slider.max, 10), parseInt(slider.value, 10) + 1)))

document.getElementById('startFlight')!.addEventListener('click', () => {
  setEstimatedTimes()
})
document.getElementById('resetTimer')!.addEventListener('click', () => {
  resetTimer()
  update(0)
})
document.getElementById('resetPlan')!.addEventListener('click', () => {
  resetFlightPlan()
  update(0)
})
