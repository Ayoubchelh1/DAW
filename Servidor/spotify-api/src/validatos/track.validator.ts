import { Track } from "../interfaces/track/track";
import { MAXARTIST, MAXTITOL } from "../interfaces/track/track.constants";


export function isValidTrack(track: unknown): track is Track {
    if (typeof track !== "object" || track === null) {
        return false;
    }

    const candidate = track as { title?: unknown; artist?: unknown; duration?: unknown };
    if (
        typeof candidate.title !== "string" ||
        typeof candidate.artist !== "string" ||
        typeof candidate.duration !== "number" ||
        !Number.isFinite(candidate.duration)
    ) {
        return false;
    }

    const longTitol: number = candidate.title.trim().replace(/\s+/g, " ").length;
    const longArtist: number = candidate.artist.trim().replace(/\s+/g, " ").length;


    if (longArtist === 0 || longArtist > MAXARTIST) {
        return false;
    }
    if (longTitol === 0 || longTitol > MAXTITOL) {
        return false;
    }
    if (candidate.duration < 1) {
        return false;
    }


    return true;
}