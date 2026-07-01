import {HttpStatus} from "../../../core/types/http-statuses";
import {postService} from "../service/post.service";
import { Request, Response } from "express";

type PostIdParams = {
    id: string;
};

export const postController = {
    async getAllPosts(req: Request, res: Response) {
        const posts = await postService.findAll();

        res.status(HttpStatus.OK).send(posts)
    }
}
