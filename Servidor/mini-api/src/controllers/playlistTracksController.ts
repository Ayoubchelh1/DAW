import { Request, Response } from "express";
import { playlistTracks } from "../data/playlistTrack/playlistTrack";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { PlaylistTrackBD } from "../interfaces/playlistTrack/playlistTrackBD";
import { createPlaylistTrack, getAllPlaylistTracks, getPlaylistTrackById } from "../Services/playlistTrackService";

export function getAllPlaylistTracksController(_req: Request, res: Response): Response {
    return res.status(200).json(getAllPlaylistTracks());
}

export function getPlaylistTrackByIdController(req: Request, res: Response): Response {
    const playlistTrack: PlaylistTrackBD | undefined = getPlaylistTrackById(req.params.id as string);
    if (!playlistTrack) {
        return res.status(404).json({ message: "PlaylistTrack not found" });
    }
    return res.status(200).json(playlistTrack);
}

export function postPlaylistTrackController(req: Request, res: Response): Response {
    const result: CreateSuccessService<PlaylistTrackBD> | ErrorService = createPlaylistTrack(req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<PlaylistTrackBD>;
    playlistTracks.push(createResult.data);
    return res.status(createResult.code).json(createResult.data);
}