import sql, { ConnectionPool, IResult } from "mssql";
import { getConnection } from "../config/database";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { SelectSuccessService } from "../interfaces/error/SelectSuccessService copy";
import { Like } from "../interfaces/like/like";
import { LikeSummary } from "../interfaces/like/likeSummary";
import { isValidLike } from "../validatos/like.validator";

export async function getTrackLikeSummary(trackId: string, userId: string): Promise<SelectSuccessService<LikeSummary> | ErrorService> {
    if (!isValidLike({ user: userId, track: trackId, likeTrack: 1 })) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();
    request.input("track_id", sql.UniqueIdentifier, trackId);
    request.input("user_id", sql.UniqueIdentifier, userId);

    const queryText: string = 'SELECT COALESCE(SUM([likeTrack]), 0) AS totalLikes, (SELECT TOP 1 [likeTrack] FROM Likes WHERE track_id = @track_id AND user_id = @user_id ORDER BY [date] DESC) AS userLike FROM Likes WHERE track_id = @track_id';

    const result: IResult<LikeSummary> = await request.query(queryText);
    return { success: true, code: 200, data: result.recordset[0] };
}

export async function addTrackLike(like: Like): Promise<CreateSuccessService | ErrorService> {
    if (!isValidLike(like)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const pool: ConnectionPool = await getConnection();
    const request: sql.Request = pool.request();
    const queryText: string = 'INSERT INTO Likes(user_id,track_id,[likeTrack])VALUES(@user_id,@track_id,@likeTrack)';

    request.input("user_id", sql.UniqueIdentifier, like.user);
    request.input("track_id", sql.UniqueIdentifier, like.track);
    request.input("likeTrack", sql.Int, like.likeTrack);

    const result: IResult<number> = await request.query(queryText);
    return { success: true, code: 201, data: result.rowsAffected[0] };
}
