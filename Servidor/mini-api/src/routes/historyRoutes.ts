import { Router } from "express";
import { getAllHistoryController, getHistoryByIdController } from "../controllers/historyController";

export const historyRouter: Router = Router();

historyRouter.get("/", getAllHistoryController);
historyRouter.get("/:id", getHistoryByIdController);