import { Request } from "express";
import { CommentQueryInputModel } from "../models/comment-query-input.model";

export const getCommentsQueryParams = (
    req: Request,
): CommentQueryInputModel => ({
    sortBy:
        typeof req.query.sortBy === "string"
            ? req.query.sortBy
            : "createdAt",

    sortDirection:
        req.query.sortDirection === "asc"
            ? "asc"
            : "desc",

    pageNumber:
        Number(req.query.pageNumber) > 0
            ? Number(req.query.pageNumber)
            : 1,

    pageSize:
        Number(req.query.pageSize) > 0
            ? Number(req.query.pageSize)
            : 10,
});
