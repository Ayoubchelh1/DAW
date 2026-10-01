
import type { Track } from "../interface/track";

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
    const initialPlayText = playBoto.textContent;
    let isPlaying = false;
    playBoto.addEventListener("click", () => {
        if (isPlaying) {
            isPlaying = false;
            playBoto.textContent = initialPlayText;
            return;
        }

        isPlaying = true;
        track.reproduccions += 1;
        reproduccionsTd.textContent = track.reproduccions.toString();
        playBoto.textContent = "Playing";
    });


    playTd.appendChild(playBoto);
    songtr.appendChild(titleTd);
    songtr.appendChild(durationTd);
    songtr.appendChild(reproduccionsTd);
    songtr.appendChild(playTd);

    return songtr;

}
