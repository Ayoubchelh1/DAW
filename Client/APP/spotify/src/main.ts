import './style.css'
import { tracks } from './data/track'

const appObj: HTMLElement = document.querySelector<HTMLDivElement>('#app')!;

const table: HTMLTableElement = document.createElement("table");

const rowSong: HTMLTableRowElement = createRowSong(tracks[0]);

table.appendChild(rowSong);

appObj.appendChild(table);


