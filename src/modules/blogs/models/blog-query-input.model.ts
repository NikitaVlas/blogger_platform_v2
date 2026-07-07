import {SortDirection} from "../../../core/types/core-types";

export type BlogQueryInputModel = {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
};
