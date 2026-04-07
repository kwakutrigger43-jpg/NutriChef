import { Camera, Refrigerator, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'scanner', label: 'Scanner', icon: Camera },
    { id: 'pantry', label: 'Pantry', icon: Refrigerator },
    { id: 'cookbook', label: 'Cookbook', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 z-50 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe">
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-apple-green" : "text-apple-gray hover:text-gray-900"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-apple-green rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
