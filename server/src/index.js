import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import peopleMongoRouter from "./routes/people-mongo.js";
import peopleJsonRouter from "./routes/people-json.js";
import carsMongoRouter from "./routes/cars-mongo.js";
import petsMongoRouter from "./routes/pets-mongo.js";
import { getDb } from "./database/mongo.js";

const main = async () => {
    try {
        // connect to mongo
        const {db: peopleDb, client} = await getDb("people-api");

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

        // add db to app
        app.db = peopleDb;

        // router for mongo api, adds mongo object to request
        app.use(
            "/people-mongo",
            (req, _, next) => {
                req.peopleCollection = peopleDb.collection("people");
                next();
            },
            peopleMongoRouter
        );

        // router for mongo cars collection
        app.use(
            "/cars-mongo",
            (req, _, next) => {
                req.carsCollection = peopleDb.collection("cars");
                next();
            },
            carsMongoRouter
        );

        app.use(
            "/pets-mongo",
            (req, _, next) => {
                req.petsCollection = peopleDb.collection("pets");
                next();
            },
            petsMongoRouter
        );

        // start a server on 'port'
        app.listen(port, () => {
            console.log(`App running on: http://localhost:${port}/`);
        });

        process.on("exit", async () => {
            await client.close();
        });
    } catch (e) {
        console.error(e);
    }
};

main();
