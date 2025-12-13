# Storage RLS Policy Fix - Görsel Yükleme Sorunu Çözümü

## Problem
Görsel yüklerken hata alıyorsunuz: `StorageApiError: new row violates row-level security policy`

## Çözüm

Supabase'de `product-images` bucket'ına erişim izni vermek için aşağıdaki adımları yapın:

### 1. Supabase Console'a gidin
- https://app.supabase.com adresine gidin
- Projenizi açın
- Sol menüden **SQL Editor** seçin

### 2. SQL Script'i çalıştırın
`scripts/fix-storage-rls.sql` dosyasındaki SQL'i Supabase SQL Editor'a kopyalayın ve çalıştırın.

Veya aşağıdaki komutu direkt çalıştırabilirsiniz:

```sql
-- Fix Supabase Storage RLS Policies for product-images bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update product images" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated users to delete product images" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update product images" 
ON storage.objects FOR UPDATE 
WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
```

### 3. Doğrulama
SQL başarıyla çalıştıktan sonra:
- Supabase Console'da **Storage** seçin
- `product-images` bucket'ını bulun
- **Policies** sekmesinde 4 policy'in oluştuğunu görün:
  - Allow authenticated users to upload product images
  - Allow public read access to product images
  - Allow authenticated users to delete product images
  - Allow authenticated users to update product images

### 4. Uygulama
Şimdi görsel yüklemeyi tekrar deneyin. Hata çözülmüş olmalı.

## Alternatif: Disabledlemek (Geliştirme Ortamı için)

Eğer geliştirme ortamındaysanız ve RLS policy'lerine takılıyorsanız, geçici olarak devre dışı bırakabilirsiniz:

```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

⚠️ **UYARI**: Production ortamında RLS'i devre dışı bırakmayın!
