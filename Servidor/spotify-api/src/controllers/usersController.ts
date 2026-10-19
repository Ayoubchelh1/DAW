import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { SelectSuccessService } from "../interfaces/error/SelectSuccessService copy";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { UserBD } from "../interfaces/user/userBD";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../Services/userService";
import { Response, Request } from "express";

export async function getAllUsersController(_req: Request, res: Response): Promise<Response> {
    const users: UserBD[] = await getAllUsers();
    return res.status(200).json(users);
}

export async function getUsersByIdController(req: Request, res: Response): Promise<Response> {
    const result: SelectSuccessService<UserBD> | ErrorService = await getUserById(req.params.id as string);

    if (!result.success) {
        return res.status(result.code).json({ message: (result as ErrorService).message });
    }

    return res.status(result.code).json(result);
}

export function postUsersController(req: Request, res: Response): Response {
    const result: CreateSuccessService<UserBD> | ErrorService = createUser(req.body);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<UserBD>;

    return res.status(createResult.code).json(createResult);
}

export function putUsersController(req: Request, res: Response): Response {
    const idUser: string = req.params.id as string;

    const result: UpdateSuccessService<UserBD> | ErrorService = updateUser(idUser, req.body);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const updateResult = result as UpdateSuccessService<UserBD>;

    return res.status(updateResult.code).json(updateResult.data);
}

export function deleteUsersController(req: Request, res: Response): Response {
    const result: DeleteSuccessService | ErrorService = deleteUser(req.params.id as string);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }


    return res.status(result.code).json({ result });
}