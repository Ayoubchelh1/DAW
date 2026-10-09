import { Router } from "express";
import { deleteArtistsController, getAllArtistController, getArtistsByIdController, postArtistsController, putArtistsController } from "../controllers/artistsController";
import { getArtistById } from "../Services/artistService";

export const trackRouter: Router = Router();

trackRouter.get("/", getAllArtistController)
trackRouter.get("/:id", getArtistsByIdController)
trackRouter.post("/", postArtistsController)
trackRouter.put("/:id", putArtistsController)
trackRouter.delete("/:id", deleteArtistsController)