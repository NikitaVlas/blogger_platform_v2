import { SortDirection } from "../../../core/types/core-types";

export interface CommentQueryInputModel {
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
}
