import { randomUUID } from "crypto";
import { playlists } from "../data/playlist/playlist";
import { users } from "../data/user/user";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { Playlist } from "../interfaces/playlist/playlist";
import { PlaylistBD } from "../interfaces/playlist/playlistBD";
import { UserBD } from "../interfaces/user/userBD";
import { isValidPlaylist } from "../validatos/playlist.validator";

export function getAllPlaylists(): PlaylistBD[] {
    return playlists;
}

export function getPlaylistById(idPlaylist: string): PlaylistBD | undefined {
    return playlists.find((playlist: PlaylistBD) => playlist.id === idPlaylist);
}

export function createPlaylist(playlist: Playlist): CreateSuccessService<PlaylistBD> | ErrorService {
    if (!isValidPlaylist(playlist)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const userId: string = playlist.userId.trim();
    const userExists: boolean = users.some((user: UserBD) => user.id === userId);
    if (!userExists) {
        return { success: false, code: 404, message: `User ${userId} not found` };
    }

    const playlistRecord: PlaylistBD = {
        id: randomUUID(),
        title: playlist.title.trim().replace(/\s+/g, " "),
        userId
    };

    return { success: true, code: 201, data: playlistRecord };
}

export function updatePlaylist(idPlaylist: string, playlist: Playlist): UpdateSuccessService<PlaylistBD> | ErrorService {
    const playlistIndex: number = playlists.findIndex((item: PlaylistBD) => item.id === idPlaylist);
    if (playlistIndex === -1) {
        return { success: false, code: 404, message: "Playlist not found" };
    }

    if (!isValidPlaylist(playlist)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const userId: string = playlist.userId.trim();
    const userExists: boolean = users.some((user: UserBD) => user.id === userId);
    if (!userExists) {
        return { success: false, code: 404, message: `User ${userId} not found` };
    }

    const updatedPlaylist: PlaylistBD = {
        id: idPlaylist,
        title: playlist.title.trim().replace(/\s+/g, " "),
        userId
    };

    return { success: true, code: 200, data: updatedPlaylist, index: playlistIndex };
}

export function deletePlaylist(idPlaylist: string): DeleteSuccessService | ErrorService {
    const playlistIndex: number = playlists.findIndex((playlist: PlaylistBD) => playlist.id === idPlaylist);
    if (playlistIndex === -1) {
        return { success: false, code: 404, message: "Playlist not found" };
    }

    return { success: true, code: 204, index: playlistIndex };
}