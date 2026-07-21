import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { loginValidation } from "../validation/login.validation";
import { inputResultValidation } from "../../../core/middlewares/validation/input-reult.validation";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth.middleware";
import {registrationConfirmationValidation} from "../validation/registration-confirmation.validation";
import {userInputValidation} from "../../users/validation/userInput.validation";
import {registrationEmailResendingValidation} from "../validation/registration-email-resending.validation";

export const authRoutes = Router();

authRoutes.post(
    "/login",
    ...loginValidation,
    inputResultValidation,
    authController.login,
);

authRoutes.post(
    "/refresh-token",
    authController.refreshToken,
);

authRoutes.post(
    "/logout",
    authController.logout,
);

authRoutes.get(
    "/me",
    bearerAuthMiddleware,
    authController.me,
);

authRoutes.post(
    "/registration",
    ...userInputValidation,
    inputResultValidation,
    authController.registration,
);

authRoutes.post(
    "/registration-confirmation",
    ...registrationConfirmationValidation,
    inputResultValidation,
    authController.registrationConfirmation,
);

authRoutes.post(
    "/registration-email-resending",
    ...registrationEmailResendingValidation,
    inputResultValidation,
    authController.registrationEmailResending,
);
