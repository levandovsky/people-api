import { Router } from "express";
import { body } from "express-validator";
import Pet from "../models/Pet.js";
import { sendError } from "../utils/error.js";
import { validatePersonId } from "../utils/validatorsMongo.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { petsCollection } = req;
        const result = await petsCollection.find().toArray();
        res.send(result);
    } catch (e) {
        sendError(e, res);
    }
});

router.post(
    "/",
    body("ownerId", "Bad owner id").custom(validatePersonId),
    body(["type", "name", "age"]).exists(),
    body("age").isFloat({ min: 1, max: 100 }),
    async (req, res) => {
        try {
            const { petsCollection } = req;
            const pet = new Pet({ ...req.body });
            await petsCollection.insertOne(pet);
            res.send(pet);
        } catch (e) {
            sendError(e, res);
        }
    }
);

router.get("/with-owner", async (req, res) => {
    try {
        const { petsCollection } = req;
        const pipeline = [
            {
                $lookup: {
                    from: "people",
                    localField: "ownerId",
                    foreignField: "_id",
                    as: "owner",
                },
            },
        ];

        const data = await petsCollection.aggregate(pipeline).toArray();

        res.send(data);
    } catch (error) {
        sendError(error, res);
    }
});

export default router;
