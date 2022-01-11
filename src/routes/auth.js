import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import joi from "joi";

dotenv.config();

const router = Router();

const userInfoSchema = joi.object({
    username: joi.string().max(50),
    password: joi.string().min(8),
});

router.post("/register", async (req, res) => {
    const { users } = req;

    try {
        const { username, password } =
            await userInfoSchema.validateAsync(req.body);

        if (!username) throw new Error("No username provided");
        if (!password) throw new Error("No password provided");

        const hashed = await bcrypt.hash(password, 10);

        users.insertOne({
            username,
            password: hashed,
        });

        res.send({
            registered: username,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const { users } = req;

    try {
        const all = await users.find({ username }).toArray();
        const [user] = all;

        if (!user) {
            return res.status(404).send({
                error: "Incorrect username or password",
            });
        }

        console.log(user);

        const validPw = await bcrypt.compare(password, user.password);

        if (!validPw) {
            return res.status(404).send({
                error: "Incorrect username or password",
            });
        }

        const token = jwt.sign(
            { userId: user._id, username },
            process.env.TOKEN_SECRET
        );

        res.send({
            token,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

export default router;
