import { playlistTracks } from "../data/playlistTrack/playlistTrack";
import { PlaylistTrackBD } from "../interfaces/playlistTrack/playlistTrackBD";

export function getAllPlaylistTracks(): PlaylistTrackBD[] {
    return playlistTracks;
}

export function getPlaylistTrackById(idPlaylistTrack: string): PlaylistTrackBD | undefined {
    return playlistTracks.find((playlistTrack: PlaylistTrackBD) => playlistTrack.id === idPlaylistTrack);
}