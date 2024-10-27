import express from "express";
import db from "../db/connection.js";

const router = express.Router();

router.get("/bookings/:date", async (req, res) => {
    const date = req.params.date;

    try {
        const bookingsCollection = db.collection("Bookings");
        const bookings = await bookingsCollection.find({ date }).toArray();

        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/bookings", async (req, res) => {
    const { date, time, slot } = req.body;

    try {
        const bookingsCollection = db.collection("Bookings");
        const bookings = await bookingsCollection.insertOne({ date, time, slot });

        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router
