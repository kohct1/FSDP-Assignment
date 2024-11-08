import express from "express";
import db from "../db/connection.js";

const router = express.Router();

router.get("/allBookings", async (req, res) => {
    try {
        const bookingsCollection = db.collection("Bookings");
        const bookings = await bookingsCollection.find().toArray();

        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).send(err);
    }
});

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

router.get("/userBookings/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const bookingsCollection = db.collection("Bookings");
        const bookings = await bookingsCollection.find({ userId }).toArray();

        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/bookings", async (req, res) => {
    const { date, time, slot, userId, reason } = req.body;

    try {
        const bookingsCollection = db.collection("Bookings");
        const bookings = await bookingsCollection.insertOne({ date, time, slot, userId, reason });

        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put("/bookings", async (req, res) => {
    const { userId, date, time, slot } = req.body;

    try {
        const bookingsCollection = db.collection("Bookings");
        await bookingsCollection.updateOne({ userId }, { $set: { date, time, slot } });

        res.status(200).json();
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put("/bookingsReason", async(req, res) => {
    const { userId, reason } = req.body;

    try {
        const bookingsCollection = db.collection("Bookings");
        await bookingsCollection.updateOne({ userId }, { $set: { reason } });

        res.status(200).json();
    } catch(err) {
        res.status(500).send(err);
    }
});

router.delete("/bookings/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const bookingsCollection = db.collection("Bookings");

        await bookingsCollection.deleteOne({ userId });

        res.status(200).json();
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router
