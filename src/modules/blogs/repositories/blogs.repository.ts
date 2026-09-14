import { BlogViewModel } from "../models/blog.view-model";
import { blogCollection } from "../../../db/mongo.db";
import { blogMapper } from "../mappers/blog.mapper";
import { BlogInputModel } from "../models/blog.input-model";
import { BlogInsertModel } from "../models/blog.db-model";
import { BlogPaginationViewModel } from "../models/blog.pagination-view-model";
import { BlogQueryInputModel } from "../models/blog-query-input.model";
import { toObjectId } from "../../../core/helpers/toObject";

export class BlogsRepository {
  async findAll(query: BlogQueryInputModel): Promise<BlogPaginationViewModel> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;

    const filter = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } }
      : {};
    const sortDirectionValue: 1 | -1 = sortDirection === "asc" ? 1 : -1;

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortDirectionValue,
    };
    const skip = (pageNumber - 1) * pageSize;

    const totalCount = await blogCollection.countDocuments(filter);

    const blogs = await blogCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .toArray();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs.map(blogMapper),
    };
  }

  async create(newBlogData: BlogInputModel): Promise<BlogViewModel> {
    const blogToInsert: BlogInsertModel = {
      name: newBlogData.name,
      description: newBlogData.description,
      websiteUrl: newBlogData.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    const result = await blogCollection.insertOne(blogToInsert);

    return blogMapper({
      _id: result.insertedId,
      ...blogToInsert,
    });
  }

  async findById(id: string): Promise<BlogViewModel | null> {
    const objectId = toObjectId(id);

    if (!objectId) {
      return null;
    }

    const blog = await blogCollection.findOne({ _id: objectId });

    if (!blog) return null;

    return blogMapper(blog);
  }

  async update(id: string, updatedBlogData: BlogInputModel): Promise<boolean> {
    const objectId = toObjectId(id);

    if (!objectId) {
      return false;
    }

    const updateResult = await blogCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          name: updatedBlogData.name,
          description: updatedBlogData.description,
          websiteUrl: updatedBlogData.websiteUrl,
        },
      },
    );

    return updateResult.matchedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const objectId = toObjectId(id);

    if (!objectId) {
      return false;
    }

    const deleteResult = await blogCollection.deleteOne({ _id: objectId });

    return deleteResult.deletedCount > 0;
  }
}
