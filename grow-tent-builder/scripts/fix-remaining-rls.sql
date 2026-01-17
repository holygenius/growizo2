-- ============================================================
-- FIX REMAINING RECURSIVE POLICIES
-- ============================================================
-- These policies still use direct admin_users queries causing recursion
-- ============================================================

-- Fix admin_access_logs policies
DROP POLICY IF EXISTS "admin_logs_select" ON public.admin_access_logs;
DROP POLICY IF EXISTS "admin_logs_insert" ON public.admin_access_logs;

CREATE POLICY "admin_logs_select"
ON public.admin_access_logs FOR SELECT
USING (public.is_admin_check());

CREATE POLICY "admin_logs_insert"
ON public.admin_access_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix feeding_schedule_items policies
DROP POLICY IF EXISTS "schedule_items_admin_all" ON public.feeding_schedule_items;
DROP POLICY IF EXISTS "schedule_items_public_read" ON public.feeding_schedule_items;

-- Anyone can read schedule items (public data)
CREATE POLICY "schedule_items_public_read"
ON public.feeding_schedule_items FOR SELECT
USING (is_active = true);

-- Admins can read all schedule items
CREATE POLICY "schedule_items_admin_read"
ON public.feeding_schedule_items FOR SELECT
USING (public.is_admin_check());

-- Admins can insert schedule items
CREATE POLICY "schedule_items_admin_insert"
ON public.feeding_schedule_items FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update schedule items
CREATE POLICY "schedule_items_admin_update"
ON public.feeding_schedule_items FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete schedule items
CREATE POLICY "schedule_items_admin_delete"
ON public.feeding_schedule_items FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- VERIFY: Check that no policies still use direct admin_users subquery
-- ============================================================
SELECT tablename, policyname, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND qual LIKE '%admin_users%'
AND qual NOT LIKE '%is_admin_check%';
