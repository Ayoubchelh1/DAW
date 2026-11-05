import type { GETTrack } from "../../../APIManagement/Tracks/Interfaces/Track";


export interface SongListProps {
    tracks: GETTrack[];
    playTrack: (track: GETTrack) => void;
}