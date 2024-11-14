import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ocbcbytehackz@gmail.com",
        pass: "hpxlnllfvowaeyua"
    }
});

router.post("/bookingEmail", async (req, res) => {
    const { email, month, day, times } = req.body;

    let mailOptions = {
        from: "ocbcbytehackz@gmail.com",
        to: email,
        subject: "OCBC Call Booking Confirmation Email",
        text: `We look forward to serving you on ${month} ${day} from ${times[0]} - ${times[1]}. Please ensure that you are on time for a smooth experience. If you need to reschedule or cancel your appointment, you can do so via the OCBC website where you scheduled this booking.`
    }

    try {
        transporter.sendMail(mailOptions, (error, info) => {});

        res.status(200).json();
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router
