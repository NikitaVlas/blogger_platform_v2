import bcrypt from "bcrypt";
import {UserDbModel} from "../../users/models/user.db-model";
import {usersRepository} from "../../users/repositories/users.repository";

export const authService = {
    async validateCredentials(loginOrEmail: string, password: string): Promise<UserDbModel | null> {
        const user =
            await usersRepository
                .findByLoginOrEmail(
                    loginOrEmail,
                );

        if (!user) {
            return null;
        }

        if (
            !user.emailConfirmation
                .isConfirmed
        ) {
            return null;
        }

        const passwordIsCorrect =
            await bcrypt.compare(
                password,
                user.passwordHash,
            );

        return passwordIsCorrect
            ? user
            : null;
    },
};
