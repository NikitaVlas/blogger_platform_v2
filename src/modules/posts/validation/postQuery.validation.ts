import { query } from "express-validator";

const sortDirections = ["asc", "desc"] as const;

export const postQueryValidation = [
    query("sortBy")
        .optional()
        .isString()
        .withMessage("sortBy must be a string"),

    query("sortDirection")
        .optional()
        .isIn(sortDirections)
        .withMessage("sortDirection must be asc or desc"),

    query("pageNumber")
        .optional()
        .isInt({ min: 1 })
        .withMessage("pageNumber must be a positive integer")
        .toInt(),

    query("pageSize")
        .optional()
        .isInt({ min: 1 })
        .withMessage("pageSize must be a positive integer")
        .toInt(),
];
