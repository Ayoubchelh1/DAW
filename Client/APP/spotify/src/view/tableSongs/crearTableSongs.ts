import { tracks } from "../../data/track";
import { createTableHead } from "./createTableHead";
import { llistaCancons } from "./llistaCancons";

export function crearTableSongs(tbody: HTMLTableSectionElement): HTMLTableElement {
    const table: HTMLTableElement = document.createElement("table");
    table.appendChild(createTableHead());
    llistaCancons(tracks, tbody);
    table.appendChild(tbody);
    return table;
}