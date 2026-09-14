import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { AuthRequest } from "../../auth/types/auth-request";
import { PostsService, postService } from "../../posts/service/post.service";
import { CommentsService, commentsService } from "../services/comments.service";
import { getCommentsQueryParams } from "../helpers/get-comments-query-params";

type CommentIdParams = {
    id: string;
};

type CommentActionParams = {
    commentId: string;
};

type PostCommentsParams = {
    postId: string;
};

export class CommentsController {
    constructor(private readonly service: CommentsService, private readonly postsService: PostsService) {}
    async getById(
        req: Request<CommentIdParams>,
        res: Response,
    ) {
        const comment =
            await this.service.findById(
                req.params.id,
            );

        if (!comment) {
            return res.sendStatus(
                HttpStatus.NotFound,
            );
        }

        return res
            .status(HttpStatus.OK)
            .send(comment);
    }

    async getForPost(
        req: Request<PostCommentsParams>,
        res: Response,
    ) {
        const post = await this.postsService.findById(
            req.params.postId,
        );

        if (!post) {
            return res.sendStatus(
                HttpStatus.NotFound,
            );
        }

        const query =
            getCommentsQueryParams(req);

        const comments =
            await this.service.findForPost(
                req.params.postId,
                query,
            );

        return res
            .status(HttpStatus.OK)
            .send(comments);
    }

    async createForPost(
        req: Request<PostCommentsParams>,
        res: Response,
    ) {
        const post = await this.postsService.findById(
            req.params.postId,
        );

        if (!post) {
            return res.sendStatus(
                HttpStatus.NotFound,
            );
        }

        const user =
            (req as AuthRequest<PostCommentsParams>)
                .user;

        const comment =
            await this.service.create(
                req.params.postId,
                req.body.content,
                user,
            );

        return res
            .status(HttpStatus.Created)
            .send(comment);
    }

    async update(req: Request<CommentActionParams>, res: Response) {
        const user =
            (req as AuthRequest<CommentActionParams>)
                .user;

        const result =
            await this.service.update(
                req.params.commentId,
                req.body.content,
                user._id.toString(),
            );

        if (result.status === "not-found") {
            return res.sendStatus(
                HttpStatus.NotFound,
            );
        }

        if (result.status === "forbidden") {
            return res.sendStatus(
                HttpStatus.Forbidden,
            );
        }

        return res.sendStatus(
            HttpStatus.NoContent,
        );
    }

    async delete(req: Request<CommentActionParams>, res: Response) {
        const user =
            (req as AuthRequest<CommentActionParams>)
                .user;

        const result =
            await this.service.delete(
                req.params.commentId,
                user._id.toString(),
            );

        if (result.status === "not-found") {
            return res.sendStatus(
                HttpStatus.NotFound,
            );
        }

        if (result.status === "forbidden") {
            return res.sendStatus(
                HttpStatus.Forbidden,
            );
        }

        return res.sendStatus(
            HttpStatus.NoContent,
        );
    }
}

export const commentsController = new CommentsController(commentsService, postService);
