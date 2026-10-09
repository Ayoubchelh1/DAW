import { Router } from "express";
import { getAllCountriesController, getCountriesByIdController, postCountriesController, putCountriesController } from "../controllers/countriesController";

export const countriesRouter: Router = Router();

countriesRouter.get("/", getAllCountriesController)
countriesRouter.get("/:id", getCountriesByIdController)
countriesRouter.post("/", postCountriesController)
countriesRouter.put("/:id", putCountriesController)
