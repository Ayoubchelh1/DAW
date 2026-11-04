
import type { SongRowProps } from "./Types/SongRowProps";


const SongCard = (props: SongRowProps) => {



    return (
        <tr>
            <td>Titol: {props.title}</td>
            <td>Artista: {props.artist}</td>
            <td>Duració: {props.duration}</td>
        </tr>
    )
}

export default SongCard;