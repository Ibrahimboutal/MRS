/*
  # Update RLS policies for movie platform tables
  
  1. Changes
    - Safely updates RLS policies for all tables
    - Adds proper INSERT/UPDATE/DELETE policies
    - Ensures users can only manage their own data
  
  2. Security
    - Enables RLS on all tables if not already enabled
    - Adds granular policies for each operation type
    - Enforces user-based access control
*/

-- Safely enable RLS on tables if not already enabled
DO $$ 
BEGIN
    EXECUTE format('ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY');
    EXECUTE format('ALTER TABLE IF EXISTS movie_ratings ENABLE ROW LEVEL SECURITY');
    EXECUTE format('ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY');
    EXECUTE format('ALTER TABLE IF EXISTS watchlist ENABLE ROW LEVEL SECURITY');
END $$;

-- Drop existing policies to ensure clean state
DO $$ 
BEGIN
    -- Profiles policies
    EXECUTE format('DROP POLICY IF EXISTS "Users can view all profiles" ON profiles');
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles');
    EXECUTE format('DROP POLICY IF EXISTS "Users can update own profile" ON profiles');
    
    -- Movie ratings policies
    EXECUTE format('DROP POLICY IF EXISTS "Users can view all ratings" ON movie_ratings');
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert own ratings" ON movie_ratings');
    EXECUTE format('DROP POLICY IF EXISTS "Users can update own ratings" ON movie_ratings');
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete own ratings" ON movie_ratings');
    
    -- Reviews policies
    EXECUTE format('DROP POLICY IF EXISTS "Users can view all reviews" ON reviews');
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews');
    EXECUTE format('DROP POLICY IF EXISTS "Users can update own reviews" ON reviews');
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews');
    
    -- Watchlist policies
    EXECUTE format('DROP POLICY IF EXISTS "Users can view own watchlist" ON watchlist');
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert into own watchlist" ON watchlist');
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete from own watchlist" ON watchlist');
END $$;

-- Recreate all policies

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Movie ratings policies
CREATE POLICY "Users can view all ratings"
  ON movie_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own ratings"
  ON movie_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON movie_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON movie_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Users can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Watchlist policies
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);