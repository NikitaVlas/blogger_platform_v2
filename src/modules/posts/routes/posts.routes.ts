import { Router } from "express";
import {postController} from "../contrillers/post.controller";

export const postsRoutes = Router();

postsRoutes.get('/', postController.getAllPosts)
