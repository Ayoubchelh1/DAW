interface Canco {
    id: string;
    titol: string;
    artista: string;
    durada: number;
}

interface Track {
    title: string;
    duration: number;
}


const cancons: Canco[] = [
    {
        id: "2B-CA",
        titol: "Rattle and Hum",
        artista: "U2",
        durada: 90
    },
    {
        id: "3B-TX",
        titol: "Chicago",
        artista: "Michael Jackson",
        durada: 190
    },
    {
        id: "2R-CA",
        titol: "Chicago",
        artista: "MJ",
        durada: 90
    },
    {
        id: "3B-TX",
        titol: "Chicago",
        artista: "MJ",
        durada: 190
    },
]

const tracks: Track[] = cancons.map(
    (c: Canco) => {
        return { title: c.titol, duration: c.durada }
    }
)

tracks.forEach(
    (t: Track) => { console.log(t); }
);

const songsString: string[] = cancons.map(
    (c: Canco) => {
        let text: string = `${c.titol} (${c.artista}) - durada: ${c.durada}`
        return text.trim()
    }
)

const Durada: string[] = cancons.map(
    (c: Canco) => {
        let durada: string = `titol: ${c.titol}, Math.floor(${c.durada} / 60)`
        return durada.trim();
    }
)