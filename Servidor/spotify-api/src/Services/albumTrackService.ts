import { randomUUID } from "crypto";
import { albumTracks } from "../data/albumTrack/albumTrack";
import { albums } from "../data/album/album";
import { tracks } from "../data/track/track";
import { AlbumTrack } from "../interfaces/albumTrack/albumTrack";
import { AlbumTrackBD } from "../interfaces/albumTrack/albumTrackBD";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { isValidAlbumTrack } from "../validatos/albumTrack.validator";

export function createAlbumTrack(albumTrack: AlbumTrack): CreateSuccessService<AlbumTrackBD> | ErrorService {
    if (!isValidAlbumTrack(albumTrack)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const albumId: string = albumTrack.albumId.trim();
    const trackId: string = albumTrack.trackId.trim();

    if (!albums.some((album) => album.id === albumId)) {
        return { success: false, code: 404, message: `Album ${albumId} not found` };
    }
    if (!tracks.some((track) => track.id === trackId)) {
        return { success: false, code: 404, message: `Track ${trackId} not found` };
    }

    const albumTrackRecord: AlbumTrackBD = {
        id: randomUUID(),
        albumId,
        trackId
    };

    return { success: true, code: 201, data: albumTrackRecord };
}

export function deleteAlbumTrack(idAlbumTrack: string): DeleteSuccessService | ErrorService {
    const albumTrackIndex: number = albumTracks.findIndex(
        (albumTrack: AlbumTrackBD) => albumTrack.id === idAlbumTrack
    );
    if (albumTrackIndex === -1) {
        return { success: false, code: 404, message: "AlbumTrack not found" };
    }

    return { success: true, code: 204, index: albumTrackIndex };
}
