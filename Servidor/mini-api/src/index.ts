import express, { Express, Request, Response } from "express";
import { APICONFIG } from "./config/apiConfig";
import { tracks } from "./data/track/track";
import { TrackBD } from "./interfaces/track/trackBD";
import { artists } from "./data/artist/artist";
import { ArtistBD } from "./interfaces/artist/artistBD";
import { Artist } from "./interfaces/artist/artist";
import { getCanonicalCountry, isValidArtist } from "./validatos/artist.validator";
import { randomUUID } from "crypto";
import { createTrack, updateTrack, getAllTracks, getTrackById } from "./Services/trackService";
import { ErrorService } from "./interfaces/error/trackInvalidData";
import { CreateSuccessService } from "./interfaces/error/createSuccessService";
import { emplenarSuccesService } from "./interfaces/error/emplenarSuccessService";


const port: number = 3000;

const app: Express = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    return res.json(JSON.stringify(APICONFIG));
});


app.get("/tracks", (_req: Request, res: Response) => {
    return res.status(200).json(getAllTracks());
});


app.get("/tracks/:id", (req: Request, res: Response) => {
    const findTrack = getTrackById(req.params.id as string);
    if (!findTrack) {
        return res.status(404).json({ message: `Track not found` });
    }
    return res.status(200).json(findTrack);
});

app.get("/artists", (_req: Request, res: Response) => {
    return res.status(200).json(artists);
});

app.get("/artists/:id", (req: Request, res: Response) => {
    const idArtist: string = req.params.id as string;
    const artist: ArtistBD[] = artists.filter(
        (a: ArtistBD) => { return a.id === idArtist }
    );
    if (artist.length === 0) {
        return res.status(404).json({ message: `Artist ${idArtist} not found` });
    }
    return res.status(200).json(artist[0]);
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

    const result: CreateSuccessService<TrackBD> | ErrorService = createTrack(req.body);

    if (!result.success) {
        const errorResult = result as ErrorService
        return res.status(errorResult.code).json({ message: errorResult.message })
    }

    tracks.push((result as CreateSuccessService<TrackBD>).data);
    return res.status(result.code).json(result);
});

app.put("/tracks/:id", (req: Request, res: Response) => {
    const idTrack: string = req.params.id as string;
    const trackIndex: number = tracks.findIndex((track: TrackBD) => track.id === idTrack);
    const result: emplenarSuccesService<TrackBD> | ErrorService = updateTrack(idTrack, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updatedTrack: TrackBD = (result as emplenarSuccesService<TrackBD>).data;
    tracks[trackIndex] = updatedTrack;
    return res.status(result.code).json(updatedTrack);
});

app.delete("/tracks/:id", (req: Request, res: Response) => {
    const idTrack: string = req.params.id as string;
    const trackIndex: number = tracks.findIndex((track: TrackBD) => track.id === idTrack);
    if (trackIndex === -1) {
        return res.status(404).json({ message: "Track not found" });
    }

    tracks.splice(trackIndex, 1);

    return res.status(204).json({ message: "Track eliminated" });
});

app.post("/artists", (req: Request, res: Response) => {
    const artist: Artist = req.body;
    if (!isValidArtist(artist)) {
        return res.status(400).json({ message: "Invalid data or country" });
    }

    const idartista: string = randomUUID()
    const artistRecord: ArtistBD = {
        id: idartista,
        artistName: artist.artistName.trim().replace(/\s+/g, " "),
        realName: artist.realName.trim().replace(/\s+/g, " "),
        country: getCanonicalCountry(artist.country)
    };

    artists.push(artistRecord);

    return res.status(201).json(artistRecord);
});


app.listen(port, () => {
    console.log(`Servidor escoltant a ${APICONFIG.host}:${APICONFIG.port}`);
});
