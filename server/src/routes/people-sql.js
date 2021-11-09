import { Router } from "express";
import { sendError } from "../utils/error.js";
import { body, query } from "express-validator";
import { sortValidator } from "../utils/validators.js";
import { validateErrorsMiddleware } from "../utils/validateErrorsMiddleware.js";
const router = Router();

router.get(
    "/",
    query("sort", "Invalid sort direction. Allowed values: ASC, DESC").custom(sortValidator),
    validateErrorsMiddleware,
    async (req, res) => {
        const { mysql } = req.app;
        const { limit = 5, sort = "ASC" } = req.query;

        try {
            const [people] = await mysql.query(
                `SELECT * FROM people
                ORDER BY age ${sort}
                LIMIT ${Number(limit)}`
            );

            res.send({
                people,
                limit: Number(limit),
                sort
            });

        } catch (error) {
            sendError(error, res);
        }
    }
);

router.post(
    "/",
    body(["name", "lastname", "age"], "Missing param").exists(),
    body(["name", "lastname"]).isString(),
    body("age").isFloat({ min: 1, max: 150 }),
    validateErrorsMiddleware,
    async (req, res) => {
        const { mysql } = req.app;
        const { name, lastname, age } = req.body;

        try {
            const [{ insertId }] = await mysql.query(
                `INSERT INTO people (name, lastname, age)
                VALUES ('${name}', '${lastname}', ${age});`
            );

            res.send({
                added: { ...req.body, id: insertId },
            });
        } catch (error) {
            sendError(error, res);
        }
    }
);

export default router;
