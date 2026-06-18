import { ObjectId } from "mongodb";

export type BlogDbModel = {
    _id: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};
