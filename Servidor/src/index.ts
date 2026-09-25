import express, { Express, Request, Response } from "express";
import { APICONFIG } from "./config/apiConfig";
import { tracks } from "./data/track/track";
import { TrackBD } from "./interfaces/track/trackBD";
import { Track } from "./interfaces/track/track";
import { isValidTrack } from "./validatos/track.validator";
import { randomUUID } from "crypto";


const port: number = 3000;

const app: Express = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    return res.json(JSON.stringify(APICONFIG));
});


app.get("/tracks", (_req: Request, res: Response) => {
    return res.status(200).json(tracks);
});


app.get("/tracks/:id", (req: Request, res: Response) => {
    const idTrack: string = req.params.id as string;
    const track: TrackBD[] = tracks.filter(
        (t: TrackBD) => { return t.id === idTrack }
    );
    if (track.length === 0) {
        return res.status(404).json({ message: `Track ${idTrack} not found` });
    }
    return res.status(200).json(track[0]);
});

// Saber totes les llistes de reproducció d'un usuari
//usuari/:id/playlist

// Les ultimes cançons que ha escoltat un usuari

// usuaris/:id/songs/latest
// usuaris/:id/historial

//Ultimes cançons que s'han carregat a l'aplicatiu

// /songs/uploaded/latest

// totes les cançons d'una playlist d'un usuari

// /usuaris/:id/playlist/:idPlayList/songs

// /usuaris/profile (me)

// El perfil d'un altre usuari
// /usuaris/:id/profile

// Musica més repruduïda
// /songs/popular

// Més reproduida d'un artista
// /artists/:id/songs/popular

// /artists/followers/popular

// /artists/reproductions/popular

app.post("/tracks", (req: Request, res: Response) => {
    const track: Track = req.body;
    if (!isValidTrack(track)) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const uuid: string = randomUUID()

    const trackRecord: TrackBD = {
        id: uuid,
        title: track.title.trim().replace(/\s+/g, " "),
        artist: track.artist.trim().replace(/\s+/g, " "),
        duration: track.duration
    };


    return res.status(201).json(trackRecord);
});


app.listen(port, () => {
    console.log(`Servidor escoltant a ${APICONFIG.host}:${APICONFIG.port}`);
});

