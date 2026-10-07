import { randomUUID } from "crypto";
import { tracks } from "../data/track/track";
import { Track } from "../interfaces/track/track";
import { TrackBD } from "../interfaces/track/trackBD";
import { isValidTrack } from "../validatos/track.validator";

export function getAllTracks(): TrackBD[] {
    return tracks;
}

export function getTrackById(idTrack: string): TrackBD | undefined {

    return tracks.find((t: TrackBD) => { return t.id === idTrack; });
}

export function createTrack(track: Track): TrackBD {

    //if (!isValidTrack(track)) {
    //  return res.status(400).json({ message: "Invalid data" });
    //}

    const uuid: string = randomUUID()

    const trackRecord: TrackBD = {
        id: uuid,
        title: track.title.trim().replace(/\s+/g, " "),
        artist: track.artist.trim().replace(/\s+/g, " "),
        duration: track.duration
    };

    tracks.push(trackRecord);

    return trackRecord;

}