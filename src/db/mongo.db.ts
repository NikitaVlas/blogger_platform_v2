import {Collection, Db, MongoClient, OptionalId} from 'mongodb';
import {BlogDbModel} from "../modules/blogs/models/blog.db-model";
import {PostDbModel} from "../modules/posts/models/post.db-model";

const BLOG_COLLECTION_NAME = 'blog';
const POST_COLLECTION_NAME = 'post';

export let client: MongoClient;
export let db: Db;
export let blogCollection: Collection<OptionalId<BlogDbModel>>;
export let postCollection: Collection<PostDbModel>;

let isConnected = false;

export async function rundb(url: string) {
    if(isConnected) {
        return
    }

    client = new MongoClient(url);
    await client.connect();

    db = client.db("blogers-platform_v2");

    blogCollection = client.db().collection<OptionalId<BlogDbModel>>(BLOG_COLLECTION_NAME);
    postCollection = client.db().collection<PostDbModel>(POST_COLLECTION_NAME);

    isConnected = true;

    console.log("Connected to MongoDB");
}
