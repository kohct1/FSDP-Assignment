import express from "express";
import db from "../db/connection.js";

const router = express.Router();


router.get("/user", async (req, res) => {
    try {
        const usersCollection = db.collection("Users");
        const user = await usersCollection.find().toArray();
        res.status(200).json({user});
    } catch (err) {
        res.status(500).json({error : "Internal Server Error"});
    }
});

export default router;