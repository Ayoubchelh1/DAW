export interface Track {

    title: string;
    artist: string;
    duration: {
        minutes: number;
        seconds: number;
        miliseconds?: number;
    };
}