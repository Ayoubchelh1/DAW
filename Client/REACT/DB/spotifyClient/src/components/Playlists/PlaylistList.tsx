import type { GETPlaylist } from "../../APIManagement/Playlists/Interfaces/Playlist";

interface PlaylistListProps {
    playlists: GETPlaylist[];
    error: string | null;
}

function PlaylistList({ playlists, error }: PlaylistListProps) {
    return (
        <section className="playlist-list" aria-labelledby="playlist-list-title">
            <h2 id="playlist-list-title">Llistes de reproducció</h2>
            {error ? (
                <p role="alert">{error}</p>
            ) : playlists.length > 0 ? (
                <ul>
                    {playlists.map((playlist) => (
                        <li key={playlist.id}>{playlist.title}</li>
                    ))}
                </ul>
            ) : (
                <p>No hi ha llistes de reproducció desades.</p>
            )}
        </section>
    );
}

export default PlaylistList;
