import { tracks } from "../data/track/track";
import { TrackBD } from "../interfaces/track/trackBD";

export function getAllTracks(): TrackBD[] {
    return tracks;
}   