import { tracks } from "../../Data/track";
import type { Track } from "../../interfaces/Track";

const totalTracks: number = tracks.length;
const random: number = Math.floor(Math.random() * totalTracks);
const track: Track = tracks[random]



const SongCard = () => {

    return (
        <>
            <h1>{track.title}</h1>
            <p>{track.artist}</p>
            <p>{track.duration}</p>
        </>
    )
}

export default SongCard;