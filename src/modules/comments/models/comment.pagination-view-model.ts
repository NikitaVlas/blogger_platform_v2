import {CommentViewModel} from "./comment.view-model";

export interface CommentPaginationViewModel {
    pageCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModel[];
}
