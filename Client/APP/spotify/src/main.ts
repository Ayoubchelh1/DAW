import './style.css'
import { tracks } from './data/track'
import { createRowSong } from './view/rowView';

const appObj: HTMLElement = document.querySelector<HTMLDivElement>('#app')!;
const titol: HTMLHeadElement = document.createElement("h1");
titol.textContent = "Spotify";

const table: HTMLTableElement = document.createElement("table");

const rowSong: HTMLTableRowElement = createRowSong(tracks[0]);

appObj.appendChild(titol);

table.appendChild(rowSong);

appObj.appendChild(table);


