import type { SongCardProps } from "./Types/SongCardProps";


const SongCard = ({ trackInfo }: SongCardProps) => {

    return (
        <>
            <h1>{trackInfo.title}</h1>
            <p>{trackInfo.artist}</p>
            <p>Duracio:{trackInfo.duration}</p>
            <p>Reproduccions:{trackInfo.reproduccions}</p>
        </>
    )
}

export default SongCard;