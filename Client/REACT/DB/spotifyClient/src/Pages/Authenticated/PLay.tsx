import { useState, useEffect } from "react";
import type { AddHistory } from "../../APIManagement/History/Interfaces/HistoryCreate";
import type { GETPlaylist } from "../../APIManagement/Playlists/Interfaces/Playlist";
import type { GETTrack } from "../../APIManagement/Tracks/Interfaces/Track";
import PlaylistList from "../../components/Playlists/PlaylistList";
import Reproduint from "../../components/Reproduint/Reproduint";
import ListSongs from "../../components/Songs/ListSongs";
import SongCard from "../../components/Songs/SongCard";
import type { TrackView } from "../../components/Songs/Types/TrackView";
import { ENV } from "../../Config/env";
import { users } from "../../Data/user";

interface LikeSummary {
    totalLikes: number;
    userLike: number | null;
}

const USER_ID = "1C1DA739-8ABA-461B-B38B-701C25A3AB59";

const Play = () => {

    const [tracks, setTracks] = useState<GETTrack[]>([]);
    const [playlists, setPlaylists] = useState<GETPlaylist[]>([]);
    const [playlistsError, setPlaylistsError] = useState<string | null>(null);
    const [randomUser] = useState(() => users[Math.floor(Math.random() * users.length)]);
    const [track, setTrack] = useState<TrackView>(getRandomTrack);
    const [likesError, setLikesError] = useState<string | null>(null);
    const [likesSaving, setLikesSaving] = useState(false);
    const [volum, setVolum] = useState(10);
    const [playingSongTitle, setPlayingSongTitle] = useState<string | null>(null);
    const likesApiUrl = `${ENV.API_BASE_URL.replace(/\/+$/, "")}/likes`;


    async function carregarDadesTrack() {

        const resposta: Response = await fetch(`${ENV.API_BASE_URL}/tracks`);
        const listTrack: GETTrack[] = await resposta.json() as GETTrack[];
        setTracks(listTrack)
    }

    async function carregarPlaylists() {
        try {
            const resposta: Response = await fetch(`${ENV.API_BASE_URL}/playlists`);
            if (!resposta.ok) {
                throw new Error(`Error carregant les llistes (${resposta.status}).`);
            }

            const dades: GETPlaylist[] = await resposta.json() as GETPlaylist[];
            setPlaylists(dades);
        } catch (error) {
            setPlaylistsError(
                error instanceof Error
                    ? error.message
                    : "No s'han pogut carregar les llistes de reproducció."
            );
        }
    }

    useEffect(
        () => {
            carregarDadesTrack();
            carregarPlaylists();
        }, []);

    useEffect(() => {
        if (!track.id) {
            return;
        }

        let active = true;
        const trackId = track.id;
        setLikesError(null);

        async function carregarLikes() {
            try {
                const resposta = await fetch(
                    `${likesApiUrl}/track/${trackId}?user_id=${encodeURIComponent(USER_ID)}`
                );
                if (!resposta.ok) {
                    throw new Error(`Error carregant els likes (${resposta.status}).`);
                }

                const summary: LikeSummary = await resposta.json() as LikeSummary;
                if (active) {
                    setTrack((currentTrack) => currentTrack.id === trackId
                        ? {
                            ...currentTrack,
                            likes: { like: summary.userLike === 1, totalLikes: summary.totalLikes }
                        }
                        : currentTrack);
                }
            } catch (error) {
                if (active) {
                    setLikesError(error instanceof Error ? error.message : "No s'han pogut carregar els likes.");
                }
            }
        }

        carregarLikes();
        return () => {
            active = false;
        };
    }, [track.id]);


    function pujarVolum() {
        setVolum((volumActual) => Math.min(volumActual + 1, 100));
    }

    function baixarVolum() {
        setVolum((volumActual) => Math.max(volumActual - 1, 0));
    }

    async function incrementarReproduccions() {
        const tr = (prev: TrackView): TrackView => {
            return {
                ...prev,
                reproduccions: prev.reproduccions + 1
            }
        }

        setTrack(tr);

        const newHistory: AddHistory = {
            user: "1C1DA739-8ABA-461B-B38B-701C25A3AB59",
            track: tracks[0].id
        }

        const response: Response = await fetch(
            "http://localhost:3000/tracks/user/history",
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(newHistory)
            })
        if (!response.ok) {
            return false;
        }


        const result = await response.json();
        console.log(result)



    }


    function togglePlaying() {
        if (playingSongTitle === track.title) {
            setPlayingSongTitle(null);
            return;
        }

        setPlayingSongTitle(track.title);
        incrementarReproduccions();
    }

    function playTrack(selectedTrack: GETTrack) {
        setTrack((previousTrack) => {
            const isSameTrack = previousTrack.title === selectedTrack.title &&
                previousTrack.artist === selectedTrack.artist;
            const isSameTrackId = previousTrack.id === selectedTrack.id;

            return {
                ...selectedTrack,
                reproduccions: isSameTrack ? previousTrack.reproduccions + 1 : 1,
                likes: isSameTrackId
                    ? previousTrack.likes
                    : { like: false, totalLikes: selectedTrack.totalLikes }
            };
        });
        setPlayingSongTitle(selectedTrack.title);
    }

    function stopPlaying() {
        setPlayingSongTitle(null);
    }

    function reset() {
        setTrack((prev) => ({
            ...prev,
            reproduccions: 0
        }));
    }

    function getRandomTrack(): TrackView {
        const totalTracks: number = tracks.length;
        const randomIndex: number = Math.floor(Math.random() * totalTracks);
        const randomTrack = tracks[randomIndex];

        return {
            ...randomTrack,
            reproduccions: Math.floor(Math.random() * 10205),
            likes: {
                like: false,
                totalLikes: randomTrack.totalLikes
            }
        };
    }


    async function gestionarLikes() {
        if (!track.id || likesSaving) {
            return;
        }

        const trackId = track.id;
        const likeTrack = track.likes.like ? -1 : 1;
        setLikesSaving(true);
        setLikesError(null);

        try {
            const response = await fetch(likesApiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: USER_ID, track: trackId, likeTrack })
            });
            if (!response.ok) {
                throw new Error(`Error desant el like (${response.status}).`);
            }

            const summaryResponse = await fetch(
                `${likesApiUrl}/track/${trackId}?user_id=${encodeURIComponent(USER_ID)}`
            );
            if (!summaryResponse.ok) {
                throw new Error(`Error carregant els likes (${summaryResponse.status}).`);
            }

            const summary: LikeSummary = await summaryResponse.json() as LikeSummary;
            setTrack((currentTrack) => currentTrack.id === trackId
                ? {
                    ...currentTrack,
                    likes: { like: summary.userLike === 1, totalLikes: summary.totalLikes }
                }
                : currentTrack);
        } catch (error) {
            setLikesError(error instanceof Error ? error.message : "No s'ha pogut desar el like.");
        } finally {
            setLikesSaving(false);
        }
    }

    function handleClickRandom() {
        const randomTrack = getRandomTrack();
        setTrack((previousTrack) => previousTrack.id === randomTrack.id
            ? { ...randomTrack, likes: previousTrack.likes }
            : randomTrack);
        setPlayingSongTitle(null);
    }




    return (
        <>

            <main>
                <div className="library-panels">
                    <div className="song-list">
                        {
                            tracks.length ?
                                <table>
                                    <thead>
                                        <title>ListSongs</title>
                                    </thead>
                                    <tbody>
                                        <ListSongs tracks={tracks} playTrack={playTrack} />
                                    </tbody>
                                </table>
                                : <p>No tracks avaiable</p>
                        }
                    </div>
                    <PlaylistList playlists={playlists} error={playlistsError} />
                </div>
                <SongCard trackInfo={track} play={togglePlaying} reset={() => reset()} like={() => gestionarLikes()} likeDisabled={likesSaving} />
                {likesError && <p role="alert">{likesError}</p>}
                <hr></hr>
                <Reproduint
                    volum={volum}
                    pujarVolum={pujarVolum}
                    baixarVolum={baixarVolum}
                    playingSongTitle={playingSongTitle}
                    stopPlaying={stopPlaying}
                />
                <p><button onClick={handleClickRandom}>Random</button></p>
            </main>
        </>
    )
}

export default Play;