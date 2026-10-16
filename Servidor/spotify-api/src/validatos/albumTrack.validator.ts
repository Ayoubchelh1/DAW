import { AlbumTrack } from "../interfaces/albumTrack/albumTrack";

export function isValidAlbumTrack(albumTrack: AlbumTrack): boolean {
    return Boolean(albumTrack)
        && typeof albumTrack.albumId === "string"
        && albumTrack.albumId.trim().length > 0
        && typeof albumTrack.trackId === "string"
        && albumTrack.trackId.trim().length > 0;
}
