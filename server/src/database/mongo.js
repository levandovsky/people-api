import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// take user, password and cluster variables fields from env
const {
    MONGO_USER,
    MONGO_PW,
    MONGO_CLUSTER
} = process.env;

// create url string
const url = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_CLUSTER}/myFirstDatabase?retryWrites=true&w=majority`;

// create async context
const main = async () => {
    // try to connect to cluster
    try {
        // create mongoose connection
        const connection = await mongoose.connect(url);

        // log connection object
        console.log(connection);
    } catch (e) {
        // if there is an error log it to the console
        console.error(e);
    }
};

// run program
main();