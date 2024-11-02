import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// GET route to fetch current queue count and last updated time
router.get("/queue", async (req, res) => {
    try {
        const queueCollection = db.collection("Queue");
        const queueData = await queueCollection.findOne(); // assuming there's only one document

        if (queueData) {
            res.status(200).json({
                queueCount: queueData.queueCount,
                lastUpdatedTime: queueData.lastUpdatedTime,
            });
        } else {
            res.status(404).json({ message: "Queue data not found" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// POST route to increment queue count
router.post("/queue", async (req, res) => {
    try {
        const queueCollection = db.collection("Queue");
        const updatedQueue = await queueCollection.findOneAndUpdate(
            {},
            {
                $inc: { queueCount: 1 },
                $set: { lastUpdatedTime: new Date().toLocaleTimeString() },
            },
            { returnDocument: "after" } // returns the updated document
        );

        if (updatedQueue.value) {
            res.status(200).json({
                queueCount: updatedQueue.value.queueCount,
                lastUpdatedTime: updatedQueue.value.lastUpdatedTime,
            });
        } else {
            res.status(404).json({ message: "Queue data not found" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;
