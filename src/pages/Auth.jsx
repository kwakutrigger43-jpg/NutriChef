import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChefHat, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isLogin) {
      login(email, password);
    } else {
      register(email, password);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-apple-light">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-apple-green to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-apple-green/30 mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">NutriChef AI</h1>
          <p className="text-gray-500 font-medium mt-1">Your personal smart kitchen.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-green/50 focus:border-apple-green transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-green/50 focus:border-apple-green transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 active:scale-[0.98] transition-all mt-6"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-gray-500 hover:text-apple-green transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
