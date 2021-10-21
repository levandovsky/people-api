import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// take user, password and cluster variables fields from env
const {
    MONGO_USER,
    MONGO_PW,
    MONGO_CLUSTER
} = process.env;

const url = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_CLUSTER}/people-api?retryWrites=true&w=majority`;

export const getConnection = async () => {
    // try to connect to cluster
    console.log("Connecting to mongo...");
    try {
        // create mongoose connection
        const connection = await mongoose.connect(url);
        console.log("Connected to mongo!");
        return connection;
    } catch (e) {
        // if there is an error log it to the console
        console.error("Couldn't connect to mongo, error: ", e);
        return null;
    }
};
