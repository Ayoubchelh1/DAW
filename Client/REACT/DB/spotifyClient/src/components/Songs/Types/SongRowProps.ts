

export interface SongRowProps {
    title: string;
    artist: string;
    duration: number;
    totalLikes: number;
    play: () => void;
}