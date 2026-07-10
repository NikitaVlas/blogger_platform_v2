import {UserDbModel} from "../models/user.db-model";


export const userMapper = (user: UserDbModel) => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
};
