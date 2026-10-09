import { Response, Request } from "express";
import { createArtist, getAllArtists, getArtistById, updateArtist } from "../Services/artistService";
import { ArtistBD } from "../interfaces/artist/artistBD";
import { artists } from "../data/artist/artist";
import { ArtistInvalidData } from "../interfaces/error/artistInvalidData";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";

export function getAllArtistController(_req: Request, res: Response): Response {
    return res.status(200).json(getAllArtists());
}

export function getArtistsByIdController(req: Request, res: Response): Response {
    const idArtist: string = req.params.id as string;
    const artist: ArtistBD | undefined = getArtistById(idArtist);
    if (!artist) {
        return res.status(404).json({ message: `Artist ${idArtist} not found` });
    }
    return res.status(200).json(artist);
}

export function postArtistsController(req: Request, res: Response): Response {
    const result: CreateSuccessService<ArtistBD> | ArtistInvalidData = createArtist(req.body);
    if (!result.success) {
        const errorResult = result as ArtistInvalidData;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<ArtistBD>;
    artists.push(createResult.data);
    return res.status(createResult.code).json(createResult);
}

export function putArtistsController(req: Request, res: Response): Response {
    const idArtist: string = req.params.id as string;

    const result: UpdateSuccessService<ArtistBD> | ArtistInvalidData = updateArtist(idArtist, req.body);
    if (!result.success) {
        const errorResult = result as ArtistInvalidData;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<ArtistBD>;
    artists[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
}