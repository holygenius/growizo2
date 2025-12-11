-- ============================================
-- UPDATE USER BUILDS FOR AUTHENTICATED USERS
-- ============================================

-- 1. Add new columns
ALTER TABLE user_builds 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- 2. Update RLS policies
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create builds" ON user_builds;
DROP POLICY IF EXISTS "Anyone can read builds" ON user_builds;
DROP POLICY IF EXISTS "Anyone can update builds" ON user_builds;
DROP POLICY IF EXISTS "Users can create own builds" ON user_builds;
DROP POLICY IF EXISTS "Users can view own builds" ON user_builds;
DROP POLICY IF EXISTS "Users can update own builds" ON user_builds;
DROP POLICY IF EXISTS "Users can delete own builds" ON user_builds;

-- Create new policies
-- Policy for authenticated users to create builds linked to their ID
CREATE POLICY "Users can create own builds" ON user_builds
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for users to view their own builds
CREATE POLICY "Users can view own builds" ON user_builds
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to update their own builds
CREATE POLICY "Users can update own builds" ON user_builds
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to delete their own builds
CREATE POLICY "Users can delete own builds" ON user_builds
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Optional: Keep public access for anonymous builds if needed, or remove if strict
-- For now, let's allow anonymous inserts but maybe restriction on reading?
-- Let's stick to: Authenticated users manage their own. Anonymous support is separate.
-- If we want to support anonymous saving via session_id, we'd need mixed policies.
-- For this task, we focus on "User Profile", so authenticated is priority.
