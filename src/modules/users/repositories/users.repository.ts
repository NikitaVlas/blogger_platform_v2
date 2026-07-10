import {UserQueryInputModel} from "../models/user-query-input.model";
import {UserPaginationViewModel} from "../models/user.pagination-view-model";
import {userCollection} from "../../../db/mongo.db";
import {ObjectId} from "mongodb";
import {UserViewModel} from "../models/user.view-model";
import {UserInsertModel} from "../models/user.db-model";
import {userMapper} from "../mappers/user.mapper";

export const usersRepository = {
    async findAll(query: UserQueryInputModel): Promise<UserPaginationViewModel> {
        const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = query;

        const orConditions = [];

        if (searchLoginTerm) {
            orConditions.push({
                login: { $regex: searchLoginTerm, $options: 'i' }
            });
        }

        if (searchEmailTerm) {
            orConditions.push({
                email: { $regex: searchEmailTerm, $options: 'i' }
            });
        }

        const filter = orConditions.length > 0
            ? { $or: orConditions }
            : {};

        const sortDirectionValue: 1 | -1 = sortDirection === 'asc' ? 1 : -1;
        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortDirectionValue
        };

        const skip = (pageNumber - 1) * pageSize;

        const totalCount = await userCollection.countDocuments(filter);

        const users = await userCollection
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .toArray();

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(userMapper)
        }
    },

    async create(userToInsert: UserInsertModel): Promise<UserViewModel> {
      const result = await userCollection.insertOne(userToInsert)

      return userMapper({
        _id: result.insertedId,
        ...userToInsert
      })
    },

    async delete(id: string): Promise<boolean> {
        const deleteResult = await userCollection.deleteOne({_id: new ObjectId(id)});

        return deleteResult.deletedCount > 0;
    }
};
