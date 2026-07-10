import {Request} from "express";
import {SortDirection} from "../../../core/types/core-types";
import {UserQueryInputModel} from "../models/user-query-input.model";

export const getUsersQueryParams = (req: Request): UserQueryInputModel => {
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
    const searchLoginTerm = typeof req.query.searchLoginTerm === "string" && req.query.searchLoginTerm.trim()
        ? req.query.searchLoginTerm.trim()
        : null;
    const searchEmailTerm = typeof req.query.searchEmailTerm === "string" && req.query.searchEmailTerm.trim()
        ? req.query.searchEmailTerm.trim()
        : null;

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
        searchEmailTerm
    };
};
