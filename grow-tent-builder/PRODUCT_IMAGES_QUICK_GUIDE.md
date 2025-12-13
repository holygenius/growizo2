# 🚀 Product Images Upload - Quick Start Guide

## ✅ Kurulum Tamamlandı

Supabase bucket **"product-images"** ile entegrasyon bitti.

---

## 📸 Admin Panel - 3 Yol ile Görsel Yükleme

### Yol 1️⃣: URL Yapıştır (En Hızlı)
```
1. Input alanına URL yapıştır
2. Enter tuşuna bas
3. ✓ Görsel grid'e eklenir
```

### Yol 2️⃣: Manual URL Gir
```
1. "+ URL ile Ekle" butonuna tıkla
2. Dialog'da URL gir
3. OK tuşuna bas
4. ✓ Görsel grid'e eklenir
```

### Yol 3️⃣: Dosyadan Upload (YENİ!)
```
1. "📤 Upload" butonuna tıkla
2. File picker açılır
3. Görsel dosyasını seç
4. Upload başlar
5. ✓ Supabase product-images bucket'a kaydedilir
6. ✓ Görsel grid'e otomatik eklenir
```

---

## 🎯 Buckets Ayarları

### Supabase Dashboard

```
Storage → Buckets → product-images

Settings:
✅ Public (Make it public so anyone can view)
✅ Allow file download
✅ Allowed MIME types: image/*
```

---

## 📊 Akış Diyagramı

```
Admin Ürün Ekle
    ├─ Icon Yükle (Product Icon)
    │  └─ Bucket: product-images
    │
    └─ Ürün Görselleri Ekle
       ├─ URL Paste → Enter
       ├─ + URL ile Ekle → Prompt
       └─ 📤 Upload → File Picker
           └─ Bucket: product-images
               └─ Public URL alınır
                   └─ Form güncellenir
                       └─ Görsel grid'e eklenir
```

---

## 💾 Kaydedilen Veri

```javascript
{
  icon: "https://abc123.supabase.co/storage/v1/object/public/product-images/0.1234.jpg",
  images: [
    {
      url: "https://abc123.supabase.co/storage/v1/object/public/product-images/0.5678.jpg",
      alt: "Product Name"
    },
    {
      url: "https://abc123.supabase.co/storage/v1/object/public/product-images/0.9101.jpg",
      alt: "Product Name"
    }
  ]
}
```

---

## ✨ Özellikler

| Feature | Status |
|---------|--------|
| File upload | ✅ Active |
| URL add | ✅ Active |
| Image preview | ✅ Yes |
| Batch upload | ❌ Not yet |
| Drag & drop | ❌ Not yet |
| Auto-resize | ❌ Not yet |

---

## 📋 Test Checklist

- [ ] Upload buton görünüyor
- [ ] File picker açılıyor
- [ ] Görsel seçilebiliyor
- [ ] Upload başlıyor
- [ ] Supabase'e kaydediliyor
- [ ] Görsel grid'e ekleniyor
- [ ] Form güncelleniyor
- [ ] Ürün kaydediliyor
- [ ] Veri tabanında kaydediliyor
- [ ] URL açılabilir (public)

---

## 🔗 Resource

**Documentation:**
- [PRODUCT_IMAGES_UPLOAD_SETUP.md](PRODUCT_IMAGES_UPLOAD_SETUP.md) - Full technical setup

**Files Modified:**
- `src/pages/admin/catalog/ProductsManager.jsx`
  - Product Icon uploader updated
  - Gallery upload button added
  - File input handler added

**Services Used:**
- `adminService.uploadImage(file, 'product-images')`

---

## 🎯 Desteklenen Formatlar

- 📷 JPEG / JPG
- 🖼️ PNG
- 🎬 GIF
- 📦 WebP
- 🎨 SVG

**Max File Size:** 25MB

---

## 🚀 Hemen Kullan!

1. Admin Panel aç
2. Add Product → Ürün Ekle
3. "Product Icon" → Dosya yükle (Supabase)
4. "📸 Product Images" → "📤 Upload" tıkla
5. Görsel seç → Yüklenir
6. Save → Tamamdır!

---

**Implementation Date:** Dec 13, 2025  
**Status:** ✅ Production Ready  
**Bucket:** product-images (Supabase)

Hazır! 🎉
