import { Router } from "express";
import { sendError } from "../utils/error.js";

const router = Router();

router.get("/", async (req, res) => {
    const { mysql } = req.app;

    try {
        const [people] = await mysql.query("SELECT * FROM people");
        res.send({
            people,
        });
    } catch (error) {
        sendError(error, res);
    }
});

// router.post("/", async (req, res) => {});

export default router;
