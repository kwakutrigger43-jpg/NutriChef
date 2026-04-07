import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, Zap, Infinity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MoMoCheckout from '../components/payment/MoMoCheckout';

export default function Paywall() {
  const { logout } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const features = [
    { icon: Infinity, text: "Unlimited accurate food scanning" },
    { icon: Zap, text: "Instant AI recipe generation" },
    { icon: Star, text: "Personalized diet tracking" }
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen bg-apple-dark text-white px-6 pb-8 pt-16 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-apple-green/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl opacity-50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-center relative z-10"
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/10">
            <Lock className="w-8 h-8 text-apple-green" />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Your 30-day free trial has ended.
          </h1>
          <p className="text-gray-400 text-lg font-medium mb-10 max-w-sm">
            Subscribe now to keep accessing your personal smart kitchen and hitting your goals.
          </p>

          <div className="space-y-6 mb-12">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-apple-green/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-apple-green" />
                  </div>
                  <span className="font-semibold text-lg">{feature.text}</span>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black">30 GHS</span>
              <span className="text-gray-400 font-medium">/ lifetime</span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-apple-green text-gray-900 py-4 rounded-2xl font-extrabold text-lg shadow-[0_0_40px_-10px_#34C759] hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Pay via Mobile Money
            </button>
            <button
              onClick={logout}
              className="w-full mt-4 text-gray-500 font-semibold py-4 hover:text-white transition-colors"
            >
              Switch Account
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCheckout && (
          <MoMoCheckout isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
