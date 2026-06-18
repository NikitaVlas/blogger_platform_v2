export interface FieldError {
    message: string;
    field: string;
}

export interface APIErrorResult {
    errorsMessages: FieldError[];
}

export interface BlogInputModel {
    name: string; // maxLength: 15
    description: string; // maxLength: 500
    websiteUrl: string; //	maxLength: 100  pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

export interface BlogViewModel {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
}

export interface PostInputModel {
    title: string; // maxLength: 30
    shortDescription: string; // maxLength: 100
    content: string; // maxLength: 10000
    blogId: string;
}

export interface PostViewModel {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}
