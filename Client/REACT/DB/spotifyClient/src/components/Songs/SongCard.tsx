
import type { SongCardProps } from "./Types/SongCardProps";
import likeSong from "../../assets/like-green.png";
import likeSongPending from "../../assets/like-white.png";


const SongCard = (props: SongCardProps) => {



    function handlePlayClick() {
        props.play();
    }

    function handleClickReset() {
        props.reset();
    }

    function handleLikeClick() {
        props.like();
    }




    return (
        <>

            <h1>{props.trackInfo.title}</h1>
            <p>{props.trackInfo.artist}</p>
            <p>Duració:{props.trackInfo.duration}</p>
            <p>Reproduccions:{props.trackInfo.reproduccions}</p>
            <p><button onClick={() => handlePlayClick()}>Play 1</button></p>
            <p><button onClick={handleClickReset}>Reiniciar</button></p>

            <p>
                <button onClick={handleLikeClick}>
                    <img src={props.trackInfo.likes.like ? likeSong : likeSongPending} alt="" width="24" height="24" />
                </button>
                <span> {props.trackInfo.likes.totalLikes}</span>
            </p>
        </>
    )
}

export default SongCard;