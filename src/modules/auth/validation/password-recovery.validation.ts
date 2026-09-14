import { body } from "express-validator";
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const passwordRecoveryValidation = [
  body("email")
    .isString()
    .trim()
    .matches(emailPattern)
    .withMessage("email has incorrect format"),
];
export const newPasswordValidation = [
  body("newPassword")
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("newPassword must be between 6 and 20 characters"),
  body("recoveryCode")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("recoveryCode is required"),
];
