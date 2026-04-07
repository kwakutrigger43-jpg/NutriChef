import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/ui/Header';
import BottomNav from './components/ui/BottomNav';
import Scanner from './pages/Scanner';
import Pantry from './pages/Pantry';
import Cookbook from './pages/Cookbook';
import Auth from './pages/Auth';
import Paywall from './pages/Paywall';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, isLoading, isTrialExpired, hasPaid } = useAuth();
  const [activeTab, setActiveTab] = useState('scanner');

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-apple-light flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-apple-green animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (isTrialExpired && !hasPaid) {
    return <Paywall />;
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-apple-light relative shadow-2xl overflow-hidden sm:border-x sm:border-gray-200">
      <Header />
      
      <main className="h-full overflow-y-auto hide-scrollbar relative z-0 bg-gradient-to-b from-transparent to-white/50">
        {activeTab === 'scanner' && <Scanner />}
        {activeTab === 'pantry' && <Pantry />}
        {activeTab === 'cookbook' && <Cookbook />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
