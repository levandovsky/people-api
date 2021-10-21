import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import peopleRouter from "./routes/people.js";
import { getConnection } from "./database/mongo.js";

const main = async () => {
    try {
        // connect to mongo
        await getConnection();

        // get port number from env, if there is none, use 8080
        const port = process.env.PORT || 8080;

        // configure dotenv package
        dotenv.config();

        // create express application
        const app = express();

        // use json middleware to process request body and converted to js object
        app.use(express.json());

        // use cors middleware to allow requests from all origins
        app.use(cors());

        // middleware that logs server events to console
        app.use(morgan("dev"));

        app.use("/people", peopleRouter);

        // start a server on 'port'
        app.listen(port, () => {
            console.log(`App running on: http://localhost:${port}/`);
        });
    } catch (e) {
        console.error(e);
    }
};

main();
