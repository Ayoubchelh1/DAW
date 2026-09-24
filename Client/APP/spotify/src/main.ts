import './style.css';
import { crearCerca } from './view/cerca/cerca';
import { crearTitol } from './view/creartitol';
import { crearTableSongs } from './view/tableSongs/crearTableSongs';

const appObj: HTMLElement = document.querySelector<HTMLDivElement>('#app')!;


appObj.appendChild(crearTitol());
appObj.appendChild(crearTableSongs());
appObj.appendChild(crearCerca());








