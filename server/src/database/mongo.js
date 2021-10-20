import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const {
    MONGO_USER,
    MONGO_PW
} = process.env;

const url = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@cluster0.s8hnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const main = async () => {
    try {
        const connection = await mongoose.connect(url);
        console.log(connection);
    } catch (e) {
        console.error(e);
    }
};

main();