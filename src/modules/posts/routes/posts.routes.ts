import { Router } from "express";
import { postController } from "../../../composition-root/container";
import { inputResultValidation } from "../../../core/middlewares/validation/input-reult.validation";
import { postInputValidation } from "../validation/postInput.validation";
import { basicAdminGuardMiddleware } from "../../../auth/middlewares/super-admin.guard-middleware";
import { postQueryValidation } from "../validation/postQuery.validation";
import { bearerAuthMiddleware } from "../../auth/middlewares/bearer-auth.middleware";
import { commentInputValidation } from "../../comments/validation/commentInput.validation";
import { commentsController } from "../../../composition-root/container";
import { commentQueryValidation } from "../../comments/validation/commentQuery.validation";

export const postsRoutes = Router();

postsRoutes.get(
  "/",
  ...postQueryValidation,
  inputResultValidation,
  postController.getAllPosts.bind(postController),
);

postsRoutes.post(
  "/",
  basicAdminGuardMiddleware,
  ...postInputValidation,
  inputResultValidation,
  postController.createPost.bind(postController),
);

postsRoutes.get(
  "/:postId/comments",
  ...commentQueryValidation,
  inputResultValidation,
  commentsController.getForPost.bind(commentsController),
);

postsRoutes.post(
  "/:postId/comments",
  bearerAuthMiddleware,
  ...commentInputValidation,
  inputResultValidation,
  commentsController.createForPost.bind(commentsController),
);

postsRoutes.get("/:id", postController.getPostById.bind(postController));

postsRoutes.put(
  "/:id",
  basicAdminGuardMiddleware,
  ...postInputValidation,
  inputResultValidation,
  postController.updatePost.bind(postController),
);

postsRoutes.delete(
  "/:id",
  basicAdminGuardMiddleware,
  postController.deletePost.bind(postController),
);
