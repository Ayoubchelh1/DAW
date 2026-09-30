import { tracks } from './data/track';
import type { Track } from './interface/track';
import './style.css';
import { crearCerca } from './view/cerca/cerca';
import { crearTitol } from './view/creartitol';

import { crearTableSongs } from './view/tableSongs/crearTableSongs';
import { llistaCancons } from './view/tableSongs/llistaCancons';

const appObj: HTMLElement = document.querySelector<HTMLDivElement>('#app')!;
const tbody: HTMLTableSectionElement = document.createElement("tbody");
const div: HTMLDivElement = document.createElement("div");

const mostrarSeleccio: (track: Track) => void = (track: Track) => {
    console.log(track.id);
    const info: HTMLDivElement = document.createElement("div");
    info.textContent = `${track.title} - ${track.artist}`;

    const tancar: HTMLButtonElement = document.createElement("button");
    tancar.textContent = "X";
    tancar.addEventListener("click", () => div.replaceChildren());

    div.replaceChildren(info, tancar);
};

const cercar: (textABuscar: string) => void = (textABuscar: string) => {
    const llistaTrack: Track[] = tracks.filter(
        (t: Track) => { return t.title.toLowerCase().includes(textABuscar.trim().toLowerCase()) }
    )
    tbody.innerHTML = "";
    llistaCancons(llistaTrack, tbody, mostrarSeleccio);
}


appObj.appendChild(crearTitol());
appObj.appendChild(crearCerca(cercar));
appObj.appendChild(crearTableSongs(tbody, mostrarSeleccio));
appObj.appendChild(div);








