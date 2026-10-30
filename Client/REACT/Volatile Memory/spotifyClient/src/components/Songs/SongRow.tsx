
import type { SongRowProps } from "./Types/SongRowProps";


const SongCard = (props: SongRowProps) => {



    return (
        <tr>
            <td>{props.title}</td>
            <td>{props.artist}</td>
            <td>Duració:{props.duration}</td>
        </tr>
    )
}

export default SongCard;