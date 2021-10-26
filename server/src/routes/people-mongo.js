import { Router } from "express";
import { body, validationResult, param } from "express-validator";
import { ObjectId } from "mongodb";
import Person from "../models/Person.js";
import Pet from "../models/Pet.js";

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
    body("age").isFloat({ min: 1, max: 150 }),
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
            res.status(500).send({
                error: e.message,
            });
        }
    }
);

// get all people with name
router.get("/name/:name", async (req, res) => {
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
        res.status(500).send({
            error: e.message,
        });
    }
});

// get all by age
router.get(
    "/age/:age",
    // validate age field with custom validator, same functionality can
    // be achieved using 'param("age").isFloat({min: 1, max: 150})'
    param("age").custom((age) => {
        // convert to number
        const _age = Number(age);

        // if value is not a number validation failed
        if (Number.isNaN(_age)) return false;

        // if value is less or equal to 0
        // or value is greater than 150 validation failed
        if (age < 1 || age > 150) return false;

        // otherwise validaiton passed
        return true;
    }),
    async (req, res) => {
        try {
            // check validation result
            const errors = validationResult(req);

            // if there are errors, send them to the client
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .send({ errors: errors.array() });
            }

            // convert age to number
            const age = Number(req.params.age);

            const {
                mongo: {
                    collections: { people },
                },
            } = req;

            const found = await people.find({ age }).toArray();
            res.send(found);
        } catch (e) {
            res.status(500).send({
                error: e.message,
            });
        }
    }
);

router.get("/average/age", async (req, res) => {
    try {
        const {
            collections: { people },
        } = req.mongo;

        const pipeline = [
            {
                $group: {
                    _id: "average",
                    average: { $avg: "$age" },
                },
            },
        ];

        const result = await people.aggregate(pipeline).toArray();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: error.message,
        });
    }
});

// adds a pet to person by id
router.post(
    "/person/:id/pet",
    param("id").custom(async (id, { req }) => {
        const {
            collections: { people },
        } = req.mongo;

        try {
            const found = await people.findOne({ _id: ObjectId(id) });
            if (!found) return Promise.reject();
            return Promise.resolve();
        } catch (e) {
            console.error(e);
        }
    }),
    body(["name", "type", "age"], "Field is required").exists(),
    body("age", "Age must be a number").isFloat({ min: 1, max: 100 }),
    async (req, res) => {
        try {
            // validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({
                    errors: errors.array(),
                });
            }

            const { id } = req.params;
            const {
                collections: { people, pets },
            } = req.mongo;

            const pet = new Pet({ ...req.body });
            await pets.insertOne(pet);
            await people.updateOne(
                { _id: ObjectId(id) },
                {
                    $push: { pets: pet._id },
                }
            );

            res.send({
                addedPet: pet,
                updatedPersonId: id,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                error: error.message
            });
        }
    }
);

export default router;
