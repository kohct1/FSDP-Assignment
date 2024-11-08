import cors from "cors";
import express from "express";
import login from "./routes/login.js";
import booking from "./routes/booking.js";
import queue from "./routes/queue.js";
import enquiry from "./routes/enquiry.js";

const app = express();
const PORT = process.env.PORT || 5050;


app.use(cors());
app.use(express.json());
app.use("/", login);
app.use("/", booking);
app.use("/", queue);
app.use("/enquiries", enquiry);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
