
import type { Track } from "../../Model/Track";
import type { SongRowProps } from "./Types/SongRowProps";
import { formatDuration } from "./formatDuration";


const SongCard = (props: SongRowProps) => {

    function handlePlay() {
        props.play();
    }

    function editar() {
        const song: Track = {
            id: props.id,
            title: props.title,
            artist_name: props.artist,
            artist_id: props.artist_id,
            duration: props.duration
        }
        props.edit(song);
    }

    return (
        <tr>
            <td>Titol: {props.title}</td>
            <td>Artista: {props.artist}</td>
            <td>Duració: {formatDuration(props.duration)}</td>
            <td><button onClick={editar}>Edit</button></td>
            <td><button type="button" onClick={handlePlay}>Play</button></td>
        </tr>
    )
}

export default SongCard;