import './style.css';
import { crearTitol } from './view/creartitol';
import { crearTableSongs } from './view/tableSongs/crearTableSongs';

const appObj: HTMLElement = document.querySelector<HTMLDivElement>('#app')!;

const titol: HTMLHeadElement = crearTitol();
const table: HTMLTableElement = crearTableSongs();
const form: HTMLFormElement = crearCerca();

appObj.appendChild(titol);

appObj.appendChild(table);








