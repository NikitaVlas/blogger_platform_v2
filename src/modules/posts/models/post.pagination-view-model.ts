import {PostViewModel} from "./post.view-model";

export interface PostPaginationViewModel {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewModel[];
}
