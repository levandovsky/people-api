import { Router } from "express";
import { body } from "express-validator";
import Car from "../models/Car.js";
import { sendError } from "../utils/error.js";
import { validatePersonId } from "../utils/validatorsMongo.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { carsCollection } = req;
        const result = await carsCollection.find().toArray();
        res.send(result);
    } catch (e) {
        sendError(e, res);
    }
});

router.post(
    "/",
    body("ownerId", "Bad owner id").custom(validatePersonId),
    body("brand").exists(),
    async (req, res) => {
        try {
            const { carsCollection } = req;
            const car = new Car({ ...req.body });
            await carsCollection.insertOne(car);
            res.send(car);
        } catch (e) {
            sendError(e, res);
        }
    }
);

export default router;
