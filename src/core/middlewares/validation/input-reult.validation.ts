import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import {HttpStatus} from "../../types/http-statuses";
import {FieldError} from "../../types/api-error-result";

export const inputResultValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        next();
        return;
    }

    const errorsMessages: FieldError[] = errors
        .array({onlyFirstError: true})
        .map((error) => {
            return {
                message: error.msg,
                field: error.type === 'field' ? error.path : "unknown",
            }
        });

    res.status(HttpStatus.BadRequest).json({errorsMessages});
};
