import { PostViewModel } from "../models/post.view-model";
import { PostRepository } from "../repositories/post.repository";
import { PostInputModel } from "../models/post.input-model";
import { PostQueryInputModel } from "../models/post-query-input.model";
import { PostPaginationViewModel } from "../models/post.pagination-view-model";

export class PostsService {
  constructor(private readonly repository: PostRepository) {}
  async findAll(query: PostQueryInputModel): Promise<PostPaginationViewModel> {
    return this.repository.findAll(query);
  }

  async create(newPostData: PostInputModel): Promise<PostViewModel | null> {
    return this.repository.create(newPostData);
  }

  async findById(id: string): Promise<PostViewModel | null> {
    return this.repository.findById(id);
  }

  async update(id: string, newPostData: PostInputModel): Promise<boolean> {
    return this.repository.update(id, newPostData);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async findByBlogId(
    blogId: string,
    query: PostQueryInputModel,
  ): Promise<PostPaginationViewModel> {
    return this.repository.findByBlogId(blogId, query);
  }
}
