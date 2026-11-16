import type { TrackCreate } from "./Interfaces/TrackCreate";

export async function PostTrack(newTrack: TrackCreate) {
    const response: Response = await fetch(
        "http://localhost:3000/tracks",
        {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(newTrack)
        })

}


