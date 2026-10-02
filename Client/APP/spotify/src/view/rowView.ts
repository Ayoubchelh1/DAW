
import type { Track } from "../interface/track";

let lastPlayButton: HTMLButtonElement | null = null;

export function createRowSong(track: Track, onSelect: (track: Track) => void): HTMLTableRowElement {

    const songtr: HTMLTableRowElement = document.createElement("tr");

    const titleTd: HTMLTableCellElement = document.createElement("td");
    titleTd.textContent = track.title;
    titleTd.addEventListener("click", () => onSelect(track));

    const durationTd: HTMLTableCellElement = document.createElement("td");
    durationTd.textContent = track.duration.toString();
    durationTd.addEventListener("click", () => onSelect(track));

    const reproduccionsTd: HTMLTableCellElement = document.createElement("td");
    reproduccionsTd.textContent = track.reproduccions.toString();


    const playTd: HTMLTableCellElement = document.createElement("td");
    const playBoto: HTMLButtonElement = document.createElement("button");
    playBoto.type = "button";
    playBoto.textContent = "Play";

    playBoto.addEventListener("click", () => {
        if (lastPlayButton === playBoto) {
            playBoto.textContent = "Play";
            lastPlayButton = null;
            return;
        }

        if (lastPlayButton !== null) {
            lastPlayButton.textContent = "Play";
        }

        track.reproduccions += 1;
        reproduccionsTd.textContent = track.reproduccions.toString();
        playBoto.textContent = "Playing";
        lastPlayButton = playBoto;
    });


    playTd.appendChild(playBoto);
    songtr.appendChild(titleTd);
    songtr.appendChild(durationTd);
    songtr.appendChild(reproduccionsTd);
    songtr.appendChild(playTd);

    return songtr;

}
