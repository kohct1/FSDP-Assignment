import cors from "cors";
import express from "express";
import login from "./routes/login.js";
import booking from "./routes/booking.js";
import queue from "./routes/queue.js";
import enquiry from "./routes/enquiry.js";
import email from "./routes/email.js";
import chatcontroller from "./routes/chatcontroller.js";
import feedback from "./routes/feedback.js";
import branches from "./routes/branches.js";
import user from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 5050;


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type"],
}));
app.use(express.json());
app.use("/", login);
app.use("/", booking);
app.use("/", queue);
app.use("/enquiries", enquiry);
app.use("/", email);
app.use("/", chatcontroller);
app.use("/", feedback);
app.use("/", branches);
app.use("/", user);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
