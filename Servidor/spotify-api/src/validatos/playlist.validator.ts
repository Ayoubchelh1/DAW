import { Playlist } from "../interfaces/playlist/playlist";

export function isValidPlaylist(playlist: Playlist): boolean {
    if (!playlist || typeof playlist.title !== "string" || typeof playlist.userId !== "string") {
        return false;
    }

    return playlist.title.trim().length > 0
        && playlist.userId.trim().length > 0;
}