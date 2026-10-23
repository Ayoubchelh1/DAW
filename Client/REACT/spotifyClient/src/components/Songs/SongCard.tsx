import { useState } from "react";
import type { SongCardProps } from "./Types/SongCardProps";


const SongCard = ({ trackInfo }: SongCardProps) => {

    let [totalReporduccions, setTotalReproduccions] = useState<number>(trackInfo.reproduccions);

    function handeClickPlay() {
        const tr = (prev: number): number => { return prev + 1 }
        setTotalReproduccions(tr);
    }


    return (
        <>
            <h1>{trackInfo.title}</h1>
            <p>{trackInfo.artist}</p>
            <p>Duració:{trackInfo.duration}</p>
            <p>Reproduccions:{totalReporduccions}</p>
            <p><button onClick={handeClickPlay}>Play</button></p>
        </>
    )
}

export default SongCard;