import { Router } from "express";
import { deleteAlbumController, getAlbumByIdController, getAllAlbumsController, postAlbumController, putAlbumController } from "../controllers/albumsController";

export const albumsRouter: Router = Router();

albumsRouter.get("/", getAllAlbumsController);
albumsRouter.get("/:id", getAlbumByIdController);
albumsRouter.post("/", postAlbumController);
albumsRouter.put("/:id", putAlbumController);
albumsRouter.delete("/:id", deleteAlbumController);
