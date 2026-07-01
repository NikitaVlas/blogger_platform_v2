export interface BlogInputModel {
    name: string; // maxLength: 15
    description: string; // maxLength: 500
    websiteUrl: string; //	maxLength: 100  pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    createdAt: Date;
    isMembership: boolean;
}
