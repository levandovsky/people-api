import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import peopleMongoRouter from "./routes/people-mongo.js";
import peopleJsonRouter from "./routes/people-json.js";
import { getDb } from "./database/mongo.js";

const main = async () => {
    try {
        // connect to mongo
        const peopleDb = await getDb("people-api");

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

        // router for json api
        app.use("/people-json", peopleJsonRouter);

        // router for mongo api, adds mongo object to request
        app.use("/people-mongo", (req, _, next) => {
            req.mongo = {
                db: peopleDb,
                collections: {
                    people: peopleDb.collection("people")
                }
            };
            next();
        }, peopleMongoRouter);

        // start a server on 'port'
        app.listen(port, () => {
            console.log(`App running on: http://localhost:${port}/`);
        });
    } catch (e) {
        console.error(e);
    }
};

main();
