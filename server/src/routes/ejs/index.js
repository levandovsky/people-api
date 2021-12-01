import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    res.render("index", {
        greeting: "hello",
        posts: [
            {
                title: "post 1",
                content: "content 1",
            },
            {
                title: "post 2",
                content: "content 2",
            },
        ],
    });
});

router.get("/people", async (req, res) => {
    const { mysql } = req.app;
    const { limit = 5, sort = "ASC" } = req.query;
    const fields = ["name", "lastname", "age", "id"];

    try {
        const queryString = `SELECT ?? FROM ??
        ORDER BY name ${sort}
        LIMIT ${limit}`;

        const [people] = await mysql.query(queryString, [
            fields,
            "people",
        ]);

        res.render("people", {
            people,
        });
    } catch (error) {
        res.render("errors/500", {
            message: error.message,
        });
    }
});

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
            return res.status(404).render("errors/404", {
                message: `No person with id: ${id}`,
            });
        }

        res.render("person", { person });
    } catch (error) {
        res.render("errors/500", {
            message: error.message,
        });
    }
});

router.post("/person/edit", async (req, res) => {
    const {name, lastname, age, id} = req.fields;
    const { mysql } = req.app;

    try {
        const [{ affectedRows }] = await mysql.query(
            `
            UPDATE ??
            SET name = ?, lastname = ?, age = ?
            WHERE id= ?;
            `,
            ["people", name, lastname, age, id]
        );

        if (!affectedRows) {
            return res.status(404).render("errors/404", {
                message: `No person with id: ${id}`,
            });
        }

        res.redirect("/views/people");
    } catch (error) {
        res.render("errors/500", {
            message: error.message,
        });
    }
});

export default router;
