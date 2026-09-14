import {
  CommentDbModel,
  CommentInsertModel,
} from "../models/comments.db-model";
import { CommentViewModel } from "../models/comment.view-model";
import { commentCollection } from "../../../db/mongo.db";
import { commentMapper } from "../mappers/comment.mapper";
import { toObjectId } from "../../../core/helpers/toObject";
import { CommentQueryInputModel } from "../models/comment-query-input.model";
import { CommentPaginationViewModel } from "../models/comment.pagination-view-model";

export class CommentsRepository {
  async create(commentToInsert: CommentInsertModel): Promise<CommentViewModel> {
    const result = await commentCollection.insertOne(commentToInsert);

    return commentMapper({
      _id: result.insertedId,
      ...commentToInsert,
    });
  }
  async findDbById(id: string): Promise<CommentDbModel | null> {
    const objectId = toObjectId(id);

    if (!objectId) {
      return null;
    }

    return commentCollection.findOne({
      _id: objectId,
    });
  }
  async findById(id: string): Promise<CommentViewModel | null> {
    const objectId = toObjectId(id);

    if (!objectId) {
      return null;
    }

    const comment = await commentCollection.findOne({
      _id: objectId,
    });

    return comment ? commentMapper(comment) : null;
  }
  async update(id: string, content: string): Promise<boolean> {
    const objectId = toObjectId(id);

    if (!objectId) {
      return false;
    }

    const result = await commentCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          content,
        },
      },
    );

    return result.matchedCount > 0;
  }
  async delete(id: string): Promise<boolean> {
    const objectId = toObjectId(id);

    if (!objectId) {
      return false;
    }

    const result = await commentCollection.deleteOne({
      _id: objectId,
    });

    return result.deletedCount > 0;
  }
  async findForPost(
    postId: string,
    query: CommentQueryInputModel,
  ): Promise<CommentPaginationViewModel> {
    const filter = {
      postId,
    };

    const sortDirection: 1 | -1 = query.sortDirection === "asc" ? 1 : -1;

    const totalCount = await commentCollection.countDocuments(filter);

    const comments = await commentCollection
      .find(filter)
      .sort({
        [query.sortBy]: sortDirection,
      })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .toArray();

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: comments.map(commentMapper),
    };
  }
}
