
import type { Track } from "../interface/track";

export function createRowSong(track: Track): HTMLTableRowElement {

    const songtr: HTMLTableRowElement = document.createElement("tr");

    const titleTd: HTMLTableCellElement = document.createElement("td");
    titleTd.textContent = track.title;
    titleTd.addEventListener("click", () => console.log(track.id));

    const durationTd: HTMLTableCellElement = document.createElement("td");
    durationTd.textContent = track.duration.toString();
    durationTd.addEventListener("click", () => console.log(track.id));

    songtr.appendChild(titleTd);
    songtr.appendChild(durationTd);

    return songtr;

}
