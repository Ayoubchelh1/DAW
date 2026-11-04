import type { TrackView } from "../Songs/Types/TrackView";

export interface PlaybackHistoryEntry {
    canco: TrackView;
    data: string;
}

const Historial = (props: { songs: PlaybackHistoryEntry[] }) => {
    return (
        <section className="song-list">
            <h2>Historial de reproduccions</h2>
            {props.songs.map((entry, index) => (
                <p className="history-entry" key={`${entry.canco.title}-${index}`}>
                    <span>{entry.canco.title}</span>
                    <span>{entry.data}</span>
                </p>
            ))}
        </section>
    );
};

export default Historial;
