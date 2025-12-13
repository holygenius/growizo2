-- ============================================
-- GRANT BASIC READ/WRITE PRIVILEGES TO AUTHENTICATED ROLE
-- Run in Supabase SQL Editor (same project)
-- This works together with existing RLS policies. RLS will still enforce row-level checks.
-- ============================================

-- Allow authenticated role to use public schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Read access to public content tables (matches public-read RLS policies)
GRANT SELECT ON
    brands,
    categories,
    products,
    feeding_schedules,
    feeding_schedule_products,
    preset_sets,
    blog_posts
TO authenticated;

-- Read/write access for user-owned data (RLS restricts to auth.uid())
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_builds TO authenticated;

-- Optional: allow anon to keep reading even if future schema changes revoke defaults
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON
    brands,
    categories,
    products,
    feeding_schedules,
    feeding_schedule_products,
    preset_sets,
    blog_posts
TO anon;
