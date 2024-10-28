import cors from "cors";
import express from "express";
import login from "./routes/login.js";
import booking from "./routes/booking.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", login);
app.use("/", booking);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
