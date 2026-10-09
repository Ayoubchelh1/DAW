import { Router } from "express";
import { deleteUsersController, getAllUsersController, getUsersByIdController, postUsersController, putUsersController } from "../controllers/usersController";

export const usersRoutes: Router = Router();

usersRoutes.get("/", getAllUsersController)
usersRoutes.get("/:id", getUsersByIdController)
usersRoutes.post("/", postUsersController)
usersRoutes.put("/:id", putUsersController)
usersRoutes.delete("/:id", deleteUsersController)