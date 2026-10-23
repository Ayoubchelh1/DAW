import { useState } from "react";
import type { SongCardProps } from "./Types/SongCardProps";
import likeGreen from "../../assets/like-green.png";
import likeWhite from "../../assets/like-white.png";


const SongCard = ({ trackInfo }: SongCardProps) => {

    let [totalReporduccions, setTotalReproduccions] = useState<number>(trackInfo.reproduccions);
    const [viewicon, setViewicon] = useState<boolean>(true);
    const [likes, setLikes] = useState<number>(0);

    function handlePlayClick(amount: number) {
        setTotalReproduccions((prev: number) => prev + amount);
    }

    function handleClickReset() {
        setTotalReproduccions(0);
        setLikes(0);
        setViewicon(true);
    }

    function handleLikeClick() {
        setLikes((prev) => prev + (viewicon ? 1 : -1));
        setViewicon((prev) => !prev);
    }

    function handleClickRandom() {

    }


    return (
        <>

            <h1>{trackInfo.title}</h1>
            <p>{trackInfo.artist}</p>
            <p>Duració:{trackInfo.duration}</p>
            <p>Reproduccions:{totalReporduccions}</p>
            <p>
                <p><button onClick={() => handlePlayClick(1)}>Play 1</button></p>
                <p><button onClick={() => handlePlayClick(5)}>Play 5</button></p>
                <p><button onClick={() => handlePlayClick(10)}>Play 10</button></p>
                <p><button onClick={handleClickReset}>Reiniciar</button></p>
                <p><button onClick={handleClickRandom}>Random</button></p>
            </p>
            <p>
                <button onClick={handleLikeClick}>
                    <img src={viewicon ? likeWhite : likeGreen} alt="" width="24" height="24" />
                </button>
                <span> {likes}</span>
            </p>
        </>
    )
}

export default SongCard;