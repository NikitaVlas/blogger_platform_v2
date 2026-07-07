import {BlogViewModel} from "./blog.view-model";

export interface BlogPaginationViewModel {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewModel[];
}
