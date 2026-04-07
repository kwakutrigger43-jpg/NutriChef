// 1. src/pages/Scanner.jsx
// Paste this into: https://github.com/kwakutrigger43-jpg/NutriChef/edit/main/src/pages/Scanner.jsx

import { useState, useRef } from 'react';
import { Camera, ImagePlus, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NutritionCard from '../components/scanner/NutritionCard';
import SkeletonLoader from '../components/scanner/SkeletonLoader';

export default function Scanner() {
  const [status, setStatus] = useState('idle'); // idle, processing, complete
  const [image, setImage] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        processImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Image) => {
    setStatus('processing');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/scan-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image })
      });
      const data = await res.json();
      
      if (res.ok) {
        setNutritionData(data);
      } else {
        alert("Failed to analyze image.");
      }
    } catch (err) {
      console.error(err);
      alert("Backend server offline.");
    } finally {
      setStatus('complete');
    }
  };

  const reset = () => {
    setStatus('idle');
    setImage(null);
    setNutritionData(null);
  };

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-24 min-h-[calc(100vh-3.5rem)]">
      <div className="w-full max-w-sm mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Scan Meal</h2>
        <p className="text-gray-500 font-medium">Snap a photo to estimate nutrition</p>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm"
          >
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border-2 border-dashed border-apple-green/40 hover:border-apple-green rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              <div className="bg-apple-green/10 p-4 rounded-2xl mb-4">
                <Camera className="w-10 h-10 text-apple-green" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Take a Photo</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <ImagePlus className="w-4 h-4" /> or upload from gallery
              </p>
            </div>
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <div className="relative w-48 h-48 mx-auto mb-8 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
              <img src={image} alt="Uploading..." className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-apple-green/40 to-transparent animate-pulse" />
            </div>
            <SkeletonLoader />
            <p className="text-center text-apple-green font-semibold mt-6 animate-pulse">Analyzing macronutrients...</p>
          </motion.div>
        )}

        {status === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="relative w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden shadow-md border-4 border-white z-10 transition-transform hover:scale-105">
              <img src={image} alt="Analyzed meal" className="w-full h-full object-cover" />
            </div>
            
            <div className="-mt-16 pt-12">
              <NutritionCard data={nutritionData} />
            </div>

            <button
              onClick={reset}
              className="mt-8 mx-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-800 active:scale-95 transition-all text-sm"
            >
              <RefreshCcw className="w-4 h-4" />
              Scan Another Profile
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}

