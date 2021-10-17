import express from "express";
import cors from "cors";
import PeopleDatabase from "../database/PeopleDatabase.js";

// create express application
const app = express();

// use json middleware to process request body and converted to js object
app.use(express.json());

// use cors middleware to allow requests from all origins
app.use(cors())

// create people database object
const database = new PeopleDatabase();

// save port number for convenience
const port = 8080;

// ping, check if the server is active
app.get("/ping", (req, res) => {
    res.send("pong")
})

// send all people from the database
app.get("/people", async (req, res) => {
    const people = await database.getAll();
    res.send(people)
})

// add a person to database
app.post("/people", async (req, res) => {
    // destructure name and age from request body
    const {
        body: {
            name,
            age
        }
    } = req;

    // validate if one of the fileds is missing
    if (!name || !age) {
        // send status 400 with error payload in response
        res.status(400).send({
            success: false,
            error: "Missing field"
        });

        // return here to not execute code below this if statement
        return;
    }

    // create person object
    const person = {
        name,
        age
    }

    // add person to database
    await database.addOne(person);

    // send status 201 with added person in response
    res.status(201).send({
        success: true,
        added: person
    });
})

// start a server on 'port'
app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}/`)
})