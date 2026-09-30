import type { Track } from "../../interface/track";
import { tracks } from "../../data/track";
import { createTableHead } from "./createTableHead";
import { llistaCancons } from "./llistaCancons";

export function crearTableSongs(
    tbody: HTMLTableSectionElement,
    onSelect: (track: Track) => void
): HTMLTableElement {
    const table: HTMLTableElement = document.createElement("table");
    table.appendChild(createTableHead());
    llistaCancons(tracks, tbody, onSelect);
    table.appendChild(tbody);
    return table;
}