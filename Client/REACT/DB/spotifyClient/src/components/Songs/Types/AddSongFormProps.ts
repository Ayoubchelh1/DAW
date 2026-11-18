import type { TrackCreate } from "../../../APIManagement/Tracks/Interfaces/TrackCreate";
import type { Track } from "../../../Model/Track";

export interface AddSongFormProps {
    song?: Track;
    submit: (t: TrackCreate) => void;
}