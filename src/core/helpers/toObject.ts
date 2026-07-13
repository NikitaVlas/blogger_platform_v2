import { ObjectId } from "mongodb";

export const toObjectId = (id: string): ObjectId | null => {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
};
