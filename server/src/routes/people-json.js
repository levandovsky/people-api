import {Router} from "express";
import PeopleDatabase from "../database/PeopleDatabase.js";
const router = new Router();

// create people database object
const database = new PeopleDatabase();

// send all people from the database
router.get("/", async (req, res) => {
    const people = await database.getAll();
    res.send(people);
});

// add a person to database
router.post("/", async (req, res) => {
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
    const added = await database.addOne(person);

    // send status 201 with added person in response
    res.status(201).send({
        success: true,
        added,
    });
});

// get all people with name
router.get("/:name", async (req, res) => {
    const { name } = req.params;
    const allByName = await database.getAllWithName(name);

    res.send(allByName);
});

// get one person by timestamp
router.get("/timestamp/:timestamp", async (req, res) => {
    const timestamp = Number(req.params.timestamp);
    const person = await database.getOneByTimestamp(timestamp);

    res.send(person);
});

// remove person by timestamp
router.delete("/timestamp/:timestamp", async (req, res) => {
    const timestamp = Number(req.params.timestamp);
    const result = await database.deleteByTimestamp(timestamp);

    if (!result) {
        res.status(404).send({
            success: false,
            error: "User not found",
        });

        return;
    }

    res.send({
        success: true,
        updated: result,
    });
});

// update person by timestamp
router.patch("/timestamp/:timestamp", async (req, res) => {
    const update = { ...req.body };
    const timestamp = Number(req.params.timestamp);
    const result = await database.updateByTimestamp(
        timestamp,
        update
    );

    if (!result) {
        res.status(404).send({
            success: false,
            error: "User not found"
        });
    }

    res.send({
        success: true,
        updated: result
    });
});

// get one person with name
router.get("/name/:name", async (req, res) => {
    const { name } = req.params;
    const person = await database.getOneByName(name);

    res.send(person);
});

export default router;
