
import type { Track } from "../interface/track";

export function mostrarIdCanco(track: Track): string {
    return track.id;
}

export function createRowSong(track: Track): HTMLTableRowElement {

    const songtr: HTMLTableRowElement = document.createElement("tr");

    const titleTd: HTMLTableCellElement = document.createElement("td");
    titleTd.textContent = track.title;
    titleTd.addEventListener("click", () => console.log(mostrarIdCanco(track)));

    const durationTd: HTMLTableCellElement = document.createElement("td");
    durationTd.textContent = track.duration.toString();
    durationTd.addEventListener("click", () => console.log(mostrarIdCanco(track)));

    songtr.appendChild(titleTd);
    songtr.appendChild(durationTd);

    return songtr;

}
