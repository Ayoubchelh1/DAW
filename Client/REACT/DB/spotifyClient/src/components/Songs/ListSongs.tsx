import type { GETTrack } from "../../APIManagement/Tracks/Interfaces/Track";
import SongRow from "./SongRow";
import type { SongListProps } from "./Types/SongListProps";



const ListSongs = (props: SongListProps) => {

    return (
        <>
            {
                props.tracks.map(
                    (t: GETTrack) => {
                        return <SongRow
                            id={t.id}
                            key={t.id}
                            title={t.title}
                            artist={t.artist}
                            artist_id={t.artist_id}
                            duration={t.duration}
                            totalLikes={t.totalLikes}
                            edit={props.edit}
                            play={() => props.playTrack(t)} />
                    }
                )
            }
        </>
    )
}


export default ListSongs;