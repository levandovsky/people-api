import { Router } from "express";
import { body } from "express-validator";
import Pet from "../models/Pet.js";
import { sendError } from "../utils/error.js";

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

export default router;
