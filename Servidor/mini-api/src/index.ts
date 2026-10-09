import express, { Express, Request, Response } from "express";
import { APICONFIG } from "./config/apiConfig";
import { ErrorService } from "./interfaces/error/trackInvalidData";
import { CreateSuccessService } from "./interfaces/error/createSuccessService";
import { UpdateSuccessService } from "./interfaces/error/updateSuccessService";
import { DeleteSuccessService } from "./interfaces/error/deleteSuccessService";
import { createUser, updateUser, getAllUsers, getUserById, deleteUser } from "./Services/userService";
import { users } from "./data/user/user";
import { UserBD } from "./interfaces/user/userBD";
import { trackRouter } from "./routes/trackRoutes";
import { artistRouter } from "./routes/artistsRoutes";
import { countriesRouter } from "./routes/countries";


const port: number = 3000;

const app: Express = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    return res.json(JSON.stringify(APICONFIG));
});

app.use("/tracks", trackRouter);

app.use("/artists", artistRouter);

app.use("/countries", countriesRouter);

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



app.put("/users/:id", (req: Request, res: Response) => {
    const idUser: string = req.params.id as string;

    const result: UpdateSuccessService<UserBD> | ErrorService = updateUser(idUser, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<UserBD>;
    users[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
});

app.delete("/users/:id", (req: Request, res: Response) => {
    const result: DeleteSuccessService | ErrorService = deleteUser(req.params.id as string);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const index: number = (result as DeleteSuccessService).index;
    users.splice(index, 1);

    return res.status(result.code).json({ result });
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






app.listen(port, () => {
    console.log(`Servidor escoltant a ${APICONFIG.host}:${APICONFIG.port}`);
});
