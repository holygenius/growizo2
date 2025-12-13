-- ============================================
-- ADD ONBOARDING DATA AND ADMIN LOGS TABLES
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/liyjajmawgwrniywtyko/sql

-- ============================================
-- 1. ADD ONBOARDING COLUMNS TO USERS TABLE
-- ============================================
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}';

-- onboarding_data structure:
-- {
--   "plantType": "herbs" | "vegetables" | "flowers",
--   "experienceLevel": "beginner" | "intermediate" | "expert",
--   "tentSize": "60x60" | "100x100" | "120x120",
--   "lightPreference": "led" | "hps" | "unsure",
--   "automationLevel": "manual" | "semi" | "full",
--   "completedAt": "2025-12-11T..."
-- }

CREATE INDEX IF NOT EXISTS idx_users_onboarding ON public.users(onboarding_completed);

COMMENT ON COLUMN public.users.onboarding_completed IS 'Whether user has completed the initial onboarding flow';
COMMENT ON COLUMN public.users.onboarding_data IS 'User preferences from onboarding questionnaire';


-- ============================================
-- 2. ADMIN ACCESS LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email VARCHAR(255),
    action VARCHAR(50) NOT NULL, -- 'login', 'logout', 'access'
    ip_address VARCHAR(45), -- IPv6 compatible
    user_agent TEXT,
    metadata JSONB DEFAULT '{}', -- Additional info like page accessed, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster log queries
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_access_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_access_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_access_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.admin_access_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view logs" ON public.admin_access_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.is_active = true
        )
    );

-- Admins can insert logs
CREATE POLICY "Admins can insert logs" ON public.admin_access_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.is_active = true
        )
    );

COMMENT ON TABLE public.admin_access_logs IS 'Tracks admin panel login/logout and access events';
