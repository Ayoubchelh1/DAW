import './style.css'
import { tracks } from './data/track'
import { createRowSong } from './view/rowView';
import { createTableHead } from './view/tableSongs/createTableHead';

const appObj: HTMLElement = document.querySelector<HTMLDivElement>('#app')!;
const titol: HTMLHeadElement = document.createElement("h1");
const table: HTMLTableElement = document.createElement("table");
titol.textContent = "Spotify";

table.appendChild(createTableHead());


const rowSong: HTMLTableRowElement = createRowSong(tracks[0]);

appObj.appendChild(titol);

table.appendChild(rowSong);

appObj.appendChild(table);




