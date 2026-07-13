import {usersRepository} from "../repositories/users.repository";
import {UserQueryInputModel} from "../models/user-query-input.model";
import {UserPaginationViewModel} from "../models/user.pagination-view-model";
import {UserInputModel} from "../models/user.input-model";
import {UserViewModel} from "../models/user.view-model";
import bcrypt from "bcrypt";
import {UserInsertModel} from "../models/user.db-model";

type CreateUserResult =
    | { status: "success"; user: UserViewModel }
    | { status: "login-not-unique" }
    | { status: "email-not-unique" };

export const usersService = {
    async findAll(query: UserQueryInputModel):Promise<UserPaginationViewModel> {
        return usersRepository.findAll(query)
    },

    async create(newUserData: UserInputModel): Promise<CreateUserResult> {
        const userWithLogin = await usersRepository.findByLogin(newUserData.login);
        if(userWithLogin) return {status: "login-not-unique"}

        const userWithEmail = await usersRepository.findByEmail(newUserData.email);
        if(userWithEmail) return {status: "email-not-unique"}

        const passwordHash = await bcrypt.hash(newUserData.password, 10);

        const user = await usersRepository.create({
            login: newUserData.login,
            email: newUserData.email,
            passwordHash,
            createdAt: new Date(),
        })

        return {status: "success", user}
    },

    async delete(id: string): Promise<boolean> {
        return usersRepository.delete(id)
    }
}
