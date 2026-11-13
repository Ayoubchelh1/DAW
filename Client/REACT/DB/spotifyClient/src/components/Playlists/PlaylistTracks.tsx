import type { GETTrack } from "../../APIManagement/Tracks/Interfaces/Track";

interface PlaylistTracksProps {
    playlistId: string;
    playlistTitle: string;
    tracks: GETTrack[];
    error: string | null;
    loading: boolean;
}

function PlaylistTracks({ playlistId, playlistTitle, tracks, error, loading }: PlaylistTracksProps) {
    return (
        <section
            className="playlist-tracks"
            id={`playlist-tracks-${playlistId}`}
            aria-labelledby={`playlist-tracks-title-${playlistId}`}
        >
            <h3 id={`playlist-tracks-title-${playlistId}`}>{playlistTitle}</h3>
            {error ? (
                <p role="alert">{error}</p>
            ) : loading ? (
                <p>Carregant...</p>
            ) : tracks.length > 0 ? (
                <ul>
                    {tracks.map((track) => (
                        <li key={track.id}>{track.title} - {track.artist}</li>
                    ))}
                </ul>
            ) : (
                <p>Aquesta llista no té cançons.</p>
            )}
        </section>
    );
}

export default PlaylistTracks;
