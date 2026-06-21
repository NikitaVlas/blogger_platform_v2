import { ObjectId } from "mongodb";

export type BlogDbModel = {
    _id: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
};

export type BlogInsertModel = Omit<BlogDbModel, "_id">;
