-- ============================================
-- ADD ONBOARDING_COMPLETED COLUMN TO USERS TABLE
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/liyjajmawgwrniywtyko/sql

-- Add onboarding_completed column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Create index for faster lookups on new users
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON public.users(onboarding_completed);

-- Comment for documentation
COMMENT ON COLUMN public.users.onboarding_completed IS 'Whether user has completed the initial onboarding flow';
