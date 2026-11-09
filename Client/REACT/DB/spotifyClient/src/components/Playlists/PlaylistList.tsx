import { useState } from "react";
import type { GETPlaylist } from "../../APIManagement/Playlists/Interfaces/Playlist";
import type { GETTrack } from "../../APIManagement/Tracks/Interfaces/Track";
import { ENV } from "../../Config/env";

interface PlaylistListProps {
    playlists: GETPlaylist[];
    error: string | null;
}

function PlaylistList({ playlists, error }: PlaylistListProps) {
    const [selectedTracks, setSelectedTracks] = useState<GETTrack[]>([]);
    const [tracksError, setTracksError] = useState<string | null>(null);
    const [loadingTracks, setLoadingTracks] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

    async function selectPlaylist(playlistId: string) {
        if (selectedPlaylistId === playlistId) {
            setSelectedPlaylistId(null);
            return;
        }

        setSelectedPlaylistId(playlistId);
        setSelectedTracks([]);
        setTracksError(null);
        setLoadingTracks(true);

        try {
            const response = await fetch(`${ENV.API_BASE_URL}/playlisttracks/playlist/${playlistId}`);
            if (!response.ok) {
                throw new Error(`Error carregant les cançons (${response.status}).`);
            }

            const data: GETTrack[] = await response.json() as GETTrack[];
            setSelectedTracks(data);
        } catch {
            setTracksError("No s'han pogut carregar les cançons d'aquesta llista.");
        } finally {
            setLoadingTracks(false);
        }
    }

    return (
        <section className="playlist-list" aria-labelledby="playlist-list-title">
            <h2 id="playlist-list-title">Llistes de reproducció</h2>
            {error ? (
                <p role="alert">{error}</p>
            ) : playlists.length > 0 ? (
                <ul>
                    {playlists.map((playlist) => {
                        const isSelected = selectedPlaylistId === playlist.id;

                        return (
                            <li key={playlist.id}>
                                {playlist.title}{" "}
                                <button
                                    type="button"
                                    aria-expanded={isSelected}
                                    aria-controls={`playlist-tracks-${playlist.id}`}
                                    onClick={() => void selectPlaylist(playlist.id)}
                                >
                                    Select
                                </button>
                                {isSelected && (
                                    <div id={`playlist-tracks-${playlist.id}`}>
                                        {tracksError ? (
                                            <p role="alert">{tracksError}</p>
                                        ) : loadingTracks ? (
                                            <p>Carregant...</p>
                                        ) : selectedTracks.length > 0 ? (
                                            <ul>
                                                {selectedTracks.map((track) => (
                                                    <li key={track.id}>{track.title} - {track.artist}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>Aquesta llista no té cançons.</p>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No hi ha llistes de reproducció desades.</p>
            )}
        </section>
    );
}

export default PlaylistList;
