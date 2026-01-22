-- ============================================================
-- FIX: Infinite Recursion in admin_users RLS Policy
-- ============================================================
-- Problem: "infinite recursion detected in policy for relation admin_users"
-- This happens when RLS policies on tables reference admin_users,
-- and admin_users itself has a policy that creates a circular reference.
-- ============================================================
-- RUN THIS SCRIPT IN SUPABASE SQL EDITOR
-- ============================================================

-- ============================================================
-- STEP 1: DROP ALL EXISTING POLICIES ON ALL AFFECTED TABLES
-- ============================================================

-- Drop all policies on admin_users
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'admin_users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_users', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on blog_posts
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'blog_posts' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.blog_posts', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on products
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'products' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.products', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on categories
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'categories' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.categories', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on brands
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'brands' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.brands', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on vendor_products
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'vendor_products' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.vendor_products', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on vendors
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'vendors' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.vendors', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on product_images
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'product_images' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.product_images', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on feeding_schedules
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'feeding_schedules' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.feeding_schedules', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on preset_sets
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'preset_sets' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.preset_sets', pol.policyname);
    END LOOP;
END $$;

-- ============================================================
-- STEP 2: DROP DEPENDENT POLICIES FIRST (that use is_admin_check)
-- ============================================================
DROP POLICY IF EXISTS "admin_logs_select" ON public.admin_access_logs;
DROP POLICY IF EXISTS "schedule_items_admin_read" ON public.feeding_schedule_items;
DROP POLICY IF EXISTS "schedule_items_admin_insert" ON public.feeding_schedule_items;
DROP POLICY IF EXISTS "schedule_items_admin_update" ON public.feeding_schedule_items;
DROP POLICY IF EXISTS "schedule_items_admin_delete" ON public.feeding_schedule_items;

-- Drop all policies on admin_access_logs
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'admin_access_logs' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_access_logs', pol.policyname);
    END LOOP;
END $$;

-- Drop all policies on feeding_schedule_items
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'feeding_schedule_items' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.feeding_schedule_items', pol.policyname);
    END LOOP;
END $$;

-- ============================================================
-- STEP 3: DROP ALL VERSIONS OF is_admin FUNCTION (now safe)
-- ============================================================
DROP FUNCTION IF EXISTS public.is_admin_check() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;

-- ============================================================
-- STEP 3: CREATE HELPER FUNCTION (SECURITY DEFINER)
-- This function bypasses RLS to check admin status
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin_check()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
    AND is_active = true
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin_check() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_check() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin_check() TO service_role;

-- ============================================================
-- STEP 4: ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preset_sets ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 5: CREATE NEW POLICIES FOR admin_users
-- ============================================================

-- Users can check their own admin status (for auth checking)
CREATE POLICY "admin_users_select_own"
ON public.admin_users FOR SELECT
USING (auth.uid() = id);

-- Admins can see all admin users
CREATE POLICY "admin_users_select_all_admins"
ON public.admin_users FOR SELECT
USING (public.is_admin_check());

-- Admins can insert new admin users
CREATE POLICY "admin_users_insert"
ON public.admin_users FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update admin users
CREATE POLICY "admin_users_update"
ON public.admin_users FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete admin users (except themselves)
CREATE POLICY "admin_users_delete"
ON public.admin_users FOR DELETE
USING (public.is_admin_check() AND id != auth.uid());

-- ============================================================
-- STEP 6: CREATE NEW POLICIES FOR blog_posts
-- ============================================================

-- Anyone can read published blog posts
CREATE POLICY "blog_posts_public_read"
ON public.blog_posts FOR SELECT
USING (is_published = true);

-- Admins can read all blog posts
CREATE POLICY "blog_posts_admin_read"
ON public.blog_posts FOR SELECT
USING (public.is_admin_check());

-- Admins can insert blog posts
CREATE POLICY "blog_posts_admin_insert"
ON public.blog_posts FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update blog posts
CREATE POLICY "blog_posts_admin_update"
ON public.blog_posts FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete blog posts
CREATE POLICY "blog_posts_admin_delete"
ON public.blog_posts FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 7: CREATE NEW POLICIES FOR products (PUBLIC READ)
-- ============================================================

-- Anyone can read active products
CREATE POLICY "products_public_read"
ON public.products FOR SELECT
USING (is_active = true);

-- Admins can read all products
CREATE POLICY "products_admin_read"
ON public.products FOR SELECT
USING (public.is_admin_check());

-- Admins can insert products
CREATE POLICY "products_admin_insert"
ON public.products FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update products
CREATE POLICY "products_admin_update"
ON public.products FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete products
CREATE POLICY "products_admin_delete"
ON public.products FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 8: CREATE NEW POLICIES FOR categories (PUBLIC READ)
-- ============================================================

-- Anyone can read active categories
CREATE POLICY "categories_public_read"
ON public.categories FOR SELECT
USING (is_active = true);

-- Admins can read all categories
CREATE POLICY "categories_admin_read"
ON public.categories FOR SELECT
USING (public.is_admin_check());

-- Admins can insert categories
CREATE POLICY "categories_admin_insert"
ON public.categories FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update categories
CREATE POLICY "categories_admin_update"
ON public.categories FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete categories
CREATE POLICY "categories_admin_delete"
ON public.categories FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 9: CREATE NEW POLICIES FOR brands (PUBLIC READ)
-- ============================================================

-- Anyone can read active brands
CREATE POLICY "brands_public_read"
ON public.brands FOR SELECT
USING (is_active = true);

-- Admins can read all brands
CREATE POLICY "brands_admin_read"
ON public.brands FOR SELECT
USING (public.is_admin_check());

-- Admins can insert brands
CREATE POLICY "brands_admin_insert"
ON public.brands FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update brands
CREATE POLICY "brands_admin_update"
ON public.brands FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete brands
CREATE POLICY "brands_admin_delete"
ON public.brands FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 10: CREATE NEW POLICIES FOR vendor_products (PUBLIC READ)
-- ============================================================

-- Anyone can read active vendor products
CREATE POLICY "vendor_products_public_read"
ON public.vendor_products FOR SELECT
USING (is_active = true);

-- Admins can read all vendor products
CREATE POLICY "vendor_products_admin_read"
ON public.vendor_products FOR SELECT
USING (public.is_admin_check());

-- Admins can insert vendor products
CREATE POLICY "vendor_products_admin_insert"
ON public.vendor_products FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update vendor products
CREATE POLICY "vendor_products_admin_update"
ON public.vendor_products FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete vendor products
CREATE POLICY "vendor_products_admin_delete"
ON public.vendor_products FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 11: CREATE NEW POLICIES FOR vendors (PUBLIC READ)
-- ============================================================

-- Anyone can read active vendors
CREATE POLICY "vendors_public_read"
ON public.vendors FOR SELECT
USING (is_active = true);

-- Admins can read all vendors
CREATE POLICY "vendors_admin_read"
ON public.vendors FOR SELECT
USING (public.is_admin_check());

-- Admins can insert vendors
CREATE POLICY "vendors_admin_insert"
ON public.vendors FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update vendors
CREATE POLICY "vendors_admin_update"
ON public.vendors FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete vendors
CREATE POLICY "vendors_admin_delete"
ON public.vendors FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 12: CREATE NEW POLICIES FOR product_images (PUBLIC READ)
-- ============================================================

-- Anyone can read product images
CREATE POLICY "product_images_public_read"
ON public.product_images FOR SELECT
USING (true);

-- Admins can insert product images
CREATE POLICY "product_images_admin_insert"
ON public.product_images FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update product images
CREATE POLICY "product_images_admin_update"
ON public.product_images FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete product images
CREATE POLICY "product_images_admin_delete"
ON public.product_images FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 13: CREATE NEW POLICIES FOR feeding_schedules (PUBLIC READ)
-- ============================================================

-- Anyone can read active feeding schedules
CREATE POLICY "feeding_schedules_public_read"
ON public.feeding_schedules FOR SELECT
USING (is_active = true);

-- Admins can read all feeding schedules
CREATE POLICY "feeding_schedules_admin_read"
ON public.feeding_schedules FOR SELECT
USING (public.is_admin_check());

-- Admins can insert feeding schedules
CREATE POLICY "feeding_schedules_admin_insert"
ON public.feeding_schedules FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update feeding schedules
CREATE POLICY "feeding_schedules_admin_update"
ON public.feeding_schedules FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete feeding schedules
CREATE POLICY "feeding_schedules_admin_delete"
ON public.feeding_schedules FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 14: CREATE NEW POLICIES FOR preset_sets (PUBLIC READ)
-- ============================================================

-- Anyone can read active preset sets
CREATE POLICY "preset_sets_public_read"
ON public.preset_sets FOR SELECT
USING (is_active = true);

-- Admins can read all preset sets
CREATE POLICY "preset_sets_admin_read"
ON public.preset_sets FOR SELECT
USING (public.is_admin_check());

-- Admins can insert preset sets
CREATE POLICY "preset_sets_admin_insert"
ON public.preset_sets FOR INSERT
WITH CHECK (public.is_admin_check());

-- Admins can update preset sets
CREATE POLICY "preset_sets_admin_update"
ON public.preset_sets FOR UPDATE
USING (public.is_admin_check());

-- Admins can delete preset sets
CREATE POLICY "preset_sets_admin_delete"
ON public.preset_sets FOR DELETE
USING (public.is_admin_check());

-- ============================================================
-- STEP 15: CREATE POLICIES FOR admin_access_logs
-- ============================================================
ALTER TABLE public.admin_access_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read logs
CREATE POLICY "admin_logs_select"
ON public.admin_access_logs FOR SELECT
USING (public.is_admin_check());

-- Admins can insert logs
CREATE POLICY "admin_logs_insert"
ON public.admin_access_logs FOR INSERT
WITH CHECK (public.is_admin_check());

-- ============================================================
-- STEP 16: CREATE POLICIES FOR feeding_schedule_items
-- ============================================================
ALTER TABLE public.feeding_schedule_items ENABLE ROW LEVEL SECURITY;

-- Anyone can read schedule items (public data)
CREATE POLICY "schedule_items_public_read"
ON public.feeding_schedule_items FOR SELECT
USING (true);

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
-- VERIFICATION: Run this to check all policies
-- ============================================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

