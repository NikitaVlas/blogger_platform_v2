import {Collection, Db, MongoClient, OptionalId} from 'mongodb';
import {BlogDbModel} from "../modules/blogs/models/blog.db-model";
import {PostDbModel} from "../modules/posts/models/post.db-model";
import {UserDbModel} from "../modules/users/models/user.db-model";
import {CommentDbModel} from "../modules/comments/models/comments.db-model";
import {RefreshTokenDbModel} from "../modules/auth/models/refresh-token.db-model";
import {RequestLogDbModel} from "../core/models/request-log.db-model";

const BLOG_COLLECTION_NAME = 'blog';
const POST_COLLECTION_NAME = 'post';
const USER_COLLECTION_NAME = 'user';
const COMMENT_COLLECTION_NAME = "comment";
const REFRESH_TOKEN_COLLECTION_NAME = "refreshToken";
const REQUEST_LOG_COLLECTION_NAME = "requestLog";


export let client: MongoClient;
export let db: Db;
export let blogCollection: Collection<OptionalId<BlogDbModel>>;
export let postCollection: Collection<OptionalId<PostDbModel>>;
export let userCollection: Collection<OptionalId<UserDbModel>>;
export let commentCollection: Collection<OptionalId<CommentDbModel>>;
export let refreshTokenCollection: Collection<OptionalId<RefreshTokenDbModel>>;
export let requestLogCollection: Collection<OptionalId<RequestLogDbModel>>;


let isConnected = false;

export async function rundb(url: string) {
    if (isConnected) {
        return
    }

    client = new MongoClient(url, {
        serverSelectionTimeoutMS: 5_000,
        connectTimeoutMS: 5_000,
    });
    await client.connect();

    db = client.db("blogers-platform_v2");

    blogCollection = db.collection<OptionalId<BlogDbModel>>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<OptionalId<PostDbModel>>(POST_COLLECTION_NAME);
    userCollection = db.collection<OptionalId<UserDbModel>>(USER_COLLECTION_NAME);
    commentCollection = db.collection<OptionalId<CommentDbModel>>(COMMENT_COLLECTION_NAME);
    refreshTokenCollection = db.collection<OptionalId<RefreshTokenDbModel>>(REFRESH_TOKEN_COLLECTION_NAME);
    requestLogCollection = db.collection<OptionalId<RequestLogDbModel>>(REQUEST_LOG_COLLECTION_NAME);

    await userCollection.createIndex({login: 1}, {unique: true});
    await userCollection.createIndex({email: 1}, {unique: true});
    // jti каждого refresh token должен быть уникален.
    await refreshTokenCollection.createIndex({tokenId: 1}, {unique: true});
    // MongoDB сможет автоматически удалять старые записи.
    // expiresAt должен быть Date.
    await refreshTokenCollection.createIndex({expiresAt: 1},{expireAfterSeconds: 0});
    await requestLogCollection.createIndex({IP: 1, URL: 1, date: 1});

    isConnected = true;

    console.log("Connected to MongoDB");
}
