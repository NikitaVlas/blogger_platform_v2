import {PostViewModel} from "../models/post.view-model";
import {postRepository} from "../repositories/post.repository";
import {PostInputModel} from "../models/post.input-model";

export const postService = {
    async findAll(): Promise<PostViewModel[]> {
        return postRepository.findAll()
    },

    async create(newPostData: PostViewModel): Promise<PostViewModel> {
        return postRepository.create(newPostData)
    },

    async findById(id: string): Promise<PostViewModel | null> {
        return postRepository.findById(id);
    },

    async update(id: string, newPostData: PostInputModel): Promise<boolean> {
        return postRepository.update(id, newPostData)
    },

    async delete(id: string): Promise<boolean> {
        return postRepository.delete(id);
    }
}
