import { Router } from "express";
import { deleteTracksController, getAllTracksController, getTrackByIdController, postTrackController, postTrackUserHistoryController, updateTrackController } from "../controllers/tracksController";

export const trackRouter: Router = Router();

trackRouter.get("/", getAllTracksController)
trackRouter.get("/:id", getTrackByIdController)
trackRouter.post("/", postTrackController)
trackRouter.put("/:id", updateTrackController)
trackRouter.delete("/:id", deleteTracksController)

trackRouter.post("/user:id/history", postTrackUserHistoryController)