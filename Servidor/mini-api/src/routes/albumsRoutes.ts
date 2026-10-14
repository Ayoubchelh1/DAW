import { Router } from "express";
import { getAlbumByIdController, getAllAlbumsController, postAlbumController } from "../controllers/albumsController";

export const albumsRouter: Router = Router();

albumsRouter.get("/", getAllAlbumsController);
albumsRouter.get("/:id", getAlbumByIdController);
albumsRouter.post("/", postAlbumController);
