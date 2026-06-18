import {body} from "express-validator";

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

export const postInputValidation = [
    titlePostValidation,
    shortDescriptionPostValidation,
    contentPostValidation
]
