import { tracks } from "../data/track/track";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { TrackBD } from "../interfaces/track/trackBD";
import { createTrack, deleteTrack, getAllTracks, getTrackById, updateTrack } from "../Services/trackService";
import { Response, Request } from "express";

export function getAllTracksController(_req: Request, res: Response): Response {
    return res.status(200).json(getAllTracks());
}

export function getTrackByIdController(req: Request, res: Response): Response {
    const findTrack: TrackBD | undefined = getTrackById(req.params.id as string);
    if (!findTrack) {
        return res.status(404).json({ message: `Track not found` });
    }
    return res.status(200).json(findTrack);
}

export function postTrackController(req: Request, res: Response): Response {
    const result: CreateSuccessService<TrackBD> | ErrorService = createTrack(req.body);

    if (!result.success) {
        const errorResult = result as ErrorService
        return res.status(errorResult.code).json({ message: errorResult.message })
    }

    tracks.push((result as CreateSuccessService<TrackBD>).data);
    return res.status(result.code).json(result);
}

export function putTrackController(req: Request, res: Response): Response {
    const idTrack: string = req.params.id as string;

    const result: UpdateSuccessService<TrackBD> | ErrorService = updateTrack(idTrack, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<TrackBD>;
    tracks[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
}

export function deleteTracksController(req: Request, res: Response): Response {
    const result: DeleteSuccessService | ErrorService = deleteTrack(req.params.id as string);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const index: number = (result as DeleteSuccessService).index;
    tracks.splice(index, 1)

    return res.status(result.code).json({ result });
}