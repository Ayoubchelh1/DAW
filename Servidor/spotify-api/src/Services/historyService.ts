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

export function createHistory(historyRecord: History): CreateSuccessService<HistoryBD> | ErrorService {
    if (!isValidHistory(historyRecord)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const userId: string = historyRecord.userId.trim();
    const trackId: string = historyRecord.trackId.trim();

    if (!users.some((user) => user.id === userId)) {
        return { success: false, code: 404, message: `User ${userId} not found` };
    }
    if (!tracks.some((track) => track.id === trackId)) {
        return { success: false, code: 404, message: `Track ${trackId} not found` };
    }

    const createdHistory: HistoryBD = {
        id: randomUUID(),
        userId,
        trackId,
        date: historyRecord.date.trim()
    };

    return { success: true, code: 201, data: createdHistory };
}

export function updateHistory(idHistory: string, historyRecord: History): UpdateSuccessService<HistoryBD> | ErrorService {
    const historyIndex: number = history.findIndex((record: HistoryBD) => record.id === idHistory);
    if (historyIndex === -1) {
        return { success: false, code: 404, message: "History not found" };
    }

    if (!isValidHistory(historyRecord)) {
        return { success: false, code: 400, message: "invalid data" };
    }

    const userId: string = historyRecord.userId.trim();
    const trackId: string = historyRecord.trackId.trim();

    if (!users.some((user) => user.id === userId)) {
        return { success: false, code: 404, message: `User ${userId} not found` };
    }
    if (!tracks.some((track) => track.id === trackId)) {
        return { success: false, code: 404, message: `Track ${trackId} not found` };
    }

    const updatedHistory: HistoryBD = {
        id: idHistory,
        userId,
        trackId,
        date: historyRecord.date.trim()
    };

    return { success: true, code: 200, data: updatedHistory, index: historyIndex };
}