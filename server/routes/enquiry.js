import express from "express";
import db from "../db/connection.js";

const router = express.Router();
/* For testing purposes only
router.get("/", async (req, res) => {
   

    try {
        const enquiriesCollection = db.collection("Enquiries");
        const enquiries = await enquiriesCollection.find().toArray();
        console.log("getting");
        res.status(200).json({enquiries});
    } catch (err) {
        res.status(500).json({error : "Internal Server Error"});
    }
});
*/

//Gets all enquiry data
router.get("/", async (req, res) => {
    try {
        const enquiriesCollection = db.collection("Enquiries");
        const enquiries = await enquiriesCollection.find().toArray();
        console.log("getting");
        res.status(200).json({enquiries});
    } catch (err) {
        res.status(500).json({error : "Internal Server Error"});
    }
});

//Posts new enquiry from user
router.post("/make", async (req, res) => {
    const {id, type, message} = req.body;
    console.log(id + " " + type + " " + message);

    try{
        const enquiriesCollection = db.collection("Enquiries");
        const doc = {
            "_id": id + " " + message,
            "type": type,
            "message" : message,
            "status" : "Open",
            "postedBy": id,
            "responseBy" : "None",
        }
        const enquiries = await enquiriesCollection.insertOne(doc);

        res.status(200).json({enquiries});
    } catch (err) {
        res.status(500).json({error : "Internal Server Errors"});
    }
});

export default router