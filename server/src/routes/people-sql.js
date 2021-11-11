import { Router } from "express";
import { sendError } from "../utils/error.js";
import { body, query } from "express-validator";
import { sortValidator } from "../utils/validatorsSql.js";
import { validateErrorsMiddleware } from "../utils/validateErrorsMiddleware.js";

const router = Router();

router.get(
    "/",
    query(
        "sort",
        "Invalid sort direction. Allowed values: ASC, DESC"
    ).custom(sortValidator),
    validateErrorsMiddleware,
    async (req, res) => {
        const { mysql } = req.app;
        const { limit = 5, sort = "ASC" } = req.query;

        try {
            const query = `SELECT * FROM people
            ORDER BY age ${sort}
            LIMIT ${limit}`;

            const [people] = await mysql.query(query);

            res.send({
                people,
                limit: Number(limit),
                sort,
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

router.get("/person/:id", async (req, res) => {
    const { mysql } = req.app;
    const id = req.params.id;

    try {
        const [results] = await mysql.query(
            "SELECT * FROM people WHERE id=?",
            [id]
        );

        const [person] = results;

        if (!person) {
            return res.status(404).send({
                person: null
            });
        }

        res.send({
            person,
        });
    } catch (error) {
        sendError(error, res);
    }
});

router.put(
    "/person/:id",
    body(["name", "lastname", "age"], "Missing param").exists(),
    body(["name", "lastname"]).isString(),
    body("age").isFloat({ min: 1, max: 150 }),
    validateErrorsMiddleware,
    async (req, res) => {
        const { mysql } = req.app;
        const { name, lastname, age } = req.body;
        const id = Number(req.params.id);

        try {
            const [{ affectedRows }] = await mysql.query(
                `
                UPDATE people
                SET name = ?, lastname = ?, age = ?
                WHERE id= ?;
                `,
                [name, lastname, age, id]
            );

            if (!affectedRows) {
                return res.status(404).send({
                    error: `No person with id: ${id}`,
                });
            }

            res.send({
                updated: {
                    id,
                    ...req.body,
                },
            });
        } catch (error) {
            if (error.code === "ER_BAD_FIELD_ERROR") {
                return sendError(new Error("Bad person id"), res);
            }

            sendError(error, res);
        }
    }
);

router.delete("/person/:id", async (req, res) => {
    const { mysql } = req.app;
    const id = Number(req.params.id);

    try {
        const [{ affectedRows }] = await mysql.query(
            `DELETE FROM people WHERE id=${id};`
        );

        if (!affectedRows) {
            return res.status(404).send({
                error: `No person with id: ${id}`,
            });
        }

        res.send({
            deletedId: id,
        });
    } catch (error) {
        if (error.code === "ER_BAD_FIELD_ERROR") {
            return sendError(new Error("Bad person id"), res);
        }

        sendError(error, res);
    }
});

export default router;
