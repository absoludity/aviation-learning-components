import '../demo/shared.css'
import { renderSidebar } from '../demo/sidebar.js'
import '../src/components/FourForces'

renderSidebar('four-forces')

const toggle = document.getElementById('banking-toggle')
const element = document.querySelector('four-forces')
toggle.addEventListener('change', () => {
  if (toggle.checked) element.setAttribute('banking', '')
  else element.removeAttribute('banking')
})
