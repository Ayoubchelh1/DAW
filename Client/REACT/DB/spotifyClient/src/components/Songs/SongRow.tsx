
import type { SongRowProps } from "./Types/SongRowProps";
import { formatDuration } from "./formatDuration";


const SongCard = (props: SongRowProps) => {

    function handlePlay() {
        props.play();
    }

    return (
        <tr>
            <td>Titol: {props.title}</td>
            <td>Artista: {props.artist}</td>
            <td>Duració: {formatDuration(props.duration)}</td>
            <td><button type="button" onClick={handlePlay}>Play</button></td>
        </tr>
    )
}

export default SongCard;