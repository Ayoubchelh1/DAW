import { randomUUID } from "crypto";
import { playlistTracks } from "../data/playlistTrack/playlistTrack";
import { playlists } from "../data/playlist/playlist";
import { tracks } from "../data/track/track";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { PlaylistTrack } from "../interfaces/playlistTrack/playlistTrack";
import { PlaylistTrackBD } from "../interfaces/playlistTrack/playlistTrackBD";
import { TrackBD } from "../interfaces/track/trackBD";
import { isValidPlaylistTrack } from "../validatos/playlistTrack.validator";
import { ConnectionPool, IResult } from "mssql";
import { getConnection } from "../config/database";
import sql from "mssql";

export function getAllPlaylistTracks(): PlaylistTrackBD[] {
    return playlistTracks;
}

export async function getTracksInPlaylist(playlistId: string): Promise<TrackBD[]> {
    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();
    request.input("playlistId", sql.UniqueIdentifier, playlistId);

    const queryText: string =
        "SELECT t.id, t.title, a.name AS artist, t.duration " +
        "FROM PlaylistTracks pt " +
        "INNER JOIN Track t ON pt.track_id = t.id " +
        "INNER JOIN Artist a ON t.artist_id = a.id " +
        "WHERE pt.playlist_id = @playlistId";

    const result: IResult<TrackBD> = await request.query(queryText);
    return result.recordset;
}

export function getPlaylistTrackById(idPlaylistTrack: string): PlaylistTrackBD | undefined {
    return playlistTracks.find((playlistTrack: PlaylistTrackBD) => playlistTrack.id === idPlaylistTrack);
}

export function createPlaylistTrack(playlistTrack: PlaylistTrack): CreateSuccessService | ErrorService {
    if (!isValidPlaylistTrack(playlistTrack)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const playlistId: string = playlistTrack.playlistId.trim();
    const trackId: string = playlistTrack.trackId.trim();

    if (!playlists.some((playlist) => playlist.id === playlistId)) {
        return { success: false, code: 404, message: `Playlist ${playlistId} not found` };
    }
    if (!tracks.some((track) => track.id === trackId)) {
        return { success: false, code: 404, message: `Track ${trackId} not found` };
    }

    const playlistTrackRecord: PlaylistTrackBD = {
        id: randomUUID(),
        playlistId,
        trackId
    };

    return { success: true, code: 201, data: 1 };
}

export function deletePlaylistTrack(idPlaylistTrack: string): DeleteSuccessService | ErrorService {
    const playlistTrackIndex: number = playlistTracks.findIndex(
        (playlistTrack: PlaylistTrackBD) => playlistTrack.id === idPlaylistTrack
    );
    if (playlistTrackIndex === -1) {
        return { success: false, code: 404, message: "PlaylistTrack not found" };
    }

    return { success: true, code: 204 };
}