import Person from "../models/Person.js";
import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { ObjectId } from "mongodb";
import { sendError } from "../utils/error.js";
import {
    personUpdateValidator,
    validatePersonId,
    validatePetId,
} from "../utils/validators.js";

const router = Router();

// send all people from the database
router.get("/", async (req, res) => {
    try {
        const { peopleCollection } = req;
        const data = await peopleCollection.find().toArray();
        res.send(data);
    } catch (e) {
        sendError(e, res);
    }
});

// add a person to database
router.post(
    "/",
    body(["name", "lastname", "age"], "Missing param").exists(),
    body(["name", "lastname"]).isString(),
    body("age").isFloat({ min: 1, max: 150 }),
    async (req, res) => {
        const { peopleCollection } = req;

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .send({ errors: errors.array() });
            }

            const person = new Person({ ...req.body });

            // insertOne mutates argument and adds _id field to it.
            await peopleCollection.insertOne(person);

            res.send(person);
        } catch (e) {
            sendError(e, res);
        }
    }
);

router.delete(
    "/person/:id",
    param("id").custom(validatePersonId),
    async (req, res) => {
        try {
            const { peopleCollection } = req;

            const { id } = req.params;

            await peopleCollection.deleteOne({
                _id: ObjectId(id),
            });

            res.send({
                deletedPersonId: id,
            });
        } catch (e) {
            sendError(e, res);
        }
    }
);

router.patch(
    "/person/:id",
    param("id").custom(validatePersonId),
    body(undefined, "Bad model").custom(personUpdateValidator),
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

            const { peopleCollection } = req;

            const { id } = req.params;

            // create update object
            const update = {
                ...req.body,
                updatedAt: Date.now(),
            };

            // update person
            await peopleCollection.updateOne(
                { _id: ObjectId(id) },
                {
                    $set: update,
                }
            );

            // send updated id in response
            res.send({
                updatedPersonId: id,
            });
        } catch (e) {
            sendError(e, res);
        }
    }
);

// get all people with name
router.get("/name/:name", async (req, res) => {
    const { name } = req.params;
    const { peopleCollection } = req;
    try {
        const found = await peopleCollection.find({ name }).toArray();

        res.send(found);
    } catch (e) {
        sendError(e, res);
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

            const { peopleCollection } = req;

            const found = await peopleCollection
                .find({ age })
                .toArray();

            res.send(found);
        } catch (e) {
            sendError(e, res);
        }
    }
);

router.get("/average/age", async (req, res) => {
    try {
        const { peopleCollection } = req;

        const pipeline = [
            {
                $group: {
                    _id: "average",
                    average: { $avg: "$age" },
                },
            },
        ];

        const result = await peopleCollection
            .aggregate(pipeline)
            .toArray();

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
    "/person/:id/pet/:petId",
    param("id").custom(validatePersonId),
    param("petId").custom(validatePetId),
    async (req, res) => {
        try {
            // validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({
                    errors: errors.array(),
                });
            }

            const { id, petId } = req.params;
            const { peopleCollection } = req;

            await peopleCollection.updateOne(
                { _id: ObjectId(id) },
                {
                    $push: { petIds: ObjectId(petId) },
                }
            );

            res.send({
                addedPetId: petId,
                updatedPersonId: id,
            });
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.get(
    "/person/:id/pets",
    param("id").custom(validatePersonId),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({
                    errors: errors.array(),
                });
            }
            const { peopleCollection } = req;

            const { id } = req.params;

            const pipeline = [
                {
                    $match: {
                        _id: ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "pets",
                        localField: "_id",
                        foreignField: "ownerId",
                        as: "pets"
                    },
                }
            ];

            const result = await peopleCollection
                .aggregate(pipeline)
                .toArray();

            res.send(result);
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.get(
    "/person/:id/car",
    param("id").custom(validatePersonId),
    async (req, res) => {
        try {
            const { peopleCollection } = req;
            const pipeline = [
                {
                    $lookup: {
                        from: "cars",
                        localField: "_id",
                        foreignField: "ownerId",
                        as: "car",
                    },
                },
                {
                    $unset: ["carId"],
                },
            ];

            const result = await peopleCollection
                .aggregate(pipeline)
                .toArray();

            res.send(result);
        } catch (error) {
            sendError(error, res);
        }
    }
);



export default router;
