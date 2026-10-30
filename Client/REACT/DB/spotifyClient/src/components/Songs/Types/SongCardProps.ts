import type { TrackView } from "./TrackView";


export interface SongCardProps {
    trackInfo: TrackView;
    play: () => void;
    reset: () => void;
    like: () => void;
}