import type { SongCardProps } from "./Types/SongCardProps";


const SongCard = ({ trackInfo }: SongCardProps) => {

    return (
        <>
            <h1>{trackInfo.title}</h1>
            <p>{trackInfo.artist}</p>
            <p>{trackInfo.duration}</p>
        </>
    )
}

export default SongCard;