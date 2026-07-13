import { Router } from "express";
import {postController} from "../contrillers/post.controller";
import {inputResultValidation} from "../../../core/middlewares/validation/input-reult.validation";
import {postInputValidation} from "../validation/postInput.validation";
import {basicAdminGuardMiddleware} from "../../../auth/middlewares/super-admin.guard-middleware";
import {postQueryValidation} from "../validation/postQuery.validation";

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
)

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
