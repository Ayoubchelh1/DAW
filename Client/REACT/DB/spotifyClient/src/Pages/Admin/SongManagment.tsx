
import { useEffect, useRef, useState } from "react";
import type { GETTrack } from "../../APIManagement/Tracks/Interfaces/Track";
import ListSongs from "../../components/Songs/ListSongs"
import { ENV } from "../../Config/env";
import AddSongFrom from "../../components/Songs/AddSongForm";


const SongManagment = () => {
    const [tracks, setTracks] = useState<GETTrack[]>([]);
    const [newSong, setNewSong] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    async function carregarDadesTrack() {
        const resposta: Response = await fetch(`${ENV.API_BASE_URL}/tracks`);
        const listTrack: GETTrack[] = await resposta.json() as GETTrack[];
        setTracks(listTrack);
    }


    useEffect(
        () => {
            carregarDadesTrack();

        }, []);

    function addSong() {
        setNewSong(true);
    }


    function playTrack(track: GETTrack): void {
        const trackWithUrl = track as GETTrack & {
            audioUrl?: string;
            fileUrl?: string;
            url?: string;
        };
        const source = trackWithUrl.audioUrl ?? trackWithUrl.fileUrl ?? trackWithUrl.url;

        if (!source) {
            console.error("This track does not have an audio URL.");
            return;
        }

        audioRef.current?.pause();
        const player = new Audio(source);
        audioRef.current = player;
        void player.play().catch((error: unknown) => {
            console.error("Unable to play track:", error);
        });
    }

    return (
        <>
            <main>
                <h1>Llistat de Cançons</h1>

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
                </div>
            </main>
            {
                newSong ?
                    <AddSongFrom refreshSongs={carregarDadesTrack} />
                    : <button onClick={addSong}>Nova</button>
            }
        </>
    )

}



export default SongManagment;

