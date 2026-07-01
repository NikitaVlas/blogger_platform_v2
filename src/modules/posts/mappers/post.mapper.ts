import {PostViewModel} from "../models/post.view-model";
import {PostDbModel} from "../models/post.db-model";

export const postMapper = (post: PostDbModel): PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    }
};
