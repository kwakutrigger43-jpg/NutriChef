import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session and listen for auth changes
  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (authUser) => {
    if (!authUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch user profile from Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('trial_start_date, has_paid')
        .eq('id', authUser.id)
        .single();
      
      if (!error && data) {
        setUser({ id: authUser.id, email: authUser.email, ...data });
        setHasPaid(data.has_paid);

        const joinDate = new Date(data.trial_start_date);
        const daysSinceJoin = (new Date() - joinDate) / (1000 * 60 * 60 * 24);
        setIsTrialExpired(daysSinceJoin > 30);
      } else {
        // Fallback for demo if profiles table does not exist
        setUser({ id: authUser.id, email: authUser.email });
        setHasPaid(false);
        setIsTrialExpired(false);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setIsLoading(false);
  };

  const register = async (email, password) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      // In a real scenario, a Supabase trigger handles profile creation
      // For fallback demo purposes if no triggers exist:
      await supabase.from('profiles').insert([{ id: data.user.id, trial_start_date: new Date().toISOString(), has_paid: false }]);
      alert("Registration successful. Please log in.");
    }
    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHasPaid(false);
    setIsTrialExpired(false);
  };

  const markAsPaid = async () => {
    setHasPaid(true);
    if (user) {
      // Update DB
      await supabase.from('profiles').update({ has_paid: true }).eq('id', user.id);
      setUser({ ...user, has_paid: true });
    }
  };

  const toggleTrialState = () => setIsTrialExpired(!isTrialExpired);

  const value = { user, isLoading, isTrialExpired, hasPaid, login, register, logout, markAsPaid, toggleTrialState };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
