import express, { Express, Request, Response } from "express";
import { APICONFIG } from "./config/apiConfig";
import { tracks } from "./data/track/track";
import { TrackBD } from "./interfaces/track/trackBD";
import { artists } from "./data/artist/artist";
import { ArtistBD } from "./interfaces/artist/artistBD";
import { getAllCountries, getCountryById, createCountry, updateCountry } from "./Services/countryService";
import { countries } from "./data/country/country";
import { CountryBD } from "./interfaces/country/countryBD";
import { createTrack, updateTrack, getAllTracks, getTrackById, deleteTrack } from "./Services/trackService";
import { ErrorService } from "./interfaces/error/trackInvalidData";
import { CreateSuccessService } from "./interfaces/error/createSuccessService";
import { UpdateSuccessService } from "./interfaces/error/updateSuccessService";
import { DeleteSuccessService } from "./interfaces/error/deleteSuccessService";
import { createArtist, updateArtist, getAllArtists, getArtistById, deleteArtist } from "./Services/artistService";
import { ArtistInvalidData } from "./interfaces/error/artistInvalidData";
import { createUser, getAllUsers, getUserById } from "./Services/userService";
import { users } from "./data/user/user";
import { UserBD } from "./interfaces/user/userBD";


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
    return res.status(200).json(getAllArtists());
});

app.get("/artists/:id", (req: Request, res: Response) => {
    const idArtist: string = req.params.id as string;
    const artist: ArtistBD | undefined = getArtistById(idArtist);
    if (!artist) {
        return res.status(404).json({ message: `Artist ${idArtist} not found` });
    }
    return res.status(200).json(artist);
});

app.get("/countries", (_req: Request, res: Response) => {
    return res.status(200).json(getAllCountries());
});

app.get("/countries/:id", (req: Request, res: Response) => {
    const idCountry: string = req.params.id as string;
    const country: CountryBD | undefined = getCountryById(idCountry);
    if (!country) {
        return res.status(404).json({ message: `Country ${idCountry} not found` });
    }
    return res.status(200).json(country);
});

app.get("/users", (_req: Request, res: Response) => {
    return res.status(200).json(getAllUsers());
});

app.get("/users/:id", (req: Request, res: Response) => {
    const idUser: string = req.params.id as string;
    const user: UserBD | undefined = getUserById(idUser);
    if (!user) {
        return res.status(404).json({ message: `User ${idUser} not found` });
    }
    return res.status(200).json(user);
});

app.put("/countries/:id", (req: Request, res: Response) => {
    const idCountry: string = req.params.id as string;

    const result: UpdateSuccessService<CountryBD> | ErrorService = updateCountry(idCountry, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<CountryBD>;
    countries[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
});

app.post("/countries", (req: Request, res: Response) => {
    const result: CreateSuccessService<CountryBD> | ErrorService = createCountry(req.body);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<CountryBD>;
    countries.push(createResult.data);
    return res.status(createResult.code).json(createResult);
});

app.post("/users", (req: Request, res: Response) => {
    const result: CreateSuccessService<UserBD> | ErrorService = createUser(req.body);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<UserBD>;
    users.push(createResult.data);
    return res.status(createResult.code).json(createResult);
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

    const result: UpdateSuccessService<TrackBD> | ErrorService = updateTrack(idTrack, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<TrackBD>;
    tracks[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
});

app.delete("/tracks/:id", (req: Request, res: Response) => {

    const result: DeleteSuccessService | ErrorService = deleteTrack(req.params.id as string);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const index: number = (result as DeleteSuccessService).index;
    tracks.splice(index, 1)

    return res.status(result.code).json({ result });
});

app.post("/artists", (req: Request, res: Response) => {
    const result: CreateSuccessService<ArtistBD> | ArtistInvalidData = createArtist(req.body);
    if (!result.success) {
        const errorResult = result as ArtistInvalidData;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<ArtistBD>;
    artists.push(createResult.data);
    return res.status(createResult.code).json(createResult);
});

app.put("/artists/:id", (req: Request, res: Response) => {
    const idArtist: string = req.params.id as string;

    const result: UpdateSuccessService<ArtistBD> | ArtistInvalidData = updateArtist(idArtist, req.body);
    if (!result.success) {
        const errorResult = result as ArtistInvalidData;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<ArtistBD>;
    artists[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
});

app.delete("/artists/:id", (req: Request, res: Response) => {
    const result: DeleteSuccessService | ArtistInvalidData = deleteArtist(req.params.id as string);

    if (!result.success) {
        const errorResult = result as ArtistInvalidData;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const index: number = (result as DeleteSuccessService).index;
    artists.splice(index, 1);

    return res.status(result.code).json({ result });
});


app.listen(port, () => {
    console.log(`Servidor escoltant a ${APICONFIG.host}:${APICONFIG.port}`);
});
