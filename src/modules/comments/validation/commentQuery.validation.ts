import { query } from "express-validator";

const commentSortFields = [
    "createdAt",
] as const;

const sortDirections = [
    "asc",
    "desc",
] as const;

export const commentQueryValidation = [
    query("sortBy")
        .optional()
        .isString()
        .withMessage("sortBy must be a string")
        .isIn(commentSortFields)
        .withMessage(
            `sortBy must be one of: ${commentSortFields.join(", ")}`,
        )
        .default("createdAt"),

    query("sortDirection")
        .optional()
        .isIn(sortDirections)
        .withMessage(
            "sortDirection must be asc or desc",
        )
        .default("desc"),

    query("pageNumber")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "pageNumber must be a positive integer",
        )
        .toInt()
        .default(1),

    query("pageSize")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "pageSize must be a positive integer",
        )
        .toInt()
        .default(10),
];
