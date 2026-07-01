import {PostViewModel} from "./post.view-model";

export interface PostPaginationViewModel {
    pageCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewModel[];
}
