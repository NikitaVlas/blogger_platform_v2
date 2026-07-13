import {blogCollection, postCollection} from "../../../db/mongo.db";
import {PostViewModel} from "../models/post.view-model";
import {postMapper} from "../mappers/post.mapper";
import {PostInputModel} from "../models/post.input-model";
import {PostInsertModel} from "../models/post.db-model";
import {toObjectId} from "../../../core/helpers/toObject";
import {PostQueryInputModel} from "../models/post-query-input.model";
import {PostPaginationViewModel} from "../models/post.pagination-view-model";


export const postRepository = {
    async findAll(
        query: PostQueryInputModel,
    ): Promise<PostPaginationViewModel> {
        const sortDirection: 1 | -1 =
            query.sortDirection === "asc" ? 1 : -1;

        const skip =
            (query.pageNumber - 1) * query.pageSize;

        const totalCount =
            await postCollection.countDocuments({});

        const posts = await postCollection
            .find({})
            .sort({
                [query.sortBy]: sortDirection,
            })
            .skip(skip)
            .limit(query.pageSize)
            .toArray();

        return {
            pagesCount: Math.ceil(
                totalCount / query.pageSize,
            ),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: posts.map(postMapper),
        };
    },

    async create(newPostData: PostInputModel): Promise<PostViewModel | null> {
        const blogObjectId = toObjectId(newPostData.blogId);

        if (!blogObjectId) {
            return null;
        }

        const blog = await blogCollection.findOne({
            _id: blogObjectId,
        });

        if (!blog) {
            return null;
        }

        const postToInsert: PostInsertModel = {
            title: newPostData.title,
            shortDescription: newPostData.shortDescription,
            content: newPostData.content,
            blogId: newPostData.blogId,
            blogName: blog.name,
            createdAt: new Date(),
        };

        const result = await postCollection.insertOne(postToInsert);

        return postMapper({
            _id: result.insertedId,
            ...postToInsert,
        });
    },

    async findById(id: string): Promise<PostViewModel | null> {
        const objectId = toObjectId(id);

        if (!objectId) {
            return null;
        }

        const post = await postCollection.findOne({_id: objectId})

        if(!post) {
            return null;
        }

        return postMapper(post)
    },

    async update(id: string, newPostData: PostInputModel): Promise<boolean> {
        const postObjectId = toObjectId(id);

        if (!postObjectId) {
            return false;
        }

        const blogObjectId = toObjectId(newPostData.blogId);

        if (!blogObjectId) {
            return false;
        }

        const blog = await blogCollection.findOne({
            _id: blogObjectId,
        });

        if (!blog) {
            return false;
        }

        const updateResult = await postCollection.updateOne(
            {
                _id: postObjectId,
            },
            {
                $set: {
                    title: newPostData.title,
                    shortDescription: newPostData.shortDescription,
                    content: newPostData.content,
                    blogId: newPostData.blogId,
                    blogName: blog.name,
                },
            },
        );

        return updateResult.matchedCount > 0;
    },

    async delete(id: string): Promise<boolean> {
        const objectId = toObjectId(id);

        if (!objectId) {
            return false;
        }

        const deleteResult = await postCollection.deleteOne({_id: objectId});

        return deleteResult.deletedCount > 0;
    },

    async findByBlogId(
        blogId: string,
        query: PostQueryInputModel,
    ): Promise<PostPaginationViewModel> {
        const filter = {
            blogId,
        };

        const sortDirection: 1 | -1 =
            query.sortDirection === "asc" ? 1 : -1;

        const totalCount =
            await postCollection.countDocuments(filter);

        const posts = await postCollection
            .find(filter)
            .sort({
                [query.sortBy]: sortDirection,
            })
            .skip(
                (query.pageNumber - 1) * query.pageSize,
            )
            .limit(query.pageSize)
            .toArray();

        return {
            pagesCount: Math.ceil(
                totalCount / query.pageSize,
            ),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: posts.map(postMapper),
        };
    },
};
