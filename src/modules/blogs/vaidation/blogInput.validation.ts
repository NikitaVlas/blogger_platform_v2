import {body} from "express-validator";

const websiteUrlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

export const nameBlogValidation = body('name')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage('Name must be between 1 and 15 characters')

export const descriptionBlogValidation = body('description')
    .isString()
    .withMessage('Description must be a string')
    .isLength({min: 1, max: 500})
    .withMessage('Description must be between 1 and 500 characters')

export const websiteUrlValidation = body('websiteUrl')
    .isString()
    .withMessage('Website URL must be a string')
    .trim()
    .matches(websiteUrlPattern)
    .withMessage('Website URL must be a valid URL')
    .isLength({min: 1, max: 100})
    .withMessage('Website URL must be between 1 and 100 characters')


export const blogInputValidation = [
    nameBlogValidation,
    descriptionBlogValidation,
    websiteUrlValidation
]
