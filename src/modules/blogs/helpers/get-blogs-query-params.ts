import {Request} from "express";
import {SortDirection} from "../../../core/types/core-types";
import {BlogQueryInputModel} from "../models/blog-query-input.model";

export const getBlogsQueryParams = (req: Request): BlogQueryInputModel => {
    const pageNumber = Number(req.query.pageNumber) > 0
        ? Number(req.query.pageNumber)
        : 1;
    const pageSize = Number(req.query.pageSize) > 0
        ? Number(req.query.pageSize)
        : 10;
    const sortBy = typeof req.query.sortBy === "string"
        ? req.query.sortBy
        : "createdAt";
    const sortDirection: SortDirection = req.query.sortDirection === "asc"
        ? "asc"
        : "desc";
    const searchNameTerm = typeof req.query.searchNameTerm === "string" && req.query.searchNameTerm.trim()
        ? req.query.searchNameTerm.trim()
        : null;

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm
    };
};
