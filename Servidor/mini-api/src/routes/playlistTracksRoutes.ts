import { Router } from "express";
import { getAllPlaylistTracksController, getPlaylistTrackByIdController, postPlaylistTrackController } from "../controllers/playlistTracksController";

export const playlistTracksRouter: Router = Router();

playlistTracksRouter.get("/", getAllPlaylistTracksController);
playlistTracksRouter.get("/:id", getPlaylistTrackByIdController);
playlistTracksRouter.post("/", postPlaylistTrackController);