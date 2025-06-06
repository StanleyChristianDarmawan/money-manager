const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();
const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const basePrompt = (userInput) => `
You are a helpful financial AI assistant.

Your job is to take the user's complaint or request (they will say their income and their target saving), and respond ONLY with a JSON object with this exact structure:

{
  "totalIncome": [number],
  "targetSaving": [number],
  "estimatedSpending": [totalIncome - targetSaving],
  "advice": "honest suggestion",
  "categories": [
    {
      "title": "short name for this expense group",
      "amount": [number],
      "priority": "low" | "medium" | "high",
      "category": "category name eg food, transport, entertainment, etc.",
    }
  ]
}

- Distribute the estimatedSpending amount across these categories realistically.
- Do NOT include anything outside the JSON object. No extra explanation.
- The structure must always be the same even if user is vague.

User input:
"""
${userInput}
"""
`;

app.post('/generate-budget', async (req, res) => {
  const { userInput } = req.body;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [{ role: "user", parts: [{ text: basePrompt(userInput) }] }]
    });

    const rawText = result.text;

    if (!rawText) throw new Error("AI response is empty or malformed");

    const cleaned = rawText.replace(/```json|```/g, "").trim();

    const jsonParsed = JSON.parse(cleaned);

    console.log(JSON.stringify(jsonParsed, null, 2));

    res.json(jsonParsed);
  } catch (err) {
    console.error("Failed to generate budget:", err);
    res.status(500).json({ error: "Failed to generate budget" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});