import { useState } from 'react';
import { ChefHat, X, Sparkles, Clock, Flame, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useRecipes } from '../context/RecipeContext';

export default function Pantry() {
  const [ingredients, setIngredients] = useState(['Chicken Breast', 'Spinach', 'Garlic']);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { saveRecipe, removeRecipe, isSaved } = useRecipes();

  const handleAddIngredient = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      if (!ingredients.includes(inputValue.trim())) {
        setIngredients([...ingredients, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const generateRecipes = async () => {
    if (ingredients.length === 0) return;
    setIsGenerating(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${API_URL}/generate-recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
      });
      const data = await res.json();
      
      if (res.ok) {
        setRecipes(data);
      } else {
        alert("Failed to generate recipes.");
      }
    } catch (err) {
      console.error(err);
      alert("Backend server offline.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="px-4 pt-6 pb-24 min-h-[calc(100vh-3.5rem)] max-w-md mx-auto">
      
      {/* Ingredient Manager */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">My Pantry</h2>
        <p className="text-gray-500 font-medium mb-6">What ingredients do you have?</p>
        
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-4 focus-within:border-apple-green transition-colors">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddIngredient}
            placeholder="Type ingredient & press Enter..."
            className="w-full px-4 py-3 outline-none text-gray-800 bg-transparent placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <AnimatePresence>
            {ingredients.map(ing => (
              <motion.div
                key={ing}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-apple-light border border-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm"
              >
                {ing}
                <button onClick={() => removeIngredient(ing)} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={generateRecipes}
          disabled={isGenerating || ingredients.length === 0}
          className="w-full bg-apple-green text-white py-4 rounded-xl font-bold shadow-lg shadow-apple-green/30 flex items-center justify-center gap-2 hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
        >
          {isGenerating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <ChefHat className="w-5 h-5" />
            </motion.div>
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {isGenerating ? 'Curating magic...' : 'Generate Recipes'}
        </button>
      </div>

      {/* Recipe Results */}
      <AnimatePresence>
        {recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-apple-green" /> Chef's Suggestions
            </h3>
            
            {recipes.map((recipe, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={recipe.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="h-32 bg-gray-200 relative">
                  {/* Using a placeholder gradient if image fails to load quickly, but we have URL */}
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h4 className="absolute bottom-3 left-4 right-4 text-white font-bold text-lg leading-tight">{recipe.title}</h4>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-400" /> {recipe.prepTime}</span>
                    <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-red-400" /> {recipe.difficulty}</span>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full py-2.5 bg-gray-50 text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    View Full Recipe
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto"
          >
            <div className="relative h-64">
              <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 -mt-6 bg-white relative rounded-t-3xl min-h-screen">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                <button
                  onClick={() => isSaved(selectedRecipe.id) ? removeRecipe(selectedRecipe.id) : saveRecipe(selectedRecipe)}
                  className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 mt-1"
                >
                  <Heart className={cn("w-6 h-6 transition-colors", isSaved(selectedRecipe.id) ? "fill-red-500 text-red-500" : "text-gray-400")} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-400" /> {selectedRecipe.prepTime}</span>
                <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-red-400" /> {selectedRecipe.difficulty}</span>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Required Ingredients</h3>
                <ul className="space-y-2">
                  {ingredients.map(ing => (
                    <li key={ing} className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-apple-green" />
                      <span className="font-medium">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">How-to Steps</h3>
                <div className="space-y-6">
                  {selectedRecipe.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-apple-green/10 text-apple-green font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
