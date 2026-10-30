import type { Like } from "./Like";

export interface TrackView {
    title: string;
    artist: string;
    duration: number;
    reproduccions: number;
    likes: Like;
}