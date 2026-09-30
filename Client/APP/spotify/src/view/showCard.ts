import type { Track } from "../interface/track";

export function showCard(track: Track, div: HTMLDivElement): void {
    // const div: HTMLDivElement = document.createElement("div");
    div.textContent = `${track.title} - ${track.artist}`;

    const tancar: HTMLButtonElement = document.createElement("button");
    tancar.textContent = "X";
    tancar.addEventListener("click", () => {
        div.textContent = " ";
    });

    div.appendChild(tancar);
};
