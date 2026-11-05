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
                            key={t.id}
                            title={t.title}
                            artist={t.artist}
                            duration={t.duration}
                            play={() => props.playTrack(t)} />
                    }
                )
            }
        </>
    )
}


export default ListSongs;