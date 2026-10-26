import { useState } from "react";
import type { SongCardProps } from "./Types/SongCardProps";
import likeGreen from "../../assets/like-green.png";
import likeWhite from "../../assets/like-white.png";


const SongCard = (props: SongCardProps) => {


    const [viewicon, setViewicon] = useState<boolean>(true);
    const [likes, setLikes] = useState<number>(0);

    function handlePlayClick() {
        props.play();
    }

    function handleClickReset() {

    }

    function handleLikeClick() {

    }




    return (
        <>

            <h1>{props.trackInfo.title}</h1>
            <p>{props.trackInfo.artist}</p>
            <p>Duració:{props.trackInfo.duration}</p>
            <p>Reproduccions:{props.trackInfo.reproduccions}</p>
            <p>
                <p><button onClick={() => handlePlayClick()}>Play 1</button></p>

                <p><button onClick={handleClickReset}>Reiniciar</button></p>

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