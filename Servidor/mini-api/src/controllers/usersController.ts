import { users } from "../data/user/user";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { UserBD } from "../interfaces/user/userBD";
import { getAllUsers, getUserById, updateUser } from "../Services/userService";
import { Response, Request } from "express";

export function getAllUsersController(_req: Request, res: Response): Response {
    return res.status(200).json(getAllUsers());
}

export function getUsersByIdController(req: Request, res: Response): Response {
    const idUser: string = req.params.id as string;
    const user: UserBD | undefined = getUserById(idUser);
    if (!user) {
        return res.status(404).json({ message: `User ${idUser} not found` });
    }
    return res.status(200).json(user);
}

export function putUsersController(req: Request, res: Response): Response {
    const idUser: string = req.params.id as string;

    const result: UpdateSuccessService<UserBD> | ErrorService = updateUser(idUser, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<UserBD>;
    users[updateResult.index] = updateResult.data;
    return res.status(updateResult.code).json(updateResult.data);
}