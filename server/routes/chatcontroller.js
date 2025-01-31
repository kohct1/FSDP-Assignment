import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
import dotenv from "dotenv";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

// Configure safety settings for Gemini
const safetySetting = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
];

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings: safetySetting });

// Initial prompt to guide the model
const initialPrompt = `
Your task is to answer the user, with understandable grammar.
Avoid using too much technical jargon unless needed.
Format the answer by starting each new sentence on a new line.
Do not format your answers in markdown.
Do not use asterisks or any special characters in your answers.
Your goal is to make the response as clear and easy to understand as possible.
The user can only send messages about OCBC bank, and or banking in general.
The user is not allowed to send any messages about their own personal details like bank account, passwords and anything that could be a security risk.
You are also not allowed to send any responses asking for the user's personal details like their bank account, passwords and anything that could be a security risk.
If the user sends any messages that are not about OCBC bank, and or banking in general, then respond back that they are to only ask about questions relating to OCBC bank, and or banking in general.
`;

// Endpoint to handle chat message generation
app.post("/generate-text", async (req, res) => {
    const message = req.body.prompt;
    const history = req.body.history || []; // Optional history for context

    try {
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: initialPrompt }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = await response.text();

        res.json({ text });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).send("Error generating response");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default router