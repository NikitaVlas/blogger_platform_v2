import {blogsService} from "../service/blogs.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import { Request, Response } from "express";

type BlogIdParams = {
    id: string;
};

export const blogController = {
    async getBlogs(req: Request, res: Response) {
        const blogs = await blogsService.findAll();

        res.status(HttpStatus.OK).send(blogs)
    },

    async postBlog(req: Request, res: Response) {
        const blog = await blogsService.create(req.body);

        res.status(HttpStatus.Created).send(blog)
    },

    async getBlogById(req: Request<BlogIdParams>, res: Response) {
        const blog = await blogsService.findById(req.params.id);

        if(!blog) {
            res.status(HttpStatus.NotFound)
            return
        }

        res.status(HttpStatus.OK).send(blog)
    },

    async updateBlog(req: Request<BlogIdParams>, res: Response) {
        const isUpdated = await blogsService.update(req.params.id, req.body);

        if(!isUpdated) {
            res.status(HttpStatus.NotFound)
            return
        }

        res.status(HttpStatus.NoContent)
    },

    async deleteBlog(req: Request<BlogIdParams>, res: Response) {
        const isDeleted = await blogsService.delete(req.params.id);

        if(!isDeleted) {
            res.status(HttpStatus.NotFound)
            return
        }

        res.status(HttpStatus.NoContent)
    }
}
