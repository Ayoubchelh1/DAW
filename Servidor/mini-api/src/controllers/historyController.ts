import { Request, Response } from "express";
import { HistoryBD } from "../interfaces/history/historyBD";
import { getAllHistory, getHistoryById } from "../Services/historyService";

export function getAllHistoryController(_req: Request, res: Response): Response {
    return res.status(200).json(getAllHistory());
}

export function getHistoryByIdController(req: Request, res: Response): Response {
    const historyRecord: HistoryBD | undefined = getHistoryById(req.params.id as string);
    if (!historyRecord) {
        return res.status(404).json({ message: "History not found" });
    }
    return res.status(200).json(historyRecord);
}