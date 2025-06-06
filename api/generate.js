import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export default async function handler(req, res) {
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
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { userInput } = req.body;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(`
You are a helpful AI assistant for budget planning.
Take this user message and return structured JSON:

{
  "totalIncome": number,
  "targetSaving": number,
  "estimatedSpending": number,
  "advice": "short suggestion",
  "categories": [
    {
      "title": string,
      "amount": number,
      "priority": "low" | "medium" | "high",
      "category": "Food" | "Transport" | "Leisure" | "Bills" | "Other"
    }
  ]
}

User input:
"""
${userInput}
"""`);

    const text = result.response.text().trim();

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const json = JSON.parse(text.slice(start, end + 1));

    return res.status(200).json(json);
  } catch (err) {
    console.error('Error generating budget:', err);
    return res.status(500).json({ error: 'Failed to generate budget' });
  }
}