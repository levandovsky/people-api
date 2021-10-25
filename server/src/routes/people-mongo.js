import { Router } from "express";
import { body, validationResult } from "express-validator";
import Person from "../models/Person.js";

const router = Router();

// send all people from the database
router.get("/", async (req, res) => {
    const {
        mongo: {
            collections: { people },
        },
    } = req;

    const data = await people.find().toArray();
    res.send(data);
});

// add a person to database
router.post(
    "/",
    body(["name", "lastname", "age"], "Missing param").exists(),
    body(["name", "lastname"]).isString(),
    body("age").isNumeric(),
    async (req, res) => {
        const {
            mongo: {
                collections: { people },
            },
        } = req;

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .send({ errors: errors.array() });
            }

            const person = new Person({ ...req.body });

            // insertOne mutates argument and adds _id field to it.
            await people.insertOne(person);

            res.send(person);
        } catch (e) {
            if (e.name === "required") {
                res.status(400).send({
                    success: false,
                    error: e.message,
                });

                return;
            }

            res.status(500).send({
                error: e.message,
            });
        }
    }
);

// get all people with name
router.get("/:name", async (req, res) => {
    const { name } = req.params;
    const {
        mongo: {
            collections: { people },
        },
    } = req;
    try {
        const found = await people.find({ name }).toArray();

        res.send(found);
    } catch (e) {
        res.send({
            error: e.message,
        });
    }
});

export default router;
