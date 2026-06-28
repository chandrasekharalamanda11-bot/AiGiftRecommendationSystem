-- Supabase Database Schema for Paper Plane
-- Copy and paste this script in your Supabase project's SQL Editor and click "Run".

-- 1. Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subscription TEXT DEFAULT 'Gift Curator Pro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid duplicate policy errors
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (true); -- Safe because 'id' is a foreign key referencing auth.users

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);


-- 2. Create saved_recommendations table
CREATE TABLE IF NOT EXISTS public.saved_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_price TEXT NOT NULL,
  why_it_fits TEXT NOT NULL,
  category TEXT NOT NULL,
  spark_option TEXT DEFAULT '',
  match_score INTEGER,
  original_region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);

-- Enable RLS on saved_recommendations
ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own saved recommendations" ON public.saved_recommendations;
DROP POLICY IF EXISTS "Users can insert their own saved recommendations" ON public.saved_recommendations;
DROP POLICY IF EXISTS "Users can delete their own saved recommendations" ON public.saved_recommendations;

-- Create policies
CREATE POLICY "Users can view their own saved recommendations" ON public.saved_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved recommendations" ON public.saved_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved recommendations" ON public.saved_recommendations
  FOR DELETE USING (auth.uid() = user_id);


-- 3. Create recent_profiles table
CREATE TABLE IF NOT EXISTS public.recent_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  occasion TEXT NOT NULL,
  age TEXT NOT NULL,
  budget TEXT NOT NULL,
  interests TEXT DEFAULT '',
  vibe TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);

-- Enable RLS on recent_profiles
ALTER TABLE public.recent_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own recent profiles" ON public.recent_profiles;
DROP POLICY IF EXISTS "Users can insert their own recent profiles" ON public.recent_profiles;
DROP POLICY IF EXISTS "Users can delete their own recent profiles" ON public.recent_profiles;

-- Create policies
CREATE POLICY "Users can view their own recent profiles" ON public.recent_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recent profiles" ON public.recent_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recent profiles" ON public.recent_profiles
  FOR DELETE USING (auth.uid() = user_id);


-- 4. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Create policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
