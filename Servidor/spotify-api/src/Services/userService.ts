import { users } from "../data/user/user";
import { User } from "../interfaces/user/user";
import { UserBD } from "../interfaces/user/userBD";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { DeleteSuccessService } from "../interfaces/error/deleteSuccessService";
import { isValidUser } from "../validatos/user.validator";
import { ConnectionPool, IResult } from "mssql";
import { getConnection } from "../config/database";
import sql from "mssql";
import { SelectSuccessService } from "../interfaces/error/SelectSuccessService copy";

export async function getAllUsers(): Promise<UserBD[]> {
    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();
    const queryText: string = 'Select * from Track';

    const result: IResult<UserBD> = await request.query(queryText);
    return result.recordset;
}

export async function getUserById(idUser: string): Promise<SelectSuccessService<UserBD> | ErrorService> {
    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();
    const queryText: string = 'Select * User Track Where User.id = @id';
    request.input("id", sql.UniqueIdentifier, idUser);

    const result: IResult<UserBD> = await request.query(queryText);

    if (result.recordset.length === 0) {
        return {
            success: false,
            code: 404,
            message: "User not found"
        };
    }

    return {
        success: true,
        code: 200,
        data: result.recordset[0]
    };
}

export async function createUser(user: User): Promise<CreateSuccessService<number> | ErrorService> {
    if (!isValidUser(user)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const email: string = user.email.trim();
    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();

    const queryText: string = "INSERT INTO [User](email, country_id) VALUES(@email, @countryId)";

    request.input("email", sql.NVarChar, email);
    request.input("countryId", sql.UniqueIdentifier, user.countryId);

    const result: IResult<number> = await request.query(queryText);

    return { success: true, code: 201, data: result.rowsAffected[0] };
}

export function updateUser(idUser: string, user: User): UpdateSuccessService<UserBD> | ErrorService {
    const userIndex: number = users.findIndex((user: UserBD) => user.id === idUser);
    if (userIndex === -1) {
        return { success: false, code: 404, message: "User not found" };
    }

    if (!isValidUser(user)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const updatedUser: UserBD = {
        id: idUser,
        email: user.email.trim(),
        countryId: user.countryId
    };

    return { success: true, code: 200, data: updatedUser, index: userIndex };
}

export function deleteUser(idUser: string): DeleteSuccessService | ErrorService {
    const userIndex: number = users.findIndex((user: UserBD) => user.id === idUser);

    if (userIndex === -1) {
        return { success: false, code: 404, message: "User not found" };
    }

    return { success: true, code: 204, index: userIndex };
}
