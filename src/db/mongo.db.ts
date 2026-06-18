import {Collection, Db, MongoClient} from 'mongodb';

const BLOG_COLLECTION_NAME = 'blog';
const POST_COLLECTION_NAME = 'post';

export let client: MongoClient;
export let db: Db;
export let blogCollection: Collection;
export let postCollection: Collection;

let isConnected = false;

export async function rundb(url: string) {
    if(isConnected) {
        return
    }

    client = new MongoClient(url);
    await client.connect();

    db = client.db("blogers-platform_v2");

    blogCollection = client.db().collection(BLOG_COLLECTION_NAME);
    postCollection = client.db().collection(POST_COLLECTION_NAME);

    isConnected = true;

    console.log("Connected to MongoDB");
}
