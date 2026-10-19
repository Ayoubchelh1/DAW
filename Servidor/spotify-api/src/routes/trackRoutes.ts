import { Router } from "express";
import { deleteTracksController, getAllTracksController, getTrackByIdController, postTrackController, updateTrackController } from "../controllers/tracksController";
import { getTrackById } from "../Services/trackService";

export const trackRouter: Router = Router();

trackRouter.get("/", getAllTracksController)
trackRouter.get("/:id", getTrackByIdController)
trackRouter.post("/", postTrackController)
trackRouter.put("/:id", updateTrackController)
trackRouter.delete("/:id", deleteTracksController)