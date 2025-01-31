import express from "express";
import db from "../db/connection.js";
import cors from "cors"; // Import cors for cross-origin requests
import { ObjectId } from "mongodb"; // Import ObjectId for MongoDB querying

const router = express.Router();

// CORS setup
const app = express();
app.use(cors());  // Allow cross-origin requests from frontend

// GET average rating and the most recent feedback
router.get("/staff/feedbackSummary", async (req, res) => {
    try {
        const feedbackCollection = db.collection("Feedback");

        // Calculate average rating
        const aggregationPipeline = [
            { $group: { _id: null, averageRating: { $avg: "$rating" } } },
        ];
        const avgResult = await feedbackCollection.aggregate(aggregationPipeline).toArray();
        const averageRating = avgResult.length > 0 ? avgResult[0].averageRating : null;

        // Get the most recent feedback
        const recentFeedback = await feedbackCollection
            .find()
            .sort({ _id: -1 }) // Sort by most recent
            .limit(1)
            .toArray();

        res.status(200).json({
            averageRating: averageRating !== null ? averageRating : "No ratings yet",
            recentFeedback: recentFeedback.length > 0 ? recentFeedback[0] : null,
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

  

// POST new feedback
router.post("/feedback", async (req, res) => {
    const { userId, rating, feedback } = req.body;
    
    try {  
      const feedbackCollection = db.collection("Feedback");
      const result = await feedbackCollection.insertOne({
        userId,
        rating,
        feedback: feedback || ""  
      });
  
      res.status(201).json({ message: "Feedback submitted successfully!", result });
    } catch (err) {
      res.status(500).send(err);
    }
});
  


export default router;
