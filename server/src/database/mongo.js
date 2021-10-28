import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// take user, password and cluster variables fields from env
const { MONGO_USER, MONGO_PW, MONGO_CLUSTER } = process.env;

const url = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_CLUSTER}/people-api?retryWrites=true&w=majority`;

export const getDb = async (name) => {
    // try to connect to cluster
    console.log("Connecting to mongo...");
    try {
        // create mongo connection
        const client = new MongoClient(url);
        console.log("Connected to mongo!");

        await client.connect();
        const db = client.db(name);

        return {
            client,
            db
        };
    } catch (e) {
        // if there is an error log it to the console
        console.error("Couldn't connect to mongo, error: ", e);
        throw new Error(e.message);
    }
};
