import bcrypt from "bcrypt";
import { UserDbModel } from "../../users/models/user.db-model";
import { UsersRepository } from "../../users/repositories/users.repository";
import { randomUUID } from "node:crypto";

export class AuthService {
  constructor(private readonly usersRepo: UsersRepository) {}
  async validateCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDbModel | null> {
    const user = await this.usersRepo.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    if (!user.emailConfirmation.isConfirmed) {
      return null;
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash);

    return passwordIsCorrect ? user : null;
  }

  async requestPasswordRecovery(
    email: string,
  ): Promise<{ email: string; code: string } | null> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) return null;
    const code = randomUUID();
    await this.usersRepo.setRecoveryCode(
      user._id,
      code,
      new Date(Date.now() + 60 * 60 * 1000),
    );
    return { email: user.email, code };
  }

  async confirmPasswordRecovery(
    newPassword: string,
    recoveryCode: string,
  ): Promise<boolean> {
    return this.usersRepo.updatePasswordByRecoveryCode(
      recoveryCode,
      await bcrypt.hash(newPassword, 10),
    );
  }
}
