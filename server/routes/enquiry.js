import express from "express";
import db from "../db/connection.js";

const router = express.Router();
import mongoose from "mongoose";
const {ObjectId} = mongoose.Types;


//Gets all enquiry data
router.get("/staff", async (req, res) => {
    try {
        const enquiriesCollection = db.collection("Enquiries");
        const enquiries = await enquiriesCollection.find().toArray();
        console.log(enquiries);
        res.status(200).json({enquiries});
    } catch (err) {
        res.status(500).json({error : "Internal Server Error"});
    }
});

//Posts new enquiry from user
router.post("/make", async (req, res) => {
    const {id, type, message} = req.body;

    try{
        const enquiriesCollection = db.collection("Enquiries");
        
        const doc = {

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

//Updates responseBy for a staff member
router.put("/staff/update", async (req, res) => {

    const { id, responseBy } = req.body;
    let _id =  new ObjectId(id);
    try {
        const enquiriesCollection = db.collection("Enquiries");
        const enquiries = await enquiriesCollection.updateOne({ _id  }, { $set: { responseBy : responseBy, status : "Responding"}});

        res.status(200).json({enquiries});
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router