import { randomUUID } from "crypto";
import { artists } from "../data/artist/artist";
import { albums } from "../data/album/album";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { Album } from "../interfaces/album/album";
import { AlbumBD } from "../interfaces/album/albumBD";
import { isValidAlbum } from "../validatos/album.validator";

export function getAllAlbums(): AlbumBD[] {
    return albums;
}

export function getAlbumById(idAlbum: string): AlbumBD | undefined {
    return albums.find((album: AlbumBD) => album.id === idAlbum);
}

export function createAlbum(album: Album): CreateSuccessService<AlbumBD> | ErrorService {
    if (!isValidAlbum(album)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const artistId: string = album.artistId.trim();
    if (!artists.some((artist) => artist.id === artistId)) {
        return { success: false, code: 404, message: `Artist ${artistId} not found` };
    }

    const albumRecord: AlbumBD = {
        id: randomUUID(),
        artistId,
        date: album.date.trim()
    };

    return { success: true, code: 201, data: albumRecord };
}
