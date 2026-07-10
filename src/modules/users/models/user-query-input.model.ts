import {SortDirection} from "../../../core/types/core-types";

export type UserQueryInputModel = {
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
};
