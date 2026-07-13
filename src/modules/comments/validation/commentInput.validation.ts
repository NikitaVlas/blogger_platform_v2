import { body } from "express-validator";

export const commentInputValidation = [
    body("content")
        .isString()
        .withMessage("content must be a string")
        .trim()
        .isLength({ min: 20, max: 300 })
        .withMessage(
            "content must be between 20 and 300 characters",
        ),
];
