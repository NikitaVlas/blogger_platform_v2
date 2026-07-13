import {SortDirection} from "../../../core/types/core-types";

export interface PostQueryInputModel {
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
}
