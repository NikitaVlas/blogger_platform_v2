import { Request } from "express";
import { UserDbModel } from "../../users/models/user.db-model";

export type AuthRequest = Request & {
    user: UserDbModel;
};
