-- ==========================================
-- 1. Create the Profiles Table
-- ==========================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  trial_start_date TIMESTAMPTZ DEFAULT NOW(),
  has_paid BOOLEAN DEFAULT false
);

-- Turn on Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read and update only their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Allow inserting profile upon registration
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- ==========================================
-- 2. Create the Recipes (Cookbook) Table
-- ==========================================
CREATE TABLE public.recipes (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  prepTime TEXT,
  difficulty TEXT,
  image TEXT,
  steps JSONB NOT NULL
);

-- Turn on Row Level Security for recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Allow users to perform all actions on ONLY their saved recipes
CREATE POLICY "Users can manage their own recipes" 
  ON public.recipes FOR ALL USING (auth.uid() = user_id);
