import {BlogViewModel} from "../models/blog.view-model";
import {blogCollection} from "../../../db/mongo.db";
import {blogMapper} from "../mappers/blog.mapper";
import {BlogInputModel} from "../models/blog.input-model";
import {BlogDbModel, BlogInsertModel} from "../models/blog.db-model";
import {ObjectId} from "mongodb";


export const blogsRepository = {
    async findAll(): Promise<BlogViewModel[]> {
        const blogs = await blogCollection.find().toArray()

        return blogs.map(blogMapper)
    },

    async create(newBlogData: BlogInputModel): Promise<BlogViewModel> {
        const blogToInsert: BlogInsertModel = {
            name: newBlogData.name,
            description: newBlogData.description,
            websiteUrl: newBlogData.websiteUrl,
            createdAt: newBlogData.createdAt,
            isMembership: newBlogData.isMembership,
        }

        const result = await blogCollection.insertOne(blogToInsert)

        return blogMapper({
            _id: result.insertedId,
            ...blogToInsert
        });
    },

    async findById(id: string): Promise<BlogViewModel | null> {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})

        if(!blog) return null;

        return blogMapper(blog)
    },

    async update(id: string, updatedBlogData: BlogInputModel): Promise<boolean> {
        const updateResult = await blogCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    name: updatedBlogData.name,
                    description: updatedBlogData.description,
                    websiteUrl: updatedBlogData.websiteUrl
                }
            }
        );
        return updateResult.modifiedCount > 0;
    },

    async delete(id: string): Promise<boolean> {
        const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});

        return deleteResult.deletedCount > 0;
    }
};
