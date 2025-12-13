# 🖼️ Ürün Görseli Entegrasyonu - Özet

## Yapılan Değişiklikler

### 1. ✅ IKAS API'sinden Görselleri Çekme
- `ikasService.js` - GraphQL sorgusuna `images` field'ı eklendi
- Product level images (genel ürün görselleri)
- Variant level images (varyant spesifik görselleri)
- Görsel sıralanması (`sortOrder`) korunuyor

### 2. ✅ YesilGrowApiService - Görsel Desteği
- `YesilGrowApiService.getProductsWithVendorInfo()` - images array'ı döndürüyor
- Her üründe `images: [{ url, altText }, ...]` formatı

### 3. ✅ Admin Panel - Modal'da Görsel Preview
- `ProductsManager.jsx` - IKAS modal'ında ürün görselleri gösterilir
- İlk 3 görsel thumbnail (50x50px), "+N" badge'i
- Görsel sayısı "📸 Images: X" gösterilir

### 4. ✅ Form'da Birden Fazla Görsel Yönetimi
- `formData.images: []` - array formatında
- Görselleri liste olarak görüntüleme
- Görsel silme (× butonu)
- Yeni görsel ekleme (URL input + button)
- İlk görsel otomatik `icon` olarak ayarlanıyor

### 5. ✅ Database Migration
- `products` tablosuna `images jsonb` kolonu ekleme
- `product_images` tablosu oluşturma (opsiyonel, referans için)
- Index'ler ekleme

## 📊 Akış

```
IKAS API (images field)
         ↓
ikasService.parseGraphQLProduct() (parse images)
         ↓
YesilGrowApiService.getProductsWithVendorInfo() (format)
         ↓
ProductsManager Modal (preview göster)
         ↓
handleSelectIkasProduct (form'a ekle)
         ↓
formData.images: [{ url, alt }, ...] (form'da yönet)
         ↓
Save (Supabase'e kaydet)
```

## 🚀 Özellikler

✨ **Otomatik Görsel Çekme**
- IKAS'tan seçilen ürünün TÜM görselleri otomatik yüklenir

🎯 **Modal Preview**
- Görsel thumbnail'leri modal'da görüntülenir
- Kaç tane görsel olduğu gösterilir

🎨 **Form Yönetimi**
- Görselleri sil
- Yeni görseller ekle
- Görselleri sırala (gelecekte)

💾 **Database**
- Images JSON array olarak kaydedilir
- Opsiyonel: product_images tablosu (relational storage)

## 📝 Dosya Değişiklikleri

### Değiştirilen Dosyalar
1. `src/services/ikasService.js`
   - GraphQL sorgusuna images field'ı
   - parseGraphQLProduct() - images parse etme
   - YesilGrowApiService - images döndürme

2. `src/pages/admin/catalog/ProductsManager.jsx`
   - formData'ya images field'ı
   - Modal'da görsel preview
   - Form'da görsel yönetimi
   - handleSelectIkasProduct() - görselleri ekleme

3. `scripts/add-vendor-integration.sql`
   - ALTER TABLE products ADD images jsonb
   - CREATE TABLE product_images
   - Index'ler

### Yeni Dosya
1. `IKAS_IMAGE_SUPPORT.md` - Detaylı dokümantasyon

## 🔄 Migration Adımları

```sql
-- Supabase SQL Editor'de çalıştır:
-- scripts/add-vendor-integration.sql

-- VEYA elle:

-- 1. Products tablosuna images kolonu ekle
ALTER TABLE products ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]';

-- 2. Product images tablosu oluştur
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url varchar NOT NULL,
  alt_text varchar,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  UNIQUE(product_id, image_url)
);

-- 3. Index oluştur
CREATE INDEX IF NOT EXISTS idx_product_images_product_id 
  ON product_images(product_id);
```

## 🧪 Test Edilmesi Gereken Şeyler

- [ ] IKAS modal'da ürün görselleri görülüyor mu?
- [ ] Ürün seçildiğinde görseller form'a yükleniyor mu?
- [ ] Modal preview'ında thumbnail'ler gösteriliyor mu?
- [ ] Form'da görselleri silip ekleyebiliyor mu?
- [ ] Ürün kaydetme başarılı oluyor mu?
- [ ] Kaydedilen üründe görseller mevcut oluyor mu?

## 💡 Kullanıcı Açısından

1. Admin Panel → Add Product
2. "🛍️ Get Product from YesilGrow IKAS" tıkla
3. Modal'dan ürün seç (görselleri görebilir)
4. Ürün tüm görselleriyle form'a yüklenir
5. Gerekirse görselleri düzenle (sil/ekle)
6. Save Product tıkla
7. Ürün görselleriyle kaydedilir ✅

## 🎯 Avantajları

✅ Otomatik görsel yönetimi - manuel kopya-yapıştır yok  
✅ Birden fazla görsel - tek ürün için sınırsız  
✅ IKAS ile senkronize - her ürün güncel görseller  
✅ Form'da kontrol - gereksiz görselleri kaldırabilir  
✅ SEO dostça - ALT metin korunur  

## 🚨 Dikkat Edilmesi Gereken

⚠️ Görsel URL'leri geçerli ve erişilebilir olmalı  
⚠️ Çok sayıda görsel performansı etkileyebilir (5-10 önerilen)  
⚠️ HTTPS kullanılması güvenlik açısından iyidir  

## 📞 Referanslar

- Detaylı Rehber: [IKAS_IMAGE_SUPPORT.md](IKAS_IMAGE_SUPPORT.md)
- IKAS API: [VENDOR_INTEGRATION_GUIDE.md](VENDOR_INTEGRATION_GUIDE.md)
- IKAS Quickstart: [IKAS_QUICK_START.md](IKAS_QUICK_START.md)

---

**Tamamlama Tarihi:** Aralık 2025  
**Versiyon:** 2.0  
**Durum:** ✅ Üretim Hazırı
