import { tracks } from "../../data/track";
import { createTableHead } from "./createTableHead";
import { llistaCancons } from "./llistaCancons";

export function crearTableSongs(): HTMLTableElement {
    const table: HTMLTableElement = document.createElement("table");
    table.appendChild(createTableHead());
    const tbody: HTMLTableSectionElement = document.createElement("tbody");
    llistaCancons(tracks, tbody);
    table.appendChild(tbody);
    return table;
}