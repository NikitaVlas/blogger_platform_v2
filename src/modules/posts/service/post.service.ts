import {PostViewModel} from "../models/post.view-model";
import {postRepository} from "../repositories/post.repository";


export const postService = {
    async findAll(): Promise<PostViewModel[]> {
        return postRepository.findAll()
    }
}
