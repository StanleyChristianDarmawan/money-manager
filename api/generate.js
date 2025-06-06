const { GoogleGenAI } = require('@google/genai');

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.json(jsonParsed);
  } catch (err) {
    console.error("Failed to generate budget:", err);
    res.status(500).json({ error: "Failed to generate budget" });
  }
}