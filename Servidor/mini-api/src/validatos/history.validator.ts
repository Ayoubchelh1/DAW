import { History } from "../interfaces/history/history";

export function isValidHistory(history: History): boolean {
    return Boolean(history)
        && typeof history.userId === "string"
        && history.userId.trim().length > 0
        && typeof history.trackId === "string"
        && history.trackId.trim().length > 0
        && typeof history.date === "string"
        && history.date.trim().length > 0;
}
