import type { Track } from "../interface/track";

export function showCard(track: Track, div: HTMLDivElement): void {

    div.textContent = `${track.title} - ${track.artist}`;

    const tancar: HTMLButtonElement = document.createElement("button");
    tancar.textContent = "X";
    tancar.addEventListener("click", () => {
        div.textContent = " ";
    });

    div.appendChild(tancar);
};
