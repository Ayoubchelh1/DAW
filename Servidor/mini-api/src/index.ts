import express, { Express, Request, Response } from "express";
import { APICONFIG } from "./config/apiConfig";
import { ErrorService } from "./interfaces/error/trackInvalidData";
import { CreateSuccessService } from "./interfaces/error/createSuccessService";
import { UpdateSuccessService } from "./interfaces/error/updateSuccessService";
import { DeleteSuccessService } from "./interfaces/error/deleteSuccessService";
import { createUser, updateUser, getAllUsers, getUserById, deleteUser } from "./Services/userService";
import { trackRouter } from "./routes/trackRoutes";
import { artistRouter } from "./routes/artistsRoutes";
import { countriesRouter } from "./routes/countries";
import { deleteUsersController, getAllUsersController, getUsersByIdController, postUsersController, putUsersController } from "./controllers/usersController";
import { usersRoutes } from "./routes/usersRoutes";
import { playlists } from "./data/playlist/playlist";
import { PlaylistBD } from "./interfaces/playlist/playlistBD";
import { createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, updatePlaylist } from "./Services/playlistService";


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
    return res.status(200).json(getAllPlaylists());
});

app.get("/playlists/:id", (req: Request, res: Response) => {
    const idPlaylist: string = req.params.id as string;
    const playlist: PlaylistBD | undefined = getPlaylistById(idPlaylist);
    if (!playlist) {
        return res.status(404).json({ message: `Playlist ${idPlaylist} not found` });
    }
    return res.status(200).json(playlist);
});

app.post("/playlists", (req: Request, res: Response) => {
    const result: CreateSuccessService<PlaylistBD> | ErrorService = createPlaylist(req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<PlaylistBD>;
    playlists.push(createResult.data);
    return res.status(createResult.code).json(createResult.data);
});

app.put("/playlists/:id", (req: Request, res: Response) => {
    const idPlaylist: string = req.params.id as string;
    const result: UpdateSuccessService<PlaylistBD> | ErrorService = updatePlaylist(idPlaylist, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<PlaylistBD>;
    playlists[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
});

app.delete("/playlists/:id", (req: Request, res: Response) => {
    const idPlaylist: string = req.params.id as string;
    const result: DeleteSuccessService | ErrorService = deletePlaylist(idPlaylist);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const index: number = (result as DeleteSuccessService).index;
    playlists.splice(index, 1);
    return res.status(result.code).send();
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
