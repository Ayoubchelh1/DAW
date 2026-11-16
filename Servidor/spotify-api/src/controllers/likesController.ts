import { Request, Response } from "express";
import { CreateSuccessService } from "../interfaces/error/createSuccessService";
import { ErrorService } from "../interfaces/error/trackInvalidData";
import { Like } from "../interfaces/like/like";
import { LikeSummary } from "../interfaces/like/likeSummary";
import { SelectSuccessService } from "../interfaces/error/SelectSuccessService copy";
import { addTrackLike, getTrackLikeSummary } from "../Services/likeService";

export async function getTrackLikeSummaryController(req: Request, res: Response): Promise<Response> {
    const result: SelectSuccessService<LikeSummary> | ErrorService = await getTrackLikeSummary(
        req.params.trackId as string,
        req.query.user_id as string
    );

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    const summaryResult = result as SelectSuccessService<LikeSummary>;
    return res.status(summaryResult.code).json(summaryResult.data);
}

export async function postLikeController(req: Request, res: Response): Promise<Response> {
    const result: CreateSuccessService | ErrorService = await addTrackLike(req.body as Like);

    if (!result.success) {
        const errorResult = result as ErrorService;
        return res.status(errorResult.code).json({ message: errorResult.message });
    }

    return res.status(result.code).json(result);
}
