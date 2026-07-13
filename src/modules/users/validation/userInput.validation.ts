import { body } from "express-validator";

const loginPattern = /^[a-zA-Z0-9_-]*$/;
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const userInputValidation = [
    body("login")
        .isString()
        .withMessage("login must be a string")
        .trim()
        .isLength({ min: 3, max: 10 })
        .withMessage("login must be between 3 and 10 characters")
        .matches(loginPattern)
        .withMessage("login has incorrect format"),

    body("password")
        .isString()
        .withMessage("password must be a string")
        .trim()
        .isLength({ min: 6, max: 20 })
        .withMessage("password must be between 6 and 20 characters"),

    body("email")
        .isString()
        .withMessage("email must be a string")
        .trim()
        .matches(emailPattern)
        .withMessage("email has incorrect format"),
];
