import { Request, Response } from "express";
import { albumTracks } from "../data/albumTrack/albumTrack";
import { AlbumTrack } from "../interfaces/albumTrack/albumTrack";
import { AlbumTrackBD } from "../interfaces/albumTrack/albumTrackBD";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { createAlbumTrack, deleteAlbumTrack } from "../Services/albumTrackService";

export function postAlbumTrackController(req: Request, res: Response): Response {
    const result: CreateSuccessService<AlbumTrackBD> | ErrorService =
        createAlbumTrack(req.body as AlbumTrack);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<AlbumTrackBD>;
    albumTracks.push(createResult.data);
    return res.status(createResult.code).json(createResult.data);
}

export function deleteAlbumTrackController(req: Request, res: Response): Response {
    const result: DeleteSuccessService | ErrorService = deleteAlbumTrack(req.params.id as string);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const deleteResult = result as DeleteSuccessService;
    albumTracks.splice(deleteResult.index, 1);
    return res.status(deleteResult.code).send();
}
