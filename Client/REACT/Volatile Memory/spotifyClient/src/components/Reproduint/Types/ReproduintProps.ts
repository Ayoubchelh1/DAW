export interface ReproduintProps {
    volum: number;
    pujarVolum: () => void;
    baixarVolum: () => void;
    playingSongTitle: string | null;
    stopPlaying: () => void;
}
