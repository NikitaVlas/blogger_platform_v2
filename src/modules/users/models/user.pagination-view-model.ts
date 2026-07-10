import {UserViewModel} from "./user.view-model";

export interface UserPaginationViewModel {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModel[];
}
