import { users } from "../data/user/user";
import { UserBD } from "../interfaces/user/userBD";

export function getAllUsers(): UserBD[] {
    return users;
}

export function getUserById(idUser: string): UserBD | undefined {
    return users.find((user: UserBD) => user.id === idUser);
}
