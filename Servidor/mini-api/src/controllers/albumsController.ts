import { Request, Response } from "express";
import { albums } from "../data/album/album";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { Album } from "../interfaces/album/album";
import { AlbumBD } from "../interfaces/album/albumBD";
import { createAlbum, getAlbumById, getAllAlbums } from "../Services/albumService";

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
