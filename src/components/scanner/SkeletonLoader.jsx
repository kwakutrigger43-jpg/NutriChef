import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm animate-pulse">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-16 h-16 border-4 border-apple-green border-t-transparent rounded-full animate-spin mb-6"
        />
        <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
        
        <div className="grid grid-cols-3 gap-4 w-full mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
