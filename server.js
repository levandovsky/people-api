import express from "express";
import PeopleDatabase from "./PeopleDatabase.js";

// create express application
const app = express();

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

// start a server on 'port'
app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}/`)
})