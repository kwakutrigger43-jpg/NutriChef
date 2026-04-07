const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Health check to confirm server is live
app.get('/', (req, res) => {
  res.send('NutriChef AI Backend is Online! 🚀');
});

// Debug: List available models for this API key
app.get('/api/debug-models', async (req, res) => {
  try {
    if (!genAI) return res.json({ error: "No API Key configured on server." });
    const models = await genAI.listModels();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Scan Food (Google Gemini)
app.post('/api/scan-food', async (req, res) => {
  try {
    if (!genAI) throw new Error("GEMINI_API_KEY is missing in Render settings.");

    const { imageBase64 } = req.body;
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Try Gemini 1.5 Flash first
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Analyze this food image and estimate the nutrition. Return ONLY a pure JSON object with keys: food_name, estimated_calories, protein, carbs, fats.";
    
    const result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType: 'image/jpeg' }}]);
    res.json(JSON.parse(result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()));

  } catch (error) {
    console.error("Scanner Error:", error);
    res.status(500).json({ error: "AI failed to analyze the photo. Please check your API Key in Render." });
  }
});

// Endpoint: Generate Recipes
app.post('/api/generate-recipes', async (req, res) => {
  try {
    if (!genAI) throw new Error("GEMINI_API_KEY is missing in Render settings.");
    const { ingredients } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Give me 3 recipes for: ${ingredients.join(", ")}. Reply ONLY with a pure JSON array of objects with keys: id, title, prepTime, difficulty, image, steps.`;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()));

  } catch (error) {
    console.error("Recipe Error:", error);
    res.status(500).json({ error: "AI failed to generate recipes." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node Server securely running on port ${PORT}`);
});
