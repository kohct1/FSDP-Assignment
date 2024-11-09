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


router.post("/sendMessage", async (req, res) => {
    const { enquiryId, senderId, message, isStaff } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(enquiryId)) {
        return res.status(400).json({ error: "Invalid enquiry ID" });
    }

    try {
        const enquiriesCollection = db.collection("Enquiries");
        const enquiry = await enquiriesCollection.findOne({ _id: new ObjectId(enquiryId) });

        if (!enquiry) {
            return res.status(404).json({ error: "Enquiry not found" });
        }

        const newMessage = {
            chatMessage: message,
            postedByID: senderId,
            respondedByID: isStaff ? senderId : null,
            timestamp: new Date().toISOString()
        };

        // Insert the message into the messages array
        const updatedEnquiry = await enquiriesCollection.updateOne(
            { _id: new ObjectId(enquiryId) },
            { $push: { messages: newMessage } }
        );

        if (updatedEnquiry.modifiedCount > 0) {
            res.status(200).json({ success: "Message sent successfully" });
        } else {
            res.status(500).json({ error: "Failed to send message" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default router