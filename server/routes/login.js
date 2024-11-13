import express from "express";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, pin } = req.body;

    try {
        const users = db.collection("Users");
        const user = await users.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        if (pin !== user.pin) return res.status(400).json({ message: "Invalid pin" });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/register", async (req, res) => {
    const { email, pin } = req.body;

    try {
        const users = db.collection("Users");

        await users.insertOne({ email, pin, role: "Customer" });

        res.status(200).json();
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/decode", async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);

        res.status(200).json({ userId: decoded.userId });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/role", async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);

        res.status(200).json({ role: decoded.role });
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router
