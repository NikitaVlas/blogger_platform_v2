import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { loginValidation } from "../validation/login.validation";
import { inputResultValidation } from "../../../core/middlewares/validation/input-reult.validation";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth.middleware";

export const authRoutes = Router();

authRoutes.post(
    "/login",
    ...loginValidation,
    inputResultValidation,
    authController.login,
);

authRoutes.get(
    "/me",
    bearerAuthMiddleware,
    authController.me,
);
