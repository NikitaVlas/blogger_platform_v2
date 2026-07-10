import {usersRepository} from "../repositories/users.repository";
import {UserQueryInputModel} from "../models/user-query-input.model";
import {UserPaginationViewModel} from "../models/user.pagination-view-model";
import {UserInputModel} from "../models/user.input-model";
import {UserViewModel} from "../models/user.view-model";
import bcrypt from "bcrypt";
import {UserInsertModel} from "../models/user.db-model";


export const usersService = {
    async findAll(query: UserQueryInputModel):Promise<UserPaginationViewModel> {
        return usersRepository.findAll(query)
    },

    async create(newUserData: UserInputModel): Promise<UserViewModel> {
        const passwordHash = await bcrypt.hash(newUserData.password, 10);

        const userToInsert: UserInsertModel = {
            login: newUserData.login,
            email: newUserData.email,
            passwordHash,
            createdAt: new Date(),
        }

        return usersRepository.create(userToInsert)
    },

    async delete(id: string): Promise<boolean> {
        return usersRepository.delete(id)
    }
}
