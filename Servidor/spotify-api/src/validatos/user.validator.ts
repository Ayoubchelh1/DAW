import { User } from "../interfaces/user/user";

export function isValidUser(user: User): boolean {
    return Boolean(user)
        && typeof user.email === "string"
        && typeof user.countryId === "string"

}
