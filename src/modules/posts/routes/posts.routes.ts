import { Router } from "express";
import {postController} from "../contrillers/post.controller";

export const postsRoutes = Router();

postsRoutes.get('/', postController.getAllPosts)

postsRoutes.post('/', postController.createPost)

postsRoutes.get('/:id', postController.getPostById)

postsRoutes.put('/:id', postController.updatePost)

postsRoutes.delete('/:id', postController.deletePost)
