import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "test@gmail.com",
        pass: "password"
    }
});

let mailOptions = {
    
}