import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const RecipeContext = createContext();

export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id);
          
        if (!error && data) {
          // Parse JSON steps
          setSavedRecipes(data);
        } else {
          // Fallback to local storage if DB fails or tables don't exist yet
          const stored = localStorage.getItem(`nutrichef_recipes_${user.email}`);
          setSavedRecipes(stored ? JSON.parse(stored) : []);
        }
      } else {
        setSavedRecipes([]);
      }
    };
    fetchRecipes();
  }, [user]);

  const saveRecipe = async (recipe) => {
    if (!user) return;
    const isAlreadySaved = savedRecipes.some(r => r.id === recipe.id);
    
    if (!isAlreadySaved) {
      // Standardize ID to avoid conflicts
      const dbRecipe = { ...recipe, user_id: user.id };
      
      const updated = [...savedRecipes, dbRecipe];
      setSavedRecipes(updated);
      
      // Async insert to Supabase
      const { error } = await supabase.from('recipes').insert([dbRecipe]);
      if (error) {
        // Fallback to LS
        localStorage.setItem(`nutrichef_recipes_${user.email}`, JSON.stringify(updated));
      }
    }
  };

  const removeRecipe = async (recipeId) => {
    if (!user) return;
    const updated = savedRecipes.filter(r => r.id !== recipeId);
    setSavedRecipes(updated);
    
    // Remote delete from Supabase
    const { error } = await supabase.from('recipes').delete().eq('id', recipeId).eq('user_id', user.id);
    if (error) {
      // Fallback
      localStorage.setItem(`nutrichef_recipes_${user.email}`, JSON.stringify(updated));
    }
  };
  
  const isSaved = (recipeId) => {
    return savedRecipes.some(r => r.id === recipeId);
  };

  return (
    <RecipeContext.Provider value={{ savedRecipes, saveRecipe, removeRecipe, isSaved }}>
      {children}
    </RecipeContext.Provider>
  );
};
