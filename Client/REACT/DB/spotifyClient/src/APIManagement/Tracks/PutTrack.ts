import type { TrackCreate } from "./Interfaces/TrackCreate";

export async function PutTrack(newTrack: TrackCreate, id: string) {
    const response: Response = await fetch(
        `http://localhost:3000/tracks/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(newTrack)
        })

}


