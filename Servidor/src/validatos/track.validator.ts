import { Track } from "../interfaces/track/track";

export function isValidTrack(track: Track): boolean {


    if (!track.artist || !track.title || !track.duration) {
        return false;
    }

    if (track.artist.trim().length === 0 || track.title.trim().length === 0 || track.duration <= 0) {
        return false;
    }


    return true;
}