import { useEffect, useRef, useState } from "react";
import type { GETTrack } from "../../APIManagement/Tracks/Interfaces/Track";
import ListSongs from "../../components/Songs/ListSongs"
import { ENV } from "../../Config/env";
import AddSongFrom from "../../components/Songs/AddSongForm";
import type { FormState } from "./Types/FormState";
import type { Track } from "../../Model/Track";
import type { TrackCreate } from "../../APIManagement/Tracks/Interfaces/TrackCreate";
import { PostTrack } from "../../APIManagement/Tracks/PostTracks";
import { PutTrack } from "../../APIManagement/Tracks/PutTrack";


const SongManagment = () => {
    const [tracks, setTracks] = useState<GETTrack[]>([]);
    const [newSong, setNewSong] = useState<FormState>({ mode: "none" });


    const audioRef = useRef<HTMLAudioElement | null>(null);

    async function carregarDadesTrack() {
        const resposta: Response = await fetch(`${ENV.API_BASE_URL}/tracks`);
        const listTrack: GETTrack[] = await resposta.json() as GETTrack[];
        console.log(listTrack);
        setTracks(listTrack);

    }


    useEffect(
        () => {
            carregarDadesTrack();

        }, []);

    function addSong() {
        setNewSong({ mode: "new" });
    }

    function edit(t: Track) {

        setNewSong(
            {
                mode: "edit",
                song: t
            }
        );
    }

    async function save(t: TrackCreate) {
        await PostTrack(t);
        await carregarDadesTrack()
        setNewSong({ mode: "none" });
    }

    async function update(t: TrackCreate) {

        const id = newSong.mode === "edit" ? newSong.song.id : "";

        await PutTrack(t, id);
        await carregarDadesTrack()
        setNewSong({ mode: "none" });
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
                                        <ListSongs tracks={tracks} playTrack={playTrack} edit={edit} />
                                    </tbody>
                                </table>
                                : <p>No tracks avaiable</p>
                        }

                    </div>
                </div>
            </main>
            {
                newSong.mode === "new" ?
                    <AddSongFrom submit={(t) => save(t)} />
                    : newSong.mode === "edit" ?
                        <AddSongFrom submit={(t) => update(t)} song={newSong.song} />
                        : <button onClick={addSong}>Afegir</button>
            }
        </>
    )

}



export default SongManagment;

