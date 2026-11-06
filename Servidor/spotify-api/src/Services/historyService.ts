import sql, { ConnectionPool, IResult, UniqueIdentifier } from "mssql";
import { getConnection } from "../config/database";
import { randomUUID } from "crypto";
import { history } from "../data/history/history";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { UpdateSuccessService } from "../interfaces/error/updateSuccessService";
import { History } from "../interfaces/history/history";
import { HistoryBD } from "../interfaces/history/historyBD";
import { tracks } from "../data/track/track";
import { users } from "../data/user/user";
import { isValidHistory } from "../validatos/history.validator";

export function getAllHistory(): HistoryBD[] {
    return history;
}

export function getHistoryById(idHistory: string): HistoryBD | undefined {
    return history.find((historyRecord: HistoryBD) => historyRecord.id === idHistory);
}

export function createHistory(historyRecord: History): CreateSuccessService | ErrorService {
    if (!isValidHistory(historyRecord)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const userId: string = historyRecord.user.trim();
    const trackId: string = historyRecord.track.trim();

    if (!users.some((user) => user.id === userId)) {
        return { success: false, code: 404, message: `User ${userId} not found` };
    }
    if (!tracks.some((track) => track.id === trackId)) {
        return { success: false, code: 404, message: `Track ${trackId} not found` };
    }


    return { success: true, code: 201, data: 1 };
}

export function updateHistory(idHistory: string, historyRecord: History): UpdateSuccessService<HistoryBD> | ErrorService {
    const historyIndex: number = history.findIndex((record: HistoryBD) => record.id === idHistory);
    if (historyIndex === -1) {
        return { success: false, code: 404, message: "History not found" };
    }

    if (!isValidHistory(historyRecord)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const userId: string = historyRecord.user.trim();
    const trackId: string = historyRecord.track.trim();

    if (!users.some((user) => user.id === userId)) {
        return { success: false, code: 404, message: `User ${userId} not found` };
    }
    if (!tracks.some((track) => track.id === trackId)) {
        return { success: false, code: 404, message: `Track ${trackId} not found` };
    }


    return { success: true, code: 200, data: 1 };
}


export async function addTrackUserHistory(historyTrack: History): Promise<CreateSuccessService | ErrorService> {

    if (!isValidHistory(historyTrack)) {
        return { success: false, code: 400, message: "invalid data" }
    }

    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();
    const queryText: string = 'INSERT INTO HISTORY(user_id,track_id)VALUES(@user_id,@track_id)';

    request.input("user_id", sql.UniqueIdentifier, historyTrack.user);
    request.input("track_id", sql.UniqueIdentifier, historyTrack.track);


    const result: IResult<number> = await request.query(queryText);

    return { success: true, code: 201, data: result.rowsAffected[0] };

}