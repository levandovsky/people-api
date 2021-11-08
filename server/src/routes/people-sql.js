import { Router } from "express";
import { sendError } from "../utils/error.js";

const router = Router();

router.get("/", (req, res) => {
    const { mysql } = req.app;

    mysql.query("SELECT * FROM people;", (error, results) => {
        if (error) sendError(error);

        res.send(results);
    });
});

export default router;
