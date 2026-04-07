import { motion } from 'framer-motion';

export default function NutritionCard({ data }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm mx-auto border border-gray-100"
    >
      <h3 className="text-2xl font-bold text-center mb-1 text-gray-900 capitalize">{data.food_name}</h3>
      <p className="text-center text-sm text-gray-500 mb-6 font-medium">Estimated Nutrition</p>
      
      <div className="flex justify-center items-end gap-2 mb-8">
        <span className="text-5xl font-extrabold text-apple-green tracking-tight">{data.estimated_calories}</span>
        <span className="text-lg font-semibold text-gray-400 mb-1">kcal</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Protein</span>
          <span className="text-lg font-bold text-orange-600">{data.protein}</span>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Carbs</span>
          <span className="text-lg font-bold text-blue-600">{data.carbs}</span>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 flex flex-col items-center">
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1">Fats</span>
          <span className="text-lg font-bold text-yellow-600">{data.fats}</span>
        </div>
      </div>
    </motion.div>
  );
}
