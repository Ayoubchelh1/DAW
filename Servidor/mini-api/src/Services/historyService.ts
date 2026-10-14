import { history } from "../data/history/history";
import { HistoryBD } from "../interfaces/history/historyBD";

export function getAllHistory(): HistoryBD[] {
    return history;
}

export function getHistoryById(idHistory: string): HistoryBD | undefined {
    return history.find((historyRecord: HistoryBD) => historyRecord.id === idHistory);
}