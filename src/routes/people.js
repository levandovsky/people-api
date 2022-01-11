import Person from "../models/Person.js";
import { Router } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { sendError } from "../utils/error.js";
import {
    personUpdateValidator,
    validatePersonId,
} from "../utils/validatorsMongo.js";
import { validateErrorsMiddleware } from "../utils/validateErrorsMiddleware.js";
import { loggedInMiddleware } from "../utils/loggedInMiddleware.js";

const router = Router();

// send all people from the database
router.get("/", loggedInMiddleware, async (req, res) => {
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
    loggedInMiddleware,
    body(["name", "lastname", "age"], "Missing param").exists(),
    body(["name", "lastname"]).isString(),
    body("age").isFloat({ min: 1, max: 150 }),
    validateErrorsMiddleware,
    async (req, res) => {
        const { peopleCollection } = req;

        try {
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
    loggedInMiddleware,
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
    loggedInMiddleware,
    param("id").custom(validatePersonId),
    body(undefined, "Bad model").custom(personUpdateValidator),
    validateErrorsMiddleware,
    async (req, res) => {
        try {
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

export default router;
