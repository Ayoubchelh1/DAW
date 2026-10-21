interface Canco {
    id: string;
    titol: string;
    artista: string;
    durada: number;
}

interface Temps {
    minuts: number;
    segons: number;
}

interface Track {
    title: string;
    duration: Temps;
}


const cancons: Canco[] = [
    {
        id: "2B-CA",
        titol: "Rattle and Hum",
        artista: "U2",
        durada: 30
    },
    {
        id: "3B-TX",
        titol: "Chicago",
        artista: "Michael Jackson",
        durada: 65
    },
    {
        id: "2R-CA",
        titol: "Chicago",
        artista: "MJ",
        durada: 190
    },
    {
        id: "3B-TX",
        titol: "Chicago",
        artista: "MJ",
        durada: 180
    },
]

function convertirTemps(temps: number): Temps {
    return {
        minuts: Math.floor(temps / 60),
        segons: temps % 60
    }
}
const tracks: Track[] = cancons.map(
    (c: Canco) => {
        return { title: c.titol, duration: convertirTemps(c.durada) }
    }
)



const songsString: string[] = cancons.map(
    (c: Canco) => {
        let text: string = `${c.titol} (${c.artista}) - durada: ${c.durada}`
        return text.trim()
    }
)


const Durada: string[] = cancons.map(
    (c: Canco) => {
        let minuts: number = Math.floor(c.durada / 60);
        let segons: number = c.durada % 60;
        let durada: string = `titol: ${c.titol}, - minuts: ${minuts} segons: ${segons}`
        return durada.trim();
    }
)

tracks.forEach(
    (t: Track) => { console.log(t); }
);