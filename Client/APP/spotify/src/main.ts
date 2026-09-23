import './style.css'
import { tracks } from './data/track'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Spotify<h1>
  <p>${tracks[0].title}</p>
`


