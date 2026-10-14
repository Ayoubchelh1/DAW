import { Album } from "../interfaces/album/album";

export function isValidAlbum(album: Album): boolean {
    return Boolean(album)
        && typeof album.artistId === "string"
        && album.artistId.trim().length > 0
        && typeof album.date === "string"
        && album.date.trim().length > 0;
}
