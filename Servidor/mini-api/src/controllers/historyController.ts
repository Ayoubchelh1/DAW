import { Request, Response } from "express";
import { history } from "../data/history/history";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { History } from "../interfaces/history/history";
import { HistoryBD } from "../interfaces/history/historyBD";
import { createHistory, getAllHistory, getHistoryById } from "../Services/historyService";

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

export function postHistoryController(req: Request, res: Response): Response {
    const result: CreateSuccessService<HistoryBD> | ErrorService = createHistory(req.body as History);
    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const createResult = result as CreateSuccessService<HistoryBD>;
    history.push(createResult.data);
    return res.status(createResult.code).json(createResult.data);
}