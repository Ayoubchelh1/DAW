interface User {
    name: string;
    playList: PlayList[];
}

interface PlayList {
    name: string;
    songs: Song[];
}

interface Song {
    id: string;
    title: string;
    artist: string;
    duration: number;
}


const llistaRepro: PlayList[] = [
    {
        name: "LMarc",
        songs: [{
            id: "2B-CA",
            title: "Rattle and Hum",
            artist: "U2",
            duration: 90
        },
        {
            id: "3B-TX",
            title: "Chicago",
            artist: "MJ",
            duration: 190
        },]
    },
    {
        name: "LIsac",
        songs: [
            {
                id: "3B-TX",
                title: "Chicago",
                artist: "MJ",
                duration: 190
            },

        ]
    },
    {
        name: "LBerni",
        songs: []
    }
]

const users: User[] = [
    {
        name: "Marc",
        playList: [llistaRepro[0]]
    },
    {
        name: "Anna",
        playList: [llistaRepro[1], llistaRepro[2]]
    },

]

console.log(users);

let nameArtist: string = "MJ";
let username: string = "Marc";

const songs: Song[] = songsArtist(nameArtist, username, users);
export { }