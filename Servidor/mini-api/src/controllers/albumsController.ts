import { Request, Response } from "express";
import { albums } from "../data/album/album";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { Album } from "../interfaces/album/album";
import { AlbumBD } from "../interfaces/album/albumBD";
import { createAlbum, deleteAlbum, getAlbumById, getAllAlbums, updateAlbum } from "../Services/albumService";

export function getAllAlbumsController(_req: Request, res: Response): Response {
    return res.status(200).json(getAllAlbums());
}

export function getAlbumByIdController(req: Request, res: Response): Response {
    const album: AlbumBD | undefined = getAlbumById(req.params.id as string);
    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }
    return res.status(200).json(album);
}

export function postAlbumController(req: Request, res: Response): Response {
    const result: CreateSuccessService<AlbumBD> | ErrorService = createAlbum(req.body as Album);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<AlbumBD>;
    albums.push(createResult.data);
    return res.status(createResult.code).json(createResult.data);
}

export function putAlbumController(req: Request, res: Response): Response {
    const idAlbum: string = req.params.id as string;
    const result: UpdateSuccessService<AlbumBD> | ErrorService = updateAlbum(idAlbum, req.body as Album);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<AlbumBD>;
    albums[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
}

export function deleteAlbumController(req: Request, res: Response): Response {
    const idAlbum: string = req.params.id as string;
    const result: DeleteSuccessService | ErrorService = deleteAlbum(idAlbum);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const deleteResult = result as DeleteSuccessService;
    albums.splice(deleteResult.index, 1);
    return res.status(deleteResult.code).send();
}
