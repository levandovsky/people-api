import { Router } from "express";
import Person from "../models/Person.js";

const router = Router();

// send all people from the database
router.get("/", async (req, res) => {
    const {
        mongo: { collection },
    } = req;

    const people = await collection.find().toArray();
    res.send(people);
});

// add a person to database
router.post("/", async (req, res) => {
    const {
        mongo: { collection },
    } = req;

    try {
        const {name, age} = req.body;

        if (!name || !age) {
            res.status(400).send({
                success: false,
                error: "Invalid data"
            });

            return;
        }

        const person = new Person(name, age);

        // insertOne mutates argument and adds _id field to it.
        await collection.insertOne(person);

        res.send(person);

    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
});

// get all people with name
router.get("/:name", async (req, res) => {
    const { name } = req.params;
    const {
        mongo: {
            collection
        }
    } = req;
    try {
        const found = await collection.find({name}).toArray();

        res.send(found);
    } catch (e) {
        res.send({
            error: e.message
        });
    }
});


export default router;
