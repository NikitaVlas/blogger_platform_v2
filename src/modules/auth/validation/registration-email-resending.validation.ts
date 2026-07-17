import { body } from "express-validator";

const emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const registrationEmailResendingValidation = [
    body("email")
        .isString()
        .withMessage(
            "email must be a string",
        )
        .trim()
        .isLength({max: 100})
        .withMessage("email must not be longer than 100 characters")
        .matches(emailPattern)
        .withMessage(
            "email has incorrect format",
        ),
];
