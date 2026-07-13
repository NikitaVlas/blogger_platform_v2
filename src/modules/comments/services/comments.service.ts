import { UserDbModel } from "../../users/models/user.db-model";
import { CommentViewModel } from "../models/comment.view-model";
import { CommentPaginationViewModel } from "../models/comment.pagination-view-model";
import { CommentQueryInputModel } from "../models/comment-query-input.model";
import { commentsRepository } from "../repositories/comments.repository";

export type ChangeCommentResult =
    | { status: "success" }
    | { status: "not-found" }
    | { status: "forbidden" };

export const commentsService = {
    async findById(
        id: string,
    ): Promise<CommentViewModel | null> {
        return commentsRepository.findById(id);
    },

    async findForPost(
        postId: string,
        query: CommentQueryInputModel,
    ): Promise<CommentPaginationViewModel> {
        return commentsRepository.findForPost(
            postId,
            query,
        );
    },

    async create(postId: string,
        content: string,
        user: UserDbModel,
    ): Promise<CommentViewModel> {
        return commentsRepository.create({
            postId,
            content,
            commentatorInfo: {
                userId: user._id.toString(),
                userLogin: user.login,
            },
            createdAt: new Date(),
        });
    },

    async update(commentId: string, content: string, currentUserId: string): Promise<ChangeCommentResult> {
        const comment =
            await commentsRepository.findDbById(
                commentId,
            );

        if (!comment) {
            return {
                status: "not-found",
            };
        }

        if (
            comment.commentatorInfo.userId !==
            currentUserId
        ) {
            return {
                status: "forbidden",
            };
        }

        await commentsRepository.update(
            commentId,
            content,
        );

        return {
            status: "success",
        };
    },

    async delete(commentId: string, currentUserId: string): Promise<ChangeCommentResult> {
        const comment = await commentsRepository.findDbById(commentId);

        if (!comment) {
            return {
                status: "not-found",
            };
        }

        if (
            comment.commentatorInfo.userId !== currentUserId
        ) {
            return {
                status: "forbidden",
            };
        }

        await commentsRepository.delete(commentId);

        return {
            status: "success",
        };
    },
};
