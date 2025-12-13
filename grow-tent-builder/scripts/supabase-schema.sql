-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admin_access_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  admin_id uuid,
  admin_email character varying,
  action character varying NOT NULL,
  ip_address character varying,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_access_logs_pkey PRIMARY KEY (id),
  CONSTRAINT admin_access_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id)
);
CREATE TABLE public.admin_users (
  id uuid NOT NULL,
  email character varying NOT NULL,
  role character varying DEFAULT 'editor'::character varying,
  display_name character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id),
  CONSTRAINT admin_users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slug jsonb NOT NULL,
  title jsonb NOT NULL,
  excerpt jsonb DEFAULT '{}'::jsonb,
  content jsonb NOT NULL,
  category character varying,
  author character varying,
  tags ARRAY DEFAULT '{}'::text[],
  image_url text,
  quiz jsonb,
  is_published boolean DEFAULT false,
  published_at timestamp with time zone,
  meta_title jsonb DEFAULT '{}'::jsonb,
  meta_description jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  logo_url text,
  icon character varying,
  color character varying,
  description jsonb DEFAULT '{}'::jsonb,
  website_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT brands_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key character varying NOT NULL UNIQUE,
  name jsonb NOT NULL,
  icon character varying,
  parent_category_id uuid,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.feeding_schedule_products (
  id character varying NOT NULL,
  product_name character varying NOT NULL,
  category character varying NOT NULL,
  dose_unit character varying DEFAULT 'ml/L'::character varying,
  schedule_allmix jsonb DEFAULT '{}'::jsonb,
  schedule_lightmix_coco jsonb DEFAULT '{}'::jsonb,
  icon character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT feeding_schedule_products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.feeding_schedules (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  brand_id uuid,
  name jsonb NOT NULL,
  substrate_type character varying NOT NULL,
  schedule_data jsonb NOT NULL,
  phases jsonb DEFAULT '{}'::jsonb,
  notes jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT feeding_schedules_pkey PRIMARY KEY (id),
  CONSTRAINT feeding_schedules_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);
CREATE TABLE public.preset_sets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name jsonb NOT NULL,
  description jsonb DEFAULT '{}'::jsonb,
  tier character varying DEFAULT 'standard'::character varying,
  products jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_price integer DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  tent_size character varying,
  media_type character varying,
  nutrient_brand character varying,
  plant_count integer DEFAULT 0,
  items jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT preset_sets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  sku character varying(255) NOT NULL UNIQUE,
  brand_id uuid,
  category_id uuid,
  name jsonb NOT NULL,
  description jsonb DEFAULT '{}'::jsonb,
  summary_description jsonb DEFAULT '{}'::jsonb,
  function_detailed jsonb DEFAULT '{}'::jsonb,
  key_properties jsonb DEFAULT '{}'::jsonb,
  price integer DEFAULT 0,
  available_packaging ARRAY DEFAULT '{}'::text[],
  specs jsonb DEFAULT '{}'::jsonb,
  compatible_media ARRAY DEFAULT ARRAY['soil'::text, 'coco'::text, 'hydro'::text],
  images ARRAY DEFAULT '{}'::text[],
  icon character varying,
  product_type character varying DEFAULT 'general'::character varying,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.user_builds (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  session_id character varying,
  tent_size jsonb DEFAULT '{}'::jsonb,
  media_type character varying,
  selected_items jsonb DEFAULT '{}'::jsonb,
  total_cost integer DEFAULT 0,
  total_power integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid,
  name character varying,
  CONSTRAINT user_builds_pkey PRIMARY KEY (id),
  CONSTRAINT user_builds_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email character varying NOT NULL,
  full_name character varying,
  avatar_url text,
  provider character varying,
  preferred_language character varying DEFAULT 'tr'::character varying,
  saved_builds ARRAY DEFAULT '{}'::uuid[],
  builds_created integer DEFAULT 0,
  last_build_at timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_sign_in_at timestamp with time zone DEFAULT now(),
  onboarding_completed boolean DEFAULT false,
  onboarding_data jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);