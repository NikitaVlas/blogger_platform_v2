import {query} from "express-validator";


const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_DIRECTION = 'desc';

const userSortFields = ['login', 'email', 'createdAt'] as const;
const sortDirections = ['asc', 'desc'] as const;

export const pageNumberQueryValidation = query('pageNumber')
    .optional()
    .isInt({min: 1})
    .withMessage('pageNumber must be a positive integer')
    .toInt()
    .default(DEFAULT_PAGE_NUMBER);

export const pageSizeQueryValidation = query('pageSize')
    .optional()
    .isInt({min: 1, max: 10})
    .withMessage('pageSize must be between 1 and 10')
    .toInt()
    .default(DEFAULT_PAGE_SIZE);

export const sortByQueryValidation = query('sortBy')
    .optional()
    .isString()
    .withMessage('sortBy must be a string')
    .isIn(userSortFields)
    .withMessage(`sortBy must be one of: ${userSortFields.join(', ')}`)
    .default(DEFAULT_SORT_BY);

export const sortDirectionQueryValidation = query('sortDirection')
    .optional()
    .isString()
    .withMessage('sortDirection must be a string')
    .isIn(sortDirections)
    .withMessage(`sortDirection must be one of: ${sortDirections.join(', ')}`)
    .default(DEFAULT_SORT_DIRECTION);

export const searchLoginTermValidation = query("searchLoginTerm")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("searchLoginTerm must be a string")
    .trim();

export const searchEmailTermValidation = query("searchEmailTerm")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("searchEmailTerm must be a string")
    .trim();

export const userQueryValidation = [
    sortDirectionQueryValidation,
    pageNumberQueryValidation,
    pageSizeQueryValidation,
    sortByQueryValidation,
    searchLoginTermValidation,
    searchEmailTermValidation
];
