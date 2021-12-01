import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import peopleMongoRouter from "./routes/mongo/people.js";
import peopleJsonRouter from "./routes/json/people.js";
import carsMongoRouter from "./routes/mongo/cars.js";
import petsMongoRouter from "./routes/mongo/pets.js";
import peopleMysqlRouter from "./routes/mysql/people.js";
import carsMysqlRouter from "./routes/mysql/cars.js";
import { createClient } from "./database/mongo.js";
import mysql from "mysql2/promise";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ejsRouter from "./routes/ejs/index.js";
import formiddable from "express-formidable";

const __dirname = dirname(fileURLToPath(import.meta.url));

// configure dotenv package
dotenv.config();

const main = async () => {
    // create express application
    const app = express();

    const viewsDirectory = path.join(__dirname, "views");

    // view engine setup
    app.set("views", viewsDirectory);
    app.set("view engine", "ejs");

    // set path for static assets
    app.use(express.static(path.join(__dirname, "public")));

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

    try {
        // connect to mongo
        const client = await createClient({
            user: MONGO_USER,
            pw: MONGO_PW,
            cluster: MONGO_CLUSTER,
            db: "people-api",
        });

        // get 'people-api' database from client
        const peopleDb = client.db();

        const connection = await mysql.createConnection({
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            user: MYSQL_USER,
            password: MYSQL_PW,
            database: "people-api",
        });

        const createPeopleTableQuery = `
            CREATE TABLE IF NOT EXISTS people (
                id INTEGER AUTO_INCREMENT NOT NULL,
                name VARCHAR(20) NOT NULL,
                lastname VARCHAR(50) NOT NULL,
                age INTEGER NOT NULL,
                PRIMARY KEY (id)
            )
        `;

        const createCarBrandsTableQuery = `
            CREATE TABLE IF NOT EXISTS car_brands (
                id INTEGER AUTO_INCREMENT NOT NULL,
                brand VARCHAR(20) NOT NULL,
                PRIMARY KEY (id), 
                UNIQUE (brand)
            )
        `;

        const createCarsTableQuery = `
            CREATE TABLE IF NOT EXISTS cars (
                id VARCHAR(6) NOT NULL,
                brand_id INTEGER NOT NULL,
                owner_id INTEGER NOT NULL,
                PRIMARY KEY (id),
                UNIQUE (id),
                FOREIGN KEY (owner_id) REFERENCES people (id),
                FOREIGN KEY (brand_id) REFERENCES car_brands (id)
            )
        `;

        await connection.query(createPeopleTableQuery);

        await connection.query(createCarBrandsTableQuery);

        await connection.query(createCarsTableQuery);

        // use json middleware to process request body and converted to js object
        app.use(express.json());

        app.use(formiddable());

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

        // router for mysql people api
        app.use("/people-mysql", peopleMysqlRouter);

        // router for mysql cars api
        app.use("/cars-mysql", carsMysqlRouter);

        app.use("/views", ejsRouter);

        // start a server on 'port'
        app.listen(PORT, () => {
            console.log(
                `Server running on: http://localhost:${PORT}/`
            );
        });

        process.on("exit", async () => {
            await client.close();
            connection.end();
        });
    } catch (e) {
        console.error(e);

        app.get("*", (_, res) => {
            res.status(500).send(
                "Something went wrong while starting the server"
            );
        });

        // start a server on 'port'
        app.listen(PORT, () => {
            console.log(
                `Error server running on: http://localhost:${PORT}/`
            );
        });
    }
};

main();
