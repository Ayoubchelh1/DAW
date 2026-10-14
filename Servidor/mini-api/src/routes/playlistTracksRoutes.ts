import { Router } from "express";
import { getAllPlaylistTracksController, getPlaylistTrackByIdController } from "../controllers/playlistTracksController";

export const playlistTracksRouter: Router = Router();

playlistTracksRouter.get("/", getAllPlaylistTracksController);
playlistTracksRouter.get("/:id", getPlaylistTrackByIdController);