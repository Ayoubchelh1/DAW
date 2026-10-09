import express, { Express, Request, Response } from "express";
import { APICONFIG } from "./config/apiConfig";
import { ErrorService } from "./interfaces/error/trackInvalidData";
import { CreateSuccessService } from "./interfaces/error/createSuccessService";
import { UpdateSuccessService } from "./interfaces/error/updateSuccessService";
import { DeleteSuccessService } from "./interfaces/error/deleteSuccessService";
import { createUser, updateUser, getAllUsers, getUserById, deleteUser } from "./Services/userService";
import { users } from "./data/user/user";
import { UserBD } from "./interfaces/user/userBD";
import { playlists } from "./data/playlist/playlist";
import { PlaylistBD } from "./interfaces/playlist/playlistBD";
import { trackRouter } from "./routes/trackRoutes";
import { artistRouter } from "./routes/artistsRoutes";
import { countriesRouter } from "./routes/countries";
import { deleteUsersController, getAllUsersController, getUsersByIdController, postUsersController, putUsersController } from "./controllers/usersController";
import { usersRoutes } from "./routes/usersRoutes";


const port: number = 3000;

const app: Express = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    return res.json(JSON.stringify(APICONFIG));
});

app.use("/tracks", trackRouter);

app.use("/artists", artistRouter);

app.use("/countries", countriesRouter);

app.use("/users", usersRoutes);


app.get("/playlists", (_req: Request, res: Response) => {
    return res.status(200).json(playlists);
});

app.get("/playlists/:id", (req: Request, res: Response) => {
    const idPlaylist: string = req.params.id as string;
    const playlist: PlaylistBD[] = playlists.filter(
        (p: PlaylistBD) => { return p.id === idPlaylist }
    );
    if (playlist.length === 0) {
        return res.status(404).json({ message: `Playlist ${idPlaylist} not found` });
    }
    return res.status(200).json(playlist[0]);
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


app.listen(port, () => {
    console.log(`Servidor escoltant a ${APICONFIG.host}:${APICONFIG.port}`);
});
