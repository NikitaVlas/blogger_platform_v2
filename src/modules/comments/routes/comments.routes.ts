import { Router } from "express";
import { commentsController } from "../controllers/comments.controller";
import { bearerAuthMiddleware } from "../../auth/middlewares/bearer-auth.middleware";
import { commentInputValidation } from "../validation/commentInput.validation";
import { inputResultValidation } from "../../../core/middlewares/validation/input-reult.validation";

export const commentsRoutes = Router();

commentsRoutes.get(
    "/:id",
    commentsController.getById,
);

commentsRoutes.put(
    "/:commentId",
    bearerAuthMiddleware,
    ...commentInputValidation,
    inputResultValidation,
    commentsController.update,
);

commentsRoutes.delete(
    "/:commentId",
    bearerAuthMiddleware,
    commentsController.delete,
);
