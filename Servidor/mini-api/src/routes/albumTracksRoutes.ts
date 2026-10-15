import { Router } from "express";
import { deleteAlbumTrackController, postAlbumTrackController } from "../controllers/albumTracksController";

export const albumTracksRouter: Router = Router();

albumTracksRouter.post("/", postAlbumTrackController);
albumTracksRouter.delete("/:id", deleteAlbumTrackController);
