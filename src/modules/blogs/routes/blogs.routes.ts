import { Router } from "express";
import {blogController} from "../controllers/blog.controller";
import {basicAdminGuardMiddleware} from "../../../auth/middlewares/super-admin.guard-middleware";
import {inputResultValidation} from "../../../core/middlewares/validation/input-reult.validation";
import {blogInputValidation} from "../vaidation/blogInput.validation";
import {blogQueryValidation} from "../vaidation/blogQuery.validation";
import {postQueryValidation} from "../../posts/validation/postQuery.validation";
import {blogPostInputValidation} from "../../posts/validation/postInput.validation";

export const blogsRoutes = Router();

blogsRoutes.get('/',
    ...blogQueryValidation,
    inputResultValidation,
    blogController.getBlogs.bind(blogController)
)

blogsRoutes.post('/',
    basicAdminGuardMiddleware,
    ...blogInputValidation,
    inputResultValidation,
    blogController.postBlog.bind(blogController)
)

blogsRoutes.get(
    "/:blogId/posts",
    ...postQueryValidation,
    inputResultValidation,
    blogController.getPostsForBlog.bind(blogController),
);

blogsRoutes.post(
    "/:blogId/posts",
    basicAdminGuardMiddleware,
    ...blogPostInputValidation,
    inputResultValidation,
    blogController.createPostForBlog.bind(blogController),
);

blogsRoutes.get('/:id',
    blogController.getBlogById.bind(blogController)
)

blogsRoutes.put('/:id',
    basicAdminGuardMiddleware,
    ...blogInputValidation,
    inputResultValidation,
    blogController.updateBlog.bind(blogController)
)

blogsRoutes.delete('/:id',
    basicAdminGuardMiddleware,
    blogController.deleteBlog.bind(blogController)
)
