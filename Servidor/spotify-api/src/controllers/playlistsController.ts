import { playlists } from "../data/playlist/playlist";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { PlaylistBD } from "../interfaces/playlist/playlistBD";
import { createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, updatePlaylist } from "../Services/playlistService";
import { Response, Request } from "express";

export function getAllPlaylistsController(_req: Request, res: Response): Response {
    return res.status(200).json(getAllPlaylists());
}

export function getPlaylistByIdController(req: Request, res: Response): Response {
    const idPlaylist: string = req.params.id as string;
    const playlist: PlaylistBD | undefined = getPlaylistById(idPlaylist);
    if (!playlist) {
        return res.status(404).json({ message: `Playlist ${idPlaylist} not found` });
    }
    return res.status(200).json(playlist);
}

export function postPlaylistController(req: Request, res: Response): Response {
    const result: CreateSuccessService<PlaylistBD> | ErrorService = createPlaylist(req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<PlaylistBD>;
    playlists.push(createResult.data);
    return res.status(createResult.code).json(createResult.data);
}

export function putPlaylistController(req: Request, res: Response): Response {
    const idPlaylist: string = req.params.id as string;
    const result: UpdateSuccessService<PlaylistBD> | ErrorService = updatePlaylist(idPlaylist, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<PlaylistBD>;
    playlists[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
}



export function deletePlaylistController(req: Request, res: Response): Response {
    const idPlaylist: string = req.params.id as string;
    const result: DeleteSuccessService | ErrorService = deletePlaylist(idPlaylist);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const index: number = (result as DeleteSuccessService).index;
    playlists.splice(index, 1);
    return res.status(result.code).send();
}