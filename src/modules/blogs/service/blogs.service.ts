import { BlogViewModel } from "../models/blog.view-model";
import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogInputModel } from "../models/blog.input-model";
import { BlogPaginationViewModel } from "../models/blog.pagination-view-model";
import { BlogQueryInputModel } from "../models/blog-query-input.model";

export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async findAll(query: BlogQueryInputModel): Promise<BlogPaginationViewModel> {
    return this.blogsRepository.findAll(query);
  }

  async create(newBlogData: BlogInputModel): Promise<BlogViewModel> {
    return this.blogsRepository.create(newBlogData);
  }

  async findById(id: string): Promise<BlogViewModel | null> {
    return this.blogsRepository.findById(id);
  }

  async update(id: string, updatedBlogData: BlogInputModel): Promise<boolean> {
    return this.blogsRepository.update(id, updatedBlogData);
  }

  async delete(id: string): Promise<boolean> {
    return this.blogsRepository.delete(id);
  }
}

// Совместимость со старыми маршрутами на время поэтапной миграции.
