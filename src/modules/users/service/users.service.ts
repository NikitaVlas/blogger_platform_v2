import { UsersRepository } from "../repositories/users.repository";
import { UserQueryInputModel } from "../models/user-query-input.model";
import { UserPaginationViewModel } from "../models/user.pagination-view-model";
import { UserInputModel } from "../models/user.input-model";
import { UserViewModel } from "../models/user.view-model";
import bcrypt from "bcrypt";
import { MongoServerError } from "mongodb";

type CreateUserResult =
  | { status: "success"; user: UserViewModel }
  | { status: "login-not-unique" }
  | { status: "email-not-unique" };

export class UsersService {
  constructor(private readonly repository: UsersRepository) {}
  async findAll(query: UserQueryInputModel): Promise<UserPaginationViewModel> {
    return this.repository.findAll(query);
  }

  async create(newUserData: UserInputModel): Promise<CreateUserResult> {
    const userWithLogin = await this.repository.findByLogin(newUserData.login);

    if (userWithLogin) {
      return {
        status: "login-not-unique",
      };
    }

    const userWithEmail = await this.repository.findByEmail(newUserData.email);

    if (userWithEmail) {
      return {
        status: "email-not-unique",
      };
    }

    const passwordHash = await bcrypt.hash(newUserData.password, 10);

    let user: UserViewModel;

    try {
      user = await this.repository.create({
        login: newUserData.login,
        email: newUserData.email,
        passwordHash,
        createdAt: new Date(),
        emailConfirmation: {
          confirmationCode: null,
          expirationDate: null,
          isConfirmed: true,
        },
        passwordRecovery: {
          recoveryCode: null,
          expirationDate: null,
        },
      });
    } catch (error: unknown) {
      if (error instanceof MongoServerError && error.code === 11000) {
        const duplicatedField = Object.keys(error.keyPattern ?? {})[0];

        if (duplicatedField === "login") {
          return {
            status: "login-not-unique",
          };
        }

        if (duplicatedField === "email") {
          return {
            status: "email-not-unique",
          };
        }
      }

      throw error;
    }

    return {
      status: "success",
      user,
    };
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
