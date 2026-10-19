import { randomUUID } from "crypto";
import { tracks } from "../data/track/track";
import { Track } from "../interfaces/track/track";
import { TrackBD } from "../interfaces/track/trackBD";
import { isValidTrack } from "../validatos/track.validator";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ConnectionPool, IResult } from "mssql";
import { getConnection } from "../config/database";
import sql from "mssql";


export async function getAllTracks(): Promise<TrackBD[]> {
    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();

    const queryText: string = 'Select * from Track';

    const result: IResult<TrackBD> = await request.query(queryText);
    return result.recordset;
}

export async function getTrackById(idTrack: string): Promise<TrackBD | undefined> {

    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();

    const queryText: string = 'Select * from Track Where Track.id = @id';
    request.input("id", sql.UniqueIdentifier, idTrack);

    const result: IResult<TrackBD> = await request.query(queryText);

    console.log(result);
    return result.recordset;

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

export function updateTrack(idTrack: string, track: Track): UpdateSuccessService<TrackBD> | ErrorService {
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



    return { success: true, code: 200, data: updatedTrack, index: trackIndex };
}

export function deleteTrack(idTrack: string): DeleteSuccessService | ErrorService {

    const trackIndex: number = tracks.findIndex((track: TrackBD) => track.id === idTrack)

    if (trackIndex === -1) {
        return { success: false, code: 404, message: "Track not found" };
    }


    return { success: true, code: 204, index: trackIndex };
}