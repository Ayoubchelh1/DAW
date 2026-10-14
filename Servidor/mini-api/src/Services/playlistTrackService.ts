import { randomUUID } from "crypto";
import { playlistTracks } from "../data/playlistTrack/playlistTrack";
import { playlists } from "../data/playlist/playlist";
import { tracks } from "../data/track/track";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { PlaylistTrack } from "../interfaces/playlistTrack/playlistTrack";
import { PlaylistTrackBD } from "../interfaces/playlistTrack/playlistTrackBD";
import { isValidPlaylistTrack } from "../validatos/playlistTrack.validator";

export function getAllPlaylistTracks(): PlaylistTrackBD[] {
    return playlistTracks;
}

export function getPlaylistTrackById(idPlaylistTrack: string): PlaylistTrackBD | undefined {
    return playlistTracks.find((playlistTrack: PlaylistTrackBD) => playlistTrack.id === idPlaylistTrack);
}

export function createPlaylistTrack(playlistTrack: PlaylistTrack): CreateSuccessService<PlaylistTrackBD> | ErrorService {
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

    return { success: true, code: 201, data: playlistTrackRecord };
}