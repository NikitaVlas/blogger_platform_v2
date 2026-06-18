export interface PostInputModel {
    title: string; // maxLength: 30
    shortDescription: string; // maxLength: 100
    content: string; // maxLength: 10000
    blogId: string;
}
