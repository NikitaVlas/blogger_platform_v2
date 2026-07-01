import {BlogViewModel} from "./blog.view-model";

export interface BlogPaginationViewModel {
    pageCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewModel[];
}
