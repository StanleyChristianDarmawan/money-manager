import { GoogleGenAI } from '@google/genai';

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
    }
  ]
}

Use 3 to 5 categories. Do NOT include anything outside the JSON. Structure must stay the same.

User input:
"""
${userInput}
"""
`;

export default async function handler(req, res) {
  // ✅ Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { userInput } = req.body;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(basePrompt(userInput));
    const text = result.response.text().trim();

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const jsonString = text.slice(jsonStart, jsonEnd + 1);
    const jsonParsed = JSON.parse(jsonString);

    return res.status(200).json(jsonParsed);
  } catch (err) {
    console.error('Failed to generate budget:', err);
    return res.status(500).json({ error: 'Failed to generate budget' });
  }
}
