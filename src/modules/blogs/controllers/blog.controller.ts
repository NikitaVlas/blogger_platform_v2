import {blogsService} from "../service/blogs.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import { Request, Response } from "express";
import {getBlogsQueryParams} from "../helpers/get-blogs-query-params";
import {getPostsQueryParams} from "../../posts/helpers/get-posts-query-params";
import {postService} from "../../posts/service/post.service";

type BlogIdParams = {
    id: string;
};

type BlogPostsParams = {
    blogId: string;
};

export const blogController = {
    async getBlogs(req: Request, res: Response) {
        const query = getBlogsQueryParams(req);
        const blogs = await blogsService.findAll(query);

        return res.status(HttpStatus.OK).send(blogs)
    },

    async postBlog(req: Request, res: Response) {
        const blog = await blogsService.create(req.body);

        return res.status(HttpStatus.Created).send(blog)
    },

    async getBlogById(req: Request<BlogIdParams>, res: Response) {
        const blog = await blogsService.findById(req.params.id);

        if(!blog) {
            return res.sendStatus(HttpStatus.NotFound)
        }

        return res.status(HttpStatus.OK).send(blog)
    },

    async updateBlog(req: Request<BlogIdParams>, res: Response) {
        const isUpdated = await blogsService.update(req.params.id, req.body);

        if(!isUpdated) {
            return res.sendStatus(HttpStatus.NotFound)
        }

        return res.sendStatus(HttpStatus.NoContent)
    },

    async deleteBlog(req: Request<BlogIdParams>, res: Response) {
        const isDeleted = await blogsService.delete(req.params.id);

        if(!isDeleted) {
            return res.sendStatus(HttpStatus.NotFound)
        }

        return res.sendStatus(HttpStatus.NoContent)
    },

    async getPostsForBlog(req: Request<BlogPostsParams>, res: Response) {
        const blog = await blogsService.findById(
            req.params.blogId,
        );

        if (!blog) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        const query = getPostsQueryParams(req);

        const posts = await postService.findByBlogId(
            req.params.blogId,
            query,
        );

        return res.status(HttpStatus.OK).send(posts);
    },

    async createPostForBlog(
        req: Request<BlogPostsParams>,
        res: Response,
    ) {
        const blog = await blogsService.findById(
            req.params.blogId,
        );

        if (!blog) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        const post = await postService.create({
            ...req.body,
            blogId: req.params.blogId,
        });

        return res.status(HttpStatus.Created).send(post);
    },
}
