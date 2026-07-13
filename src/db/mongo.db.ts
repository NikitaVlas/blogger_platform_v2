import {Collection, Db, MongoClient, OptionalId} from 'mongodb';
import {BlogDbModel} from "../modules/blogs/models/blog.db-model";
import {PostDbModel} from "../modules/posts/models/post.db-model";
import {UserDbModel} from "../modules/users/models/user.db-model";
import {CommentDbModel} from "../modules/comments/models/comments.db-model";

const BLOG_COLLECTION_NAME = 'blog';
const POST_COLLECTION_NAME = 'post';
const USER_COLLECTION_NAME = 'user';
const COMMENT_COLLECTION_NAME = "comment";


export let client: MongoClient;
export let db: Db;
export let blogCollection: Collection<OptionalId<BlogDbModel>>;
export let postCollection: Collection<OptionalId<PostDbModel>>;
export let userCollection: Collection<OptionalId<UserDbModel>>;
export let commentCollection: Collection<OptionalId<CommentDbModel>>;


let isConnected = false;

export async function rundb(url: string) {
    if (isConnected) {
        return
    }

    client = new MongoClient(url);
    await client.connect();

    db = client.db("blogers-platform_v2");

    blogCollection = db.collection<OptionalId<BlogDbModel>>(BLOG_COLLECTION_NAME);
    postCollection = db.collection<OptionalId<PostDbModel>>(POST_COLLECTION_NAME);
    userCollection = db.collection<OptionalId<UserDbModel>>(USER_COLLECTION_NAME);
    commentCollection = db.collection<OptionalId<CommentDbModel>>(COMMENT_COLLECTION_NAME);

    await userCollection.createIndex({login: 1}, {unique: true});
    await userCollection.createIndex({email: 1}, {unique: true});

    isConnected = true;

    console.log("Connected to MongoDB");
}
