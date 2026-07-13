import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { UserDbModel } from "../../users/models/user.db-model";

export type AuthRequest<
    Params = ParamsDictionary,
> = Request<Params> & {
    user: UserDbModel;
};
