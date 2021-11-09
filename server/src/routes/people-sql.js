import { Router } from "express";
import { sendError } from "../utils/error.js";

const router = Router();

router.get("/", (req, res) => {
    const { mysql } = req.app;
    try {
        const [rows] = mysql.execute("SELECT * FROM people;");
        res.send(rows);
    } catch (error) {
        sendError(error, res);
    }
});

export default router;
