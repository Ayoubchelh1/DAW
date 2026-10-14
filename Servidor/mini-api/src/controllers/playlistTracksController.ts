import { Request, Response } from "express";
import { PlaylistTrackBD } from "../interfaces/playlistTrack/playlistTrackBD";
import { getAllPlaylistTracks, getPlaylistTrackById } from "../Services/playlistTrackService";

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