import {ObjectId} from "mongodb";

export interface PostDbModel {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
}

export type PostInsertModel = Omit<PostDbModel, "_id">;
