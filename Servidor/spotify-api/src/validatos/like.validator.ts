import { Like } from "../interfaces/like/like";

export function isValidLike(like: Like): boolean {
    if (!like) {
        return false;
    }

    if (!like.user || !like.track) {
        return false;
    }

    if (like.likeTrack !== 1 && like.likeTrack !== -1) {
        return false;
    }

    return true;
}
