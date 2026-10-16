import { Router } from "express";
import { getAllHistoryController, getHistoryByIdController, postHistoryController, putHistoryController } from "../controllers/historyController";

export const historyRouter: Router = Router();

historyRouter.get("/", getAllHistoryController);
historyRouter.get("/:id", getHistoryByIdController);
historyRouter.post("/", postHistoryController);
historyRouter.put("/:id", putHistoryController);