import {blogCollection, postCollection} from "../../../db/mongo.db";
import {PostViewModel} from "../models/post.view-model";
import {postMapper} from "../mappers/post.mapper";
import {PostInputModel} from "../models/post.input-model";
import {ObjectId} from "mongodb";
import {PostInsertModel} from "../models/post.db-model";


export const postRepository = {
    async findAll(): Promise<PostViewModel[]> {
        const posts = await postCollection.find().toArray();

        return posts.map(postMapper)
    },

    async create(newPostData: PostInputModel): Promise<PostViewModel> {
        const blog = await blogCollection.findOne({_id: new ObjectId(newPostData.blogId)})

        if(!blog) throw new Error("Blog not found")

        const postToInsert: PostInsertModel = {
            title: newPostData.title,
            shortDescription: newPostData.shortDescription,
            content: newPostData.content,
            blogId: newPostData.blogId,
            blogName: blog.name,
            createdAt: new Date(),
        }

        const result = await postCollection.insertOne(postToInsert)

        return postMapper({
            _id: result.insertedId,
            ...postToInsert
        })
    },

    async findById(id: string): Promise<PostViewModel | null> {
        const post = await postCollection.findOne({_id: new ObjectId(id)})

        if(!post) {
            return null;
        }

        return postMapper(post)
    },

    async update(id: string, newPostData: PostInputModel): Promise<boolean> {
        const blog = await blogCollection.findOne({_id: new ObjectId(newPostData.blogId)})

        if (!blog) throw new Error("Blog not found")

        const updateResult = await postCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    title: newPostData.title,
                    shortDescription: newPostData.shortDescription,
                    content: newPostData.content,
                    blogId: newPostData.blogId,
                    blogName: blog.name,
                }
            }
        )
        return updateResult.modifiedCount > 0;
    },

    async delete(id: string): Promise<boolean> {
        const deleteResult = await postCollection.deleteOne({_id: new ObjectId(id)});

        return deleteResult.deletedCount > 0;
    }
};
