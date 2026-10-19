import { tracks } from "../data/track/track";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { SelectSuccessService } from "../interfaces/error/SelectSuccessService copy";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { TrackBD } from "../interfaces/track/trackBD";
import { createTrack, deleteTrack, getAllTracks, getTrackById, updateTrack } from "../Services/trackService";
import { Response, Request } from "express";

export async function getAllTracksController(_req: Request, res: Response): Promise<Response> {
    const tracks: TrackBD[] = await getAllTracks();
    return res.status(200).json(tracks);
}

export async function getTrackByIdController(req: Request, res: Response): Promise<Response> {
    const result: SelectSuccessService<TrackBD> | ErrorService = await getTrackById(req.params.id as string);


    if (!result.success) {
        return res.status(result.code).json({ message: (result as ErrorService).message });
    }

    return res.status(result.code).json(result);

}

export async function postTrackController(req: Request, res: Response): Promise<Response> {
    const result: CreateSuccessService<TrackBD> | ErrorService = await createTrack(req.body);

    if (!result.success) {
        const errorResult = result as ErrorService
        return res.status(errorResult.code).json({ message: errorResult.message })
    }


    return res.status(result.code).json(result);
}

export async function updateTrackController(req: Request, res: Response): Promise<Response> {
    const result: UpdateSuccessService<number> | ErrorService = await updateTrack(req.params.id as string, req.body);;

    if (!result.success) {
        const errorResult = result as ErrorService
        return res.status(errorResult.code).json({ message: errorResult.message })
    }


    return res.status(result.code).json(result);
}

export async function deleteTracksController(req: Request, res: Response): Promise<Response> {
    const result: DeleteSuccessService | ErrorService = await deleteTrack(req.params.id as string,);;

    if (!result.success) {
        const errorResult = result as ErrorService
        return res.status(errorResult.code).json({ message: errorResult.message })
    }


    return res.status(result.code).send();
}