import express from "express";
import cors from "cors";
import PeopleDatabase from "../database/PeopleDatabase.js";
import morgan from "morgan";

// create express application
const app = express();

// use json middleware to process request body and converted to js object
app.use(express.json());

// use cors middleware to allow requests from all origins
app.use(cors())

// middleware that logs server events to console
app.use(morgan("dev"))

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

// get all people with name
app.get("/people/:name", async (req, res) => {
    const { name } = req.params;
    const allByName = await database.getAllWithName(name)

    res.send(allByName);
})

// get one person by timestamp
app.get("/person/timestamp/:timestamp", async (req, res) => {
    const timestamp = Number(req.params.timestamp);
    const person = await database.getOneByTimestamp(timestamp);

    res.send(person)
})

// get one person with name
app.get("/person/name/:name", async (req, res) => {
    const { name } = req.params
    const person = await database.getOneByName(name);

    res.send(person);
})

// add a person to database
app.post("/people", async (req, res) => {
    // set person object to request body
    const person = {...req.body};

    // validate if one of the fileds is missing
    if (!person.name || !person.age) {
        // send status 400 with error payload in response
        res.status(400).send({
            success: false,
            error: "Missing field"
        });

        // return here to not execute code below this if statement
        return;
    }


    // add person to database
    const added = await database.addOne(person);

    // send status 201 with added person in response
    res.status(201).send({
        success: true,
        added
    });
});

// start a server on 'port'
app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}/`)
})