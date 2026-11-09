import { Router } from "express";
import { deletePlaylistTrackController, getAllPlaylistTracksController, getPlaylistTrackByIdController, getTracksInPlaylistController, postPlaylistTrackController } from "../controllers/playlistTracksController";

export const playlistTracksRouter: Router = Router();

playlistTracksRouter.get("/", getAllPlaylistTracksController);
playlistTracksRouter.get("/playlist/:id", getTracksInPlaylistController);
playlistTracksRouter.get("/:id", getPlaylistTrackByIdController);
playlistTracksRouter.post("/", postPlaylistTrackController);
playlistTracksRouter.delete("/:id", deletePlaylistTrackController);