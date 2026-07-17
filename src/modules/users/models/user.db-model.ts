import { ObjectId } from "mongodb";

export type EmailConfirmation = {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
};

export type UserDbModel = {
    _id: ObjectId;
    login: string;
    email: string;
    createdAt: Date;
    passwordHash: string;
    emailConfirmation: EmailConfirmation;
};

export type UserInsertModel = Omit<UserDbModel, "_id">;
