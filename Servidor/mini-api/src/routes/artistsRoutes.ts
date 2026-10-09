import { Router } from "express";
import { deleteArtistsController, getAllArtistController, getArtistsByIdController, postArtistsController, putArtistsController } from "../controllers/artistsController";
import { getArtistById } from "../Services/artistService";

export const artistRouter: Router = Router();

artistRouter.get("/", getAllArtistController)
artistRouter.get("/:id", getArtistsByIdController)
artistRouter.post("/", postArtistsController)
artistRouter.put("/:id", putArtistsController)
artistRouter.delete("/:id", deleteArtistsController)