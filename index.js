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

// Health check to confirm server is live
app.get('/', (req, res) => {
  res.send('NutriChef AI Backend is Online! 🚀');
});

// Endpoint: Scan Food (Google Gemini Vision)
app.post('/api/scan-food', async (req, res) => {
  try {
    if (!genAI) {
      console.log("Mocking Scanner Response (No Gemini API Key detected)");
      return setTimeout(() => res.json({
        food_name: 'Grilled Salmon Bowl',
        estimated_calories: 640,
        protein: '42g',
        carbs: '58g',
        fats: '24g'
      }), 2000);
    }

    const { imageBase64 } = req.body; // e.g. "data:image/jpeg;base64,..."
    
    // Gemini needs base64 without the mime header string directly for `inlineData`
    // Convert "data:image/jpeg;base64,/9j/4AAQ..." to just base64 and mime
    const mimeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analyze this food image and estimate the nutrition. Return ONLY a pure JSON object (no markdown, no backticks) with these exact string keys: food_name, estimated_calories, protein, carbs, fats.";
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    let responseText = result.response.text();
    
    // Clean potential markdown wrap just in case Gemini ignored the "no backticks" instruction
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(responseText);
    res.json(parsed);

  } catch (error) {
    console.error("Scanner API Error:", error);
    res.status(500).json({ error: "Failed to process image." });
  }
});

// Endpoint: Generate Recipes (Google Gemini Text)
app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!genAI) {
      console.log("Mocking Recipe Response (No Gemini API Key detected)");
      return setTimeout(() => res.json([
        {
          id: Date.now(),
          title: `Pan-seared ${ingredients[0] || 'Meal'}`,
          prepTime: '25 mins',
          difficulty: 'Medium',
          image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=2070&auto=format&fit=crop',
          steps: ['Preheat the pan.', 'Add ingredients.', 'Cook thoroughly.', 'Serve and enjoy!']
        }
      ]), 1500);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional chef. Given these ingredients: ${ingredients.join(", ")}, reply ONLY with a pure JSON array (no markdown, no backticks) of 3 recipe objects. Keys MUST be: id (integer), title (string), prepTime (string), difficulty (string), image (an unsplash photo URL or empty), steps (array of strings).`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean potential markdown wrap
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    res.json(JSON.parse(responseText));

  } catch (error) {
    console.error("Recipe API Error:", error);
    res.status(500).json({ error: "Failed to generate recipes." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node Server securely running on port ${PORT}`);
});
