
import type { SongRowProps } from "./Types/SongRowProps";
import { formatDuration } from "./formatDuration";


const SongCard = (props: SongRowProps) => {



    return (
        <tr>
            <td>{props.title}</td>
            <td>{props.artist}</td>
            <td>Duració:{formatDuration(props.duration)}</td>
        </tr>
    )
}

export default SongCard;