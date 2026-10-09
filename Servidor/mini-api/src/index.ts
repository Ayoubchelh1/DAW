import express, { Express, Request, Response } from "express";
import { APICONFIG } from "./config/apiConfig";
import { ErrorService } from "./interfaces/error/trackInvalidData";
import { CreateSuccessService } from "./interfaces/error/createSuccessService";
import { UpdateSuccessService } from "./interfaces/error/updateSuccessService";
import { DeleteSuccessService } from "./interfaces/error/deleteSuccessService";
import { createUser, updateUser, getAllUsers, getUserById, deleteUser } from "./Services/userService";
import { trackRouter } from "./routes/trackRoutes";
import { artistRouter } from "./routes/artistsRoutes";
import { countriesRouter } from "./routes/countriesRoutes";
import { deleteUsersController, getAllUsersController, getUsersByIdController, postUsersController, putUsersController } from "./controllers/usersController";
import { usersRoutes } from "./routes/usersRoutes";
import { playlists } from "./data/playlist/playlist";
import { PlaylistBD } from "./interfaces/playlist/playlistBD";
import { createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, updatePlaylist } from "./Services/playlistService";
import { deletePlaylistController, getAllPlaylistsController, getPlaylistByIdController, postPlaylistController, putPlaylistController } from "./controllers/playlistsController";
import { playlistsRouter } from "./routes/playlistRoutes";


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

app.use("playlists", playlistsRouter)



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
