import { albums } from "../data/album/album";
import { AlbumBD } from "../interfaces/album/albumBD";

export function getAllAlbums(): AlbumBD[] {
    return albums;
}

export function getAlbumById(idAlbum: string): AlbumBD | undefined {
    return albums.find((album: AlbumBD) => album.id === idAlbum);
}
