import { randomUUID } from "crypto";
import { tracks } from "../data/track/track";
import { Track } from "../interfaces/track/track";
import { TrackBD } from "../interfaces/track/trackBD";
import { isValidTrack } from "../validatos/track.validator";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { emplenarSuccesService } from "../interfaces/error/emplenarSuccessService";

export function getAllTracks(): TrackBD[] {
    return tracks;
}

export function getTrackById(idTrack: string): TrackBD | undefined {

    return tracks.find((t: TrackBD) => { return t.id === idTrack; });
}

export function createTrack(track: Track): CreateSuccessService<TrackBD> | ErrorService {

    if (!isValidTrack(track)) {
        return { success: false, code: 400, message: "invalid data" }
    }

    const uuid: string = randomUUID()

    const trackRecord: TrackBD = {
        id: uuid,
        title: track.title.trim().replace(/\s+/g, " "),
        artist: track.artist.trim().replace(/\s+/g, " "),
        duration: track.duration
    };


    return { success: true, code: 201, data: trackRecord };

}

export function updateTrack(idTrack: string, track: Track): emplenarSuccesService<TrackBD> | ErrorService {
    const trackIndex: number = tracks.findIndex((track: TrackBD) => track.id === idTrack);
    if (trackIndex === -1) {
        return { success: false, code: 404, message: "Track not found" };
    }

    if (!isValidTrack(track)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const updatedTrack: TrackBD = {
        id: idTrack,
        title: track.title.trim().replace(/\s+/g, " "),
        artist: track.artist.trim().replace(/\s+/g, " "),
        duration: track.duration
    };



    return { success: true, code: 200, data: updatedTrack, trackindex: trackIndex };
}