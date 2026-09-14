import { HttpStatus } from "../../../core/types/http-statuses";
import { PostsService } from "../service/post.service";
import { Request, Response } from "express";
import { getPostsQueryParams } from "../helpers/get-posts-query-params";

type PostIdParams = {
  id: string;
};

export class PostsController {
  constructor(private readonly service: PostsService) {}
  async getAllPosts(req: Request, res: Response) {
    const query = getPostsQueryParams(req);
    const posts = await this.service.findAll(query);

    return res.status(HttpStatus.OK).send(posts);
  }

  async createPost(req: Request, res: Response) {
    const createdPost = await this.service.create(req.body);

    if (!createdPost) {
      return res.status(HttpStatus.BadRequest).send({
        errorsMessages: [
          {
            field: "blogId",
            message: "blogId must reference an existing blog",
          },
        ],
      });
    }

    res.status(HttpStatus.Created).send(createdPost);
  }

  async getPostById(req: Request<PostIdParams>, res: Response) {
    const post = await this.service.findById(req.params.id);

    if (!post) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    res.status(HttpStatus.OK).send(post);
  }

  async updatePost(req: Request<PostIdParams>, res: Response) {
    const isUpdated = await this.service.update(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  }

  async deletePost(req: Request<PostIdParams>, res: Response) {
    const isDeleted = await this.service.delete(req.params.id);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  }
}
