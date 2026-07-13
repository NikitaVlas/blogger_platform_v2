import { CommentDbModel } from "../models/comments.db-model";
import { CommentViewModel } from "../models/comment.view-model";

export const commentMapper = (comment: CommentDbModel): CommentViewModel => ({
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
});
