import {PostViewModel} from "../models/post.view-model";
import {postRepository} from "../repositories/post.repository";
import {PostInputModel} from "../models/post.input-model";
import {PostQueryInputModel} from "../models/post-query-input.model";
import {PostPaginationViewModel} from "../models/post.pagination-view-model";

export const postService = {
    async findAll(query: PostQueryInputModel): Promise<PostPaginationViewModel> {
        return postRepository.findAll(query);
    },

    async create(newPostData: PostInputModel): Promise<PostViewModel | null> {
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
    },

    async findByBlogId(blogId: string, query: PostQueryInputModel): Promise<PostPaginationViewModel> {
        return postRepository.findByBlogId(blogId, query);
    },
}
