export interface FieldError {
    message: string;
    field: string;
}

export interface ApiErrorResult {
    errorsMessages: FieldError[];
}

