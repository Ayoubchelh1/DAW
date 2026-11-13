import { useState } from "react";
import type { GETPlaylist } from "../../APIManagement/Playlists/Interfaces/Playlist";
import type { GETTrack } from "../../APIManagement/Tracks/Interfaces/Track";
import { ENV } from "../../Config/env";
import PlaylistTracks from "./PlaylistTracks";

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
        <>
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
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No hi ha llistes de reproducció desades.</p>
                )}
            </section>
            {selectedPlaylistId && (
                <PlaylistTracks
                    playlistId={selectedPlaylistId}
                    playlistTitle={playlists.find((playlist) => playlist.id === selectedPlaylistId)?.title ?? ""}
                    tracks={selectedTracks}
                    error={tracksError}
                    loading={loadingTracks}
                />
            )}
        </>
    );
}

export default PlaylistList;
