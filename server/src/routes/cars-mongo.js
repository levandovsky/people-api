import { Router } from "express";
import { body } from "express-validator";
import Car from "../models/Car.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { carsCollection } = req;
        const result = await carsCollection.find().toArray();
        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: e.message,
        });
    }
});

router.post("/", body("brand").exists(), async (req, res) => {
    try {
        const {carsCollection} = req;
        const car = new Car({...req.body});
        await carsCollection.insertOne(car);
        res.send(car);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: e.message,
        });
    }
});

export default router;
