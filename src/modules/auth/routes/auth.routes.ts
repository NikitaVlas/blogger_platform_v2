import { Router } from "express";
import { authController } from "../../../composition-root/container";
import { loginValidation } from "../validation/login.validation";
import { inputResultValidation } from "../../../core/middlewares/validation/input-reult.validation";
import { bearerAuthMiddleware } from "../middlewares/bearer-auth.middleware";
import { registrationConfirmationValidation } from "../validation/registration-confirmation.validation";
import { userInputValidation } from "../../users/validation/userInput.validation";
import { registrationEmailResendingValidation } from "../validation/registration-email-resending.validation";
import {
  newPasswordValidation,
  passwordRecoveryValidation,
} from "../validation/password-recovery.validation";

export const authRoutes = Router();

authRoutes.post(
  "/password-recovery",
  ...passwordRecoveryValidation,
  inputResultValidation,
  authController.passwordRecovery.bind(authController),
);
authRoutes.post(
  "/new-password",
  ...newPasswordValidation,
  inputResultValidation,
  authController.newPassword.bind(authController),
);

authRoutes.post(
  "/login",
  ...loginValidation,
  inputResultValidation,
  authController.login.bind(authController),
);

authRoutes.post(
  "/refresh-token",
  authController.refreshToken.bind(authController),
);

authRoutes.post("/logout", authController.logout.bind(authController));

authRoutes.get(
  "/me",
  bearerAuthMiddleware,
  authController.me.bind(authController),
);

authRoutes.post(
  "/registration",
  ...userInputValidation,
  inputResultValidation,
  authController.registration.bind(authController),
);

authRoutes.post(
  "/registration-confirmation",
  ...registrationConfirmationValidation,
  inputResultValidation,
  authController.registrationConfirmation.bind(authController),
);

authRoutes.post(
  "/registration-email-resending",
  ...registrationEmailResendingValidation,
  inputResultValidation,
  authController.registrationEmailResending.bind(authController),
);
