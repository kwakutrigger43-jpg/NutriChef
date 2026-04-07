const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// 1. Health Check
app.get('/', (req, res) => res.send('NutriChef AI Backend is Online! 🚀'));

// 2. Scanner Endpoint
app.post('/api/scan-food', async (req, res) => {
  try {
    if (!genAI) throw new Error("No Key");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { imageBase64 } = req.body;
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const prompt = "Analyze this food image and estimate the nutrition. Return ONLY a pure JSON object with keys: food_name, estimated_calories, protein, carbs, fats.";
    const result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType: 'image/jpeg' }}]);
    res.json(JSON.parse(result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()));
  } catch (error) {
    console.error("Scanner Error, sending mock...");
    res.json({ food_name: 'Healthy Chicken Salad', estimated_calories: 450, protein: '35g', carbs: '12g', fats: '22g' });
  }
});

// 3. Recipe Endpoint
app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!genAI) throw new Error("No Key");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Chef role: Give me 3 recipes for: ${ingredients.join(", ")}. Reply ONLY with absolute pure JSON array [ {id, title, prepTime, difficulty, image, steps} ]`;
    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text().replace(/```json/g, '').replace(/```/g, '').trim()));
  } catch (error) {
    console.error("Recipe Error, sending mocks...");
    res.json([
      { id: 1, title: 'Quick Stir-fry', prepTime: '15m', difficulty: 'Easy', steps: ['Heat pan', 'Add ingredients', 'Cook 10m'] },
      { id: 2, title: 'Slow Roast', prepTime: '45m', difficulty: 'Medium', steps: ['Preheat oven', 'Season well', 'Bake 30m'] }
    ]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server on ${PORT}`));

