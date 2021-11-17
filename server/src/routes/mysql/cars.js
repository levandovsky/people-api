import { Router } from "express";
import { body } from "express-validator";
import { sendError } from "../../utils/error.js";
import { validateErrorsMiddleware } from "../../utils/validateErrorsMiddleware.js";

const router = Router();

router.get("/", async (req, res) => {
    const { mysql } = req.app;

    try {
        const query = `
            SELECT 
            c.id AS plate_number,
            brand,
            owner_id,
            p.name AS owner_name,
            p.lastname AS owner_lastname
            FROM cars c
                INNER JOIN car_brands b ON c.brand_id = b.id
                INNER JOIN people p ON c.owner_id = p.id;
        `;
        const [cars] = await mysql.query(query);

        res.send(cars);
    } catch (error) {
        sendError(error, res);
    }
});

router.post(
    "/",
    body(["id", "brand_id", "owner_id"]).exists(),
    body(["id"]).custom((id) => /[A-Z]{3}\d{3}/.test(id)),
    validateErrorsMiddleware,
    async (req, res) => {
        const { mysql } = req.app;
        const { id, brand_id, owner_id } = req.body;

        try {
            const query = "INSERT INTO cars VALUES (?, ?, ?);";
            await mysql.query(query, [id, brand_id, owner_id]);

            res.status(201).send({
                added: {
                    id,
                    brand_id,
                    owner_id
                }
            });
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.post("/brands/:brand", async (req, res) => {
    const { brand } = req.params;
    const { mysql } = req.app;
    try {
        const query = "INSERT INTO car_brands (brand) VALUES (?);";
        const [{ insertId }] = await mysql.query(query, [brand]);
        res.status(201).send({
            added: {
                id: insertId,
                brand,
            },
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(500).send({
                error: `Brand ${brand} already exists`,
            });
        }
        sendError(error, res);
    }
});

export default router;
