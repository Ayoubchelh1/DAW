import { PlaylistTrack } from "../interfaces/playlistTrack/playlistTrack";

export function isValidPlaylistTrack(playlistTrack: PlaylistTrack): boolean {
    return Boolean(playlistTrack)
        && typeof playlistTrack.playlistId === "string"
        && playlistTrack.playlistId.trim().length > 0
        && typeof playlistTrack.trackId === "string"
        && playlistTrack.trackId.trim().length > 0;
}