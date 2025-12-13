/**
 * SQL Migration: Add vendor pricing and integration tables
 * 
 * Creates tables to store vendor-specific product data and pricing
 * Supports future integration with multiple vendors (YesilGrow, etc.)
 */

-- Create vendors table to track available vendors
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE,
  vendor_code character varying NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vendors_pkey PRIMARY KEY (id)
);

-- Create vendor_products table to map external vendor products
CREATE TABLE IF NOT EXISTS public.vendor_products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  vendor_product_id character varying NOT NULL,
  vendor_sku character varying,
  vendor_name character varying,
  barcode character varying,
  is_matched boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vendor_products_pkey PRIMARY KEY (id),
  CONSTRAINT vendor_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT vendor_products_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE,
  UNIQUE (vendor_id, vendor_product_id)
);

-- Create vendor_prices table to store pricing and stock information
CREATE TABLE IF NOT EXISTS public.vendor_prices (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  vendor_product_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  price decimal(10, 2) NOT NULL,
  currency character varying DEFAULT 'TRY'::character varying,
  stock_quantity integer DEFAULT 0,
  stock_location character varying,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vendor_prices_pkey PRIMARY KEY (id),
  CONSTRAINT vendor_prices_vendor_product_id_fkey FOREIGN KEY (vendor_product_id) REFERENCES public.vendor_products(id) ON DELETE CASCADE,
  CONSTRAINT vendor_prices_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE
);

-- Create vendor_import_logs table to track import history
CREATE TABLE IF NOT EXISTS public.vendor_import_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  vendor_id uuid NOT NULL,
  total_products integer,
  matched_products integer,
  new_products integer,
  errors integer,
  error_details jsonb,
  imported_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vendor_import_logs_pkey PRIMARY KEY (id),
  CONSTRAINT vendor_import_logs_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vendor_products_product_id ON public.vendor_products(product_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_id ON public.vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_product_id ON public.vendor_products(vendor_product_id);
CREATE INDEX IF NOT EXISTS idx_vendor_prices_vendor_product_id ON public.vendor_prices(vendor_product_id);
CREATE INDEX IF NOT EXISTS idx_vendor_prices_vendor_id ON public.vendor_prices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_import_logs_vendor_id ON public.vendor_import_logs(vendor_id);

-- Add summary_description column to products table for short descriptions
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS summary_description jsonb DEFAULT '{}'::jsonb;

-- Add images column to products table if it doesn't exist
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- Create product_images table for managing multiple images per product
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL,
  image_url character varying NOT NULL,
  alt_text character varying,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT product_images_unique_url UNIQUE (product_id, image_url)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON public.product_images(product_id, is_primary);

-- Insert YesilGrow vendor
INSERT INTO public.vendors (name, vendor_code, description, is_active)
VALUES (
  'YesilGrow',
  'yesilgrow',
  'YesilGrow - Grow tent supplies vendor integrated via IKAS API',
  true
)
ON CONFLICT (vendor_code) DO NOTHING;
