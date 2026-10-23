import { useState } from "react";
import type { SongCardProps } from "./Types/SongCardProps";
import likeGreen from "../../assets/like-green.png";
import likeWhite from "../../assets/like-white.png";


const SongCard = ({ trackInfo }: SongCardProps) => {

    let [totalReporduccions, setTotalReproduccions] = useState<number>(trackInfo.reproduccions);
    const [viewicon, setViewicon] = useState<boolean>(true);
    const [likes, setLikes] = useState<number>(0);

    function handeClickPlay() {
        const tr = (prev: number): number => { return prev + 1 }
        setTotalReproduccions(tr);
    }

    function handleLikeClick() {
        setLikes((prev) => prev + (viewicon ? 1 : -1));
        setViewicon((prev) => !prev);
    }


    return (
        <>
            <h1>{trackInfo.title}</h1>
            <p>{trackInfo.artist}</p>
            <p>Duració:{trackInfo.duration}</p>
            <p>Reproduccions:{totalReporduccions}</p>
            <p><button onClick={handeClickPlay}>Play</button></p>
            <p>
                <button onClick={handleLikeClick} >
                    <img src={viewicon ? likeWhite : likeGreen} alt="" width="24" height="24" />
                </button>
                <span>{likes}</span>
            </p>
        </>
    )
}

export default SongCard;