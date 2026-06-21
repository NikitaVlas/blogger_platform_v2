import {BlogDbModel} from "../models/blog.db-model";
import {BlogViewModel} from "../models/blog.view-model";


export const blogMapper = ( blog: BlogDbModel): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
    }
}
