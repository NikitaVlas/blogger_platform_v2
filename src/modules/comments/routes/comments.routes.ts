import { Router } from "express";
import { commentsController } from "../../../composition-root/container";
import { bearerAuthMiddleware } from "../../auth/middlewares/bearer-auth.middleware";
import { commentInputValidation } from "../validation/commentInput.validation";
import { inputResultValidation } from "../../../core/middlewares/validation/input-reult.validation";

export const commentsRoutes = Router();

commentsRoutes.get("/:id", commentsController.getById.bind(commentsController));

commentsRoutes.put(
  "/:commentId",
  bearerAuthMiddleware,
  ...commentInputValidation,
  inputResultValidation,
  commentsController.update.bind(commentsController),
);

commentsRoutes.delete(
  "/:commentId",
  bearerAuthMiddleware,
  commentsController.delete.bind(commentsController),
);
