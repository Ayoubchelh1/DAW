export interface Track {
    id: string;
    title: string;
    artist: string;
    duration: {
        minutes: number;
        seconds: number;
        miliseconds?: number;
    };
}