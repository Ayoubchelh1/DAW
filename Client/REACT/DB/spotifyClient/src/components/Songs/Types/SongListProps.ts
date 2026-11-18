import type { GETTrack } from "../../../APIManagement/Tracks/Interfaces/Track";
import type { Track } from "../../../Model/Track";


export interface SongListProps {
    tracks: GETTrack[];
    edit: (t: Track) => void;
    playTrack: (track: GETTrack) => void;

}