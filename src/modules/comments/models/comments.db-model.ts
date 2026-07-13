import {ObjectId} from "mongodb";

export interface CommentDbModel {
    _id: ObjectId;
    postId: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
}

export type CommentInsertModel = Omit<CommentDbModel, "_id">;
