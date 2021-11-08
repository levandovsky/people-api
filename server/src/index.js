import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import peopleMongoRouter from "./routes/people-mongo.js";
import peopleJsonRouter from "./routes/people-json.js";
import carsMongoRouter from "./routes/cars-mongo.js";
import petsMongoRouter from "./routes/pets-mongo.js";
import peopleMysqlRouter from "./routes/people-sql.js";
import { createClient } from "./database/mongo.js";
import mysql from "mysql";

// configure dotenv package
dotenv.config();

const main = async () => {
    try {
        const {
            MONGO_USER,
            MONGO_PW,
            MONGO_CLUSTER,
            PORT = 5000,
            MYSQL_HOST,
            MYSQL_PORT,
            MYSQL_USER,
            MYSQL_PW,
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

        const connection = mysql.createConnection({
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            user: MYSQL_USER,
            password: MYSQL_PW,
            database: "people-api",
        });

        connection.connect(() => {
            console.log("mysql connected");
        });

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

        // add mysql connection to app
        app.mysql = connection;

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


        // router for mysql api
        app.use("/people-mysql", peopleMysqlRouter);

        // start a server on 'port'
        app.listen(PORT, () => {
            console.log(`App running on: http://localhost:${PORT}/`);
        });

        process.on("exit", async () => {
            await client.close();
            connection.end();
        });
    } catch (e) {
        console.error(e);
    }
};

main();
