const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ============================================================
// GEMINI AI CONFIGURATION
// ============================================================

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-3.8-flash"
});


// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "VivaShield AI server is running."
    });

});


// ============================================================
// EMERGENCY AI ENDPOINT
// ============================================================

app.post("/api/emergency", async (req, res) => {

    try {

        const { message, category } = req.body;


        // ----------------------------------------------------
        // Validate user input
        // ----------------------------------------------------

        if (!message || message.trim() === "") {

            return res.status(400).json({

                success: false,

                message:
                    "Please describe the emergency situation."

            });

        }


        // ----------------------------------------------------
        // Emergency category
        // ----------------------------------------------------

        const emergencyCategory =
            category || "General Emergency";


        // ----------------------------------------------------
        // Professional AI Prompt
        // ----------------------------------------------------

        const prompt = `
You are VivaShield AI, a professional emergency safety guidance assistant.

Your purpose is to provide calm, clear and practical first-response safety guidance.

EMERGENCY CATEGORY:
${emergencyCategory}

USER'S SITUATION:
${message}


RESPONSE REQUIREMENTS:

Provide the response in exactly these four sections:

1. IMMEDIATE ACTIONS

Give 3 to 5 short, practical and safe actions that the person can take immediately.

2. WHAT TO AVOID

Give 3 to 5 important things the person should avoid doing.

3. EMERGENCY SERVICES

Explain clearly when the person should contact their local emergency services immediately.

4. IMPORTANT NOTE

Explain that VivaShield AI provides general informational safety guidance and is not a replacement for professional emergency responders, doctors, nurses or other qualified professionals.


STRICT SAFETY RULES:

- Prioritize immediate physical safety.
- Keep instructions simple and easy to understand.
- Do not diagnose medical conditions.
- Do not prescribe medicines or dosages.
- Do not provide dangerous or highly technical procedures.
- Never claim that you have contacted emergency services.
- Never claim that an ambulance, police officer, firefighter or medical professional has been dispatched.
- If the situation appears life-threatening, clearly tell the user to contact their local emergency services immediately.
- Do not invent emergency telephone numbers.
- Do not assume the user's country.
- Say "your local emergency services" instead of guessing a specific emergency number.


STRICT FORMATTING RULES:

- DO NOT use Markdown.
- DO NOT use ###.
- DO NOT use ##.
- DO NOT use #.
- DO NOT use **.
- DO NOT use * for emphasis.
- DO NOT use ---.
- DO NOT use Markdown bullet symbols.
- Use plain text only.
- Keep each section heading on its own line.
- Use numbered points such as "1.", "2.", "3." for actions.
- Keep the response clean and professional.
- Do not add extra sections before or after the four required sections.
`;


        // ----------------------------------------------------
        // Generate Gemini response
        // ----------------------------------------------------

        const result =
            await model.generateContent(prompt);


        const response =
            await result.response;


        const advice =
            response.text();


        // ----------------------------------------------------
        // Send response to frontend
        // ----------------------------------------------------

        res.json({

            success: true,

            response: advice

        });

    }


    catch (error) {

        console.error(
            "Gemini API Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "VivaShield AI could not process the request right now. Please try again."

        });

    }

});


// ============================================================
// SERVE FRONTEND
// ============================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {

    console.log(
        `VivaShield AI is running at http://localhost:${PORT}`
    );

});