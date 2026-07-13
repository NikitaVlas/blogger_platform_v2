import {body} from "express-validator";
import {blogsRepository} from "../../blogs/repositories/blogs.repository";

export const titlePostValidation = body('title')
    .isString()
    .withMessage('title must be a string')
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('title must be between 1 and 30 characters')

export const shortDescriptionPostValidation = body('shortDescription')
    .isString()
    .withMessage('shortDescription must be a string')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('shortDescription must be between 1 and 100 characters')

export const contentPostValidation = body('content')
    .isString()
    .withMessage('content must be a string')
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('content must be between 1 and 1000 characters')

export const blogIdPostValidation = body("blogId")
    .isString()
    .withMessage("blogId must be a string")
    .trim()
    .notEmpty()
    .withMessage("blogId is required")
    .custom(async (blogId: string) => {
        const blog = await blogsRepository.findById(blogId);

        if (!blog) {
            throw new Error("blogId must reference an existing blog");
        }

        return true;
    });

export const postInputValidation = [
    titlePostValidation,
    shortDescriptionPostValidation,
    contentPostValidation,
    blogIdPostValidation
]
