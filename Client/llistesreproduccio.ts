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

function songsSearchArtista(artist: string, songs: Song[]): Song[] {
    return songs.filter(
        (s: Song) => { return artist === s.artist }
    )
}

function songsPlayListArtist(artist: string, playList: PlayList[]): Song[] {
    let songs: Song[] = [];
    for (let i: number = 0; i < playList.length; i++) {
        let songsArtists: Song[] = songsSearchArtista(artist, playList[i].songs)
        for (let i: number = 0; i < songsArtists.length, i++) {
            songsArtists = songs.concat(songsArtists)
        }

    }
}


function songsArtist(artist: string, username: string, users: User[]) {
    const user: User[] = users.filter(
        (u: User) => { return u.name === username }
    );
    const PlayListUser: PlayList[] = user[0].playList;
    return songsPlayListArtist(artist, PlayListUser);
}



console.log(users);

let nameArtist: string = "MJ";
let username: string = "Marc";

const songs: Song[] = songsArtist(nameArtist, username, users);


export { }