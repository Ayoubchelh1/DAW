import { useEffect, useState, type SubmitEvent } from "react";
import { ENV } from "../../Config/env";
import type { GETArtist } from "../../APIManagement/Artists/Interfaces/Artists";
import type { TrackCreate } from "../../APIManagement/Tracks/Interfaces/TrackCreate";
import { PostTrack } from "../../APIManagement/Tracks/PostTracks";
import type { AddSongFormProps } from "./Types/AddSongFormProps";


const AddSongFrom = (props: AddSongFormProps) => {
    const [artists, setArtists] = useState<GETArtist[]>([]);

    async function carregarArtist() {
        const resposta: Response = await fetch(`${ENV.API_BASE_URL}/artists`);
        const listArtist: GETArtist[] = await resposta.json() as GETArtist[];
        setArtists(listArtist);
    }


    useEffect(
        () => {
            carregarArtist();

        }, []);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const dades = new FormData(event.currentTarget);


        const song: TrackCreate = {
            title: String(dades.get("title") ?? "").trim(),
            artist: String(dades.get("artist") ?? ""),
            duration: Number(dades.get("duration"))
        }


        console.log(song);
        await PostTrack(song);
        props.refreshSongs();


    }

    return (
        <>
            <h1>Afegir cançó </h1>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>
                        Titol:
                        <input type="text" name="title" required />
                    </label>
                </p>
                <p>
                    <label>
                        Duration:
                        <input type="number" name="duration" required />
                    </label>
                </p>
                <p>
                    <label>
                        Artista:
                        <select name="artist">
                            {
                                artists.map(
                                    (a: GETArtist) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    )
                                )
                            }
                        </select>
                        <button>Add</button>
                    </label>
                </p>
                <button type="submit">Desa</button>
            </form>
        </>
    )
}

export default AddSongFrom;