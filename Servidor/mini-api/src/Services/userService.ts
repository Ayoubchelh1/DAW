import { randomUUID } from "crypto";
import { users } from "../data/user/user";
import { User } from "../interfaces/user/user";
import { UserBD } from "../interfaces/user/userBD";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { isValidUser } from "../validatos/user.validator";

export function getAllUsers(): UserBD[] {
    return users;
}

export function getUserById(idUser: string): UserBD | undefined {
    return users.find((user: UserBD) => user.id === idUser);
}

export function createUser(user: User): CreateSuccessService<UserBD> | ErrorService {
    if (!isValidUser(user)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const userRecord: UserBD = {
        id: randomUUID(),
        email: user.email.trim(),
        countryId: user.countryId
    };

    return { success: true, code: 201, data: userRecord };
}
