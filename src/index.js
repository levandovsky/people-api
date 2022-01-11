import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import peopleMongoRouter from "./routes/people.js";
import authRouter from "./routes/auth.js";
import { createClient } from "./database/mongo.js";

// configure dotenv package
dotenv.config();

const main = async () => {
    // create express application
    const app = express();

    const {
        MONGO_USER,
        MONGO_PW,
        MONGO_CLUSTER,
        PORT = 5000,
    } = process.env;

    // connect to mongo
    const client = await createClient({
        user: MONGO_USER,
        pw: MONGO_PW,
        cluster: MONGO_CLUSTER,
        db: "people-api",
    });

    // get 'people-api' database from client
    const peopleDb = client.db();

    // use json middleware to process request body and converted to js object
    app.use(express.json());

    // use cors middleware to allow requests from all origins
    app.use(cors());

    // are that logs server events to console
    app.use(morgan("dev"));

    // add db to app
    app.db = peopleDb;

    // router for mongo api, adds mongo object to request
    app.use(
        "/people",
        (req, _, next) => {
            req.peopleCollection = peopleDb.collection("people");
            next();
        },
        peopleMongoRouter
    );

    app.use(
        "/auth",
        (req, _, next) => {
            req.users = peopleDb.collection("users");
            next();
        },
        authRouter
    );

    // start a server on 'port'
    app.listen(PORT, () => {
        console.log(`Server running on: http://localhost:${PORT}/`);
    });

    process.on("exit", async () => {
        await client.close();
    });
};

main();
