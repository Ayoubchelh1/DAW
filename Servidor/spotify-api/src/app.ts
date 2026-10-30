import express, { Express, Request, Response } from "express";
import { APICONFIG } from "./config/apiConfig";
import { trackRouter } from "./routes/trackRoutes";
import { artistRouter } from "./routes/artistsRoutes";
import { countriesRouter } from "./routes/countriesRoutes";
import { usersRoutes } from "./routes/usersRoutes";
import { playlistsRouter } from "./routes/playlistRoutes";
import { playlistTracksRouter } from "./routes/playlistTracksRoutes";
import { historyRouter } from "./routes/historyRoutes";
import { albumsRouter } from "./routes/albumsRoutes";
import { albumTracksRouter } from "./routes/albumTracksRoutes";
import cors from "cors";
import { corsOptions } from "./config/cors";


export const app: Express = express();
app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (_req: Request, res: Response) => {
    return res.json(APICONFIG);
});

app.use("/tracks", trackRouter);
app.use("/artists", artistRouter);
app.use("/countries", countriesRouter);
app.use("/users", usersRoutes);
app.use("/playlists", playlistsRouter);
app.use("/playlisttracks", playlistTracksRouter);
app.use("/history", historyRouter);
app.use("/albums", albumsRouter);
app.use("/albumtracks", albumTracksRouter);
