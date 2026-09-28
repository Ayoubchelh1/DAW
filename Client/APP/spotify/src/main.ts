import { tracks } from './data/track';
import type { Track } from './interface/track';
import './style.css';
import { crearCerca } from './view/cerca/cerca';
import { crearTitol } from './view/creartitol';
import { crearTableSongs } from './view/tableSongs/crearTableSongs';
import { llistaCancons } from './view/tableSongs/llistaCancons';

const appObj: HTMLElement = document.querySelector<HTMLDivElement>('#app')!;
const tbody: HTMLTableSectionElement = document.createElement("tbody");


const cercar: (textABuscar: string) => void = (textABuscar: string) => {
    const llistaTrack: Track[] = tracks.filter(
        (t: Track) => { return t.title.toLowerCase().includes(textABuscar.trim().toLowerCase()) }
    )
    tbody.innerHTML = "";
    llistaCancons(llistaTrack, tbody);
}

appObj.appendChild(crearTitol());
appObj.appendChild(crearCerca(cercar));
appObj.appendChild(crearTableSongs(tbody));









