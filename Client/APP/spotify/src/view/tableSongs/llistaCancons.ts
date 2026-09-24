
import type { Track } from "../../interface/track";
import { createRowSong } from "../rowView";

export function llistaCancons(tracks: Track[], tbody: HTMLTableSectionElement) {

    tracks.forEach(
        (t: Track) => { tbody.appendChild(createRowSong(t)); }
    );
}