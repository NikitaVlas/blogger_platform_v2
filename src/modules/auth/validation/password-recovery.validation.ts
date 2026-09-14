import { body } from "express-validator";
export const passwordRecoveryValidation = [
  body("email")
    .isString()
    .trim()
    .isEmail()
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
