import { Request, Response } from "express";
import { AlbumBD } from "../interfaces/album/albumBD";
import { getAlbumById, getAllAlbums } from "../Services/albumService";

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
