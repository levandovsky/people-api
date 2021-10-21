import { Router } from "express";
import Person from "../models/Person.js";

const router = Router();

// send all people from the database
router.get("/", async (req, res) => {
    try {
        const people = await Person.find();
        res.send(people);
    } catch (e) {
        res.status(500).send({
            error: e.message,
        });
    }
});

// add a person to database
router.post("/", async (req, res) => {
    try {
        // set person object to request body
        const person = { ...req.body };

        // validate if one of the fileds is missing
        if (!person.name || !person.age) {
            // send status 400 with error payload in response
            res.status(400).send({
                success: false,
                error: "Missing field",
            });

            // return here to not execute code below this if statement
            return;
        }

        // add person to database
        const newPerson = new Person({
            name: person.name,
            age: person.age
        });

        // save new person
        await newPerson.save();

        // send status 201 with added person in response
        res.status(201).send({
            success: true,
            added: newPerson,
        });

    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
});

// get all people with name
router.get("/:name", async (req, res) => {
    const { name } = req.params;
});

// get one person by timestamp
router.get("/person/timestamp/:timestamp", async (req, res) => {
    const timestamp = Number(req.params.timestamp);
});

// remove person by timestamp
router.delete("/person/timestamp/:timestamp", async (req, res) => {
    const timestamp = Number(req.params.timestamp);
});

// update person by timestamp
router.patch("/person/timestamp/:timestamp", async (req, res) => {
    const update = { ...req.body };
    const timestamp = Number(req.params.timestamp);
});

// get one person with name
router.get("/person/name/:name", async (req, res) => {});

export default router;
