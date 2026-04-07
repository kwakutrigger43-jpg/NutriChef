import { BookOpen, Clock, Flame, Heart, X, ChefHat } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function Cookbook() {
  const { savedRecipes, removeRecipe } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  if (savedRecipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 pb-24 text-center">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center max-w-sm w-full">
          <div className="w-16 h-16 bg-apple-green/10 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-apple-green" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cookbook is empty</h2>
          <p className="text-gray-500 font-medium">Head over to the Pantry to generate and save your favorite recipes!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 min-h-[calc(100vh-3.5rem)] max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Cookbook</h2>
        <p className="text-gray-500 font-medium flex items-center gap-2">
          <Heart className="w-4 h-4 fill-apple-green text-apple-green" /> 
          {savedRecipes.length} Saved {savedRecipes.length === 1 ? 'Recipe' : 'Recipes'}
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {savedRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex p-3 gap-4"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-1 pr-2">
                <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{recipe.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-400" /> {recipe.prepTime}</span>
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-red-500" /> {recipe.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="text-xs font-bold text-apple-green bg-apple-green/10 px-3 py-1.5 rounded-lg hover:bg-apple-green/20 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => removeRecipe(recipe.id)}
                    className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Full Recipe Modal (Reused layout from Pantry) */}
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
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-400" /> {selectedRecipe.prepTime}</span>
                <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-red-400" /> {selectedRecipe.difficulty}</span>
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
