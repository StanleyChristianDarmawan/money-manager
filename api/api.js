const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const basePrompt = (userInput) => `
You are a helpful financial AI assistant.

Your job is to take the user's complaint or request (they will say their income and their target saving), and respond ONLY with a JSON object with this exact structure:

{
  "totalIncome": [number],
  "targetSaving": [number],
  "estimatedSpending": [totalIncome - targetSaving],
  "advice": "short, friendly suggestion (1 sentence)",
  "categories": [
    {
      "title": "short name for this expense group",
      "amount": [number],
      "priority": "low" | "medium" | "high",
      "category": "Food" | "Transport" | "Leisure" | "Bills" | "Other"
    },
    ...
  ]
}

- Use 3 to 5 categories only.
- Distribute the estimatedSpending amount across these categories realistically.
- Do NOT include anything outside the JSON object. No extra explanation.
- The structure must always be the same even if user is vague.

User input:
"""
${userInput}
"""
`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  try {
    const { userInput } = req.body;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [{ role: "user", parts: [{ text: basePrompt(userInput) }] }]
    });

    const text = result.response.text().trim();

    const json = JSON.parse(text);

    return res.status(200).json(json);
  } catch (error) {
    console.error('Error generating budget:', error);
    return res.status(500).json({ error: 'Failed to generate budget' });
  }
};
