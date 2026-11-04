import type { TrackView } from "./TrackView";


export interface SongCardProps {
    trackInfo: TrackView;
    play: () => void;
    isPlaying: boolean;
    reset: () => void;
    like: () => void;
}