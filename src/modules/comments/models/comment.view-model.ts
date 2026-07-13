export interface CommentViewModel {
    id: string;
    content: string;
    createdAt: Date;
    commentatorInfo: CommentatorInfo;
}

export interface CommentatorInfo {
    userId: string;
    userLogin: string;
}
