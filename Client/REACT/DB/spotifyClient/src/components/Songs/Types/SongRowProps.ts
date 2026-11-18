import type { Track } from "../../../Model/Track";


export interface SongRowProps {
    title: string;
    id: string;
    artist: string;
    artist_id: string;
    duration: number;
    totalLikes: number;
    edit: (t: Track) => void;
    play: () => void;
}