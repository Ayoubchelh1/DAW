import { Router } from "express";
import { getTrackLikeSummaryController, postLikeController } from "../controllers/likesController";

export const likesRouter: Router = Router();

likesRouter.get("/track/:trackId", getTrackLikeSummaryController);
likesRouter.post("/", postLikeController);
