import { Router } from "express";
import {postController} from "../contrillers/post.controller";
import {inputResultValidation} from "../../../core/middlewares/validation/input-reult.validation";
import {postInputValidation} from "../validation/postInput.validation";
import {basicAdminGuardMiddleware} from "../../../auth/middlewares/super-admin.guard-middleware";
import {postQueryValidation} from "../validation/postQuery.validation";
import {bearerAuthMiddleware} from "../../auth/middlewares/bearer-auth.middleware";
import {commentInputValidation} from "../../comments/validation/commentInput.validation";
import {commentsController} from "../../comments/controllers/comments.controller";
import {commentQueryValidation} from "../../comments/validation/commentQuery.validation";

export const postsRoutes = Router();

postsRoutes.get(
    "/",
    ...postQueryValidation,
    inputResultValidation,
    postController.getAllPosts,
);

postsRoutes.post('/',
    basicAdminGuardMiddleware,
    ...postInputValidation,
    inputResultValidation,
    postController.createPost,
);

postsRoutes.get(
    "/:postId/comments",
    ...commentQueryValidation,
    inputResultValidation,
    commentsController.getForPost,
);

postsRoutes.post(
    "/:postId/comments",
    bearerAuthMiddleware,
    ...commentInputValidation,
    inputResultValidation,
    commentsController.createForPost,
);

postsRoutes.get('/:id', postController.getPostById)

postsRoutes.put('/:id',
    basicAdminGuardMiddleware,
    ...postInputValidation,
    inputResultValidation,
    postController.updatePost
)

postsRoutes.delete('/:id',
    basicAdminGuardMiddleware,
    postController.deletePost
)
