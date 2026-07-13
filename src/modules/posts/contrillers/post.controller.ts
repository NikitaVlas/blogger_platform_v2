import {HttpStatus} from "../../../core/types/http-statuses";
import {postService} from "../service/post.service";
import { Request, Response } from "express";
import {getPostsQueryParams} from "../helpers/get-posts-query-params";

type PostIdParams = {
    id: string;
};

export const postController = {
    async getAllPosts(req: Request, res: Response) {
        const query = getPostsQueryParams(req);
        const posts = await postService.findAll(query);

        return res.status(HttpStatus.OK).send(posts);
    },

    async createPost(req: Request, res: Response) {
        const createdPost = await postService.create(req.body);

        res.status(HttpStatus.Created).send(createdPost)
    },

    async getPostById(req: Request<PostIdParams>, res: Response) {
        const post = await postService.findById(req.params.id);

        if(!post) {
            res.sendStatus(HttpStatus.NotFound)
            return
        }

        res.status(HttpStatus.OK).send(post)
    },

    async updatePost(req: Request<PostIdParams>, res: Response) {
        const isUpdated = await postService.update(req.params.id, req.body);

        if(!isUpdated) {
            res.sendStatus(HttpStatus.NotFound)
            return
        }

        res.sendStatus(HttpStatus.NoContent)
    },

    async deletePost(req: Request<PostIdParams>, res: Response) {
        const isDeleted = await postService.delete(req.params.id);

        if(!isDeleted) {
            res.sendStatus(HttpStatus.NotFound)
            return
        }

        res.sendStatus(HttpStatus.NoContent)
    }
}
