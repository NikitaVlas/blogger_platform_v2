import {postCollection} from "../../../db/mongo.db";
import {PostViewModel} from "../models/post.view-model";
import {postMapper} from "../mappers/post.mapper";


export const postRepository = {
    async findAll(): Promise<PostViewModel[]> {
        const posts = await postCollection.find().toArray();

        return posts.map(postMapper)
    }
};
