import {BlogViewModel} from "../models/blog.view-model";
import {blogsRepository} from "../repositories/blogs.repository";
import {BlogInputModel} from "../models/blog.input-model";
import {BlogPaginationViewModel} from "../models/blog.pagination-view-model";
import {BlogQueryInputModel} from "../models/blog-query-input.model";

export const blogsService = {
    async findAll(query: BlogQueryInputModel): Promise<BlogPaginationViewModel> {
        return blogsRepository.findAll(query)
    },

    async create(newBlogData: BlogInputModel): Promise<BlogViewModel> {
        return blogsRepository.create(newBlogData)
    },

    async findById(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.findById(id);
    },

    async update(id: string, updatedBlogData: BlogInputModel): Promise<boolean> {
        return blogsRepository.update(id, updatedBlogData)
    },

    async delete(id: string): Promise<boolean> {
        return blogsRepository.delete(id)
    }
}
