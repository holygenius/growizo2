# 🎯 Admin Entegrasyon Rehberi - YesilGrow/IKAS Ürün Seçimi

Bu rehber, admin panelinden ürün eklerken IKAS ürünlerinin nasıl seçileceğini ve kullanılacağını açıklar.

## 🎯 Yeni Ürün Ekleme Akışı

### Admin Panel'de Yeni Ürün Ekle

1. **Admin Dashboard** → **Products Manager** → **Add Product** tıkla
2. Açılan formda **"🛍️ Get Product from YesilGrow IKAS"** düğmesine tıkla
3. Modal açılır ve **"Fetch YesilGrow Products"** butonuna tıkla
4. YesilGrow'dan ürünler çekilir (ilk kez biraz bekleyebilir)

### Ürün Seçme

1. **Arama** kutusuna ürün adı, SKU veya barcode gir
   - Örn: "Grow Tent", "SKU-001", veya barcode
2. Listeden istediğin ürünü tıkla
3. Seçilen ürünün bilgileri otomatik olarak doldurulur:
   - ✅ SKU
   - ✅ Ürün Adı (EN/TR)
   - ✅ Fiyat
   - ✅ Barcode (Specifications'da)
   - ✅ Vendor ID (Specifications'da)

### Form Tamamlama

1. IKAS ürünü seçildikten sonra form şu bilgileri otomatik doldurur:
   ```
   SKU: IKAS SKU (örn: "PRO-002")
   Name: Ürün adı
   Price: IKAS fiyatı
   Specs → barcode: Barkod numarası
   Specs → vendor_id: Satıcı ürün ID
   Specs → vendor_sku: Satıcı SKU
   ```

2. **Kalan alanları doldur:**
   - Brand: Marka seç
   - Category: Kategori seç
   - Product Type: Ürün tipi seç (Tent, Light, Fan, etc.)
   - Specifications: Ek özellikler ekle (watts, dimensions, etc.)
   - Description: Ürün açıklaması (isteğe bağlı)

3. **Save Product** butonuna tıkla

### 📊 Doldurulacak Alanlar

```
┌─────────────────────────────────────┐
│ Form Fields                         │
├─────────────────────────────────────┤
│ ✅ SKU (IKAS'tan)                   │
│ ✅ Name EN/TR (IKAS'tan)            │
│ ✅ Price (IKAS'tan)                 │
│ ✅ Barcode (Specs'a)                │
│ ⚙️ Brand (Manuel)                   │
│ ⚙️ Category (Manuel)                │
│ ⚙️ Product Type (Manuel)            │
│ ⚙️ Description (Manuel)             │
│ ⚙️ Specifications (Manuel)          │
│ ⚙️ Icons/Images (Manuel)            │
│ ⚙️ Featured/Active (Manuel)         │
└─────────────────────────────────────┘
```

## 🔍 Arama Örnekleri

**Örnek 1: İsimle Ara**
```
Ara: "Grow Tent"
Sonuç: Tüm Grow Tent ürünleri gösterilir
```

**Örnek 2: SKU'yla Ara**
```
Ara: "PRO-001"
Sonuç: SKU'su PRO-001 olan ürün gösterilir
```

**Örnek 3: Barkodla Ara**
```
Ara: "123456789"
Sonuç: Barkodu 123456789 olan ürün gösterilir
```

## 💾 Kaydedilen Veri

Ürün kaydedildiğinde sistem şu işlemleri yapar:

1. **Ürün Oluştur** (products tablosu)
   - SKU, isim, fiyat, tür, kategori, marka

2. **Vendor Ürünü Oluştur** (vendor_products tablosu)
   - Sistem ürünü IKAS ürünü ile linkle

3. **Fiyat Sakla** (vendor_prices tablosu)
   - IKAS fiyatını ve stok bilgisini sakla

## 🔗 Backend Akışı

```
Admin Form Gönder
    ↓
ProductForm onSubmit
    ↓
adminService.create('products', formData)
    ↓
Supabase: products tablosuna ekle
    ↓
Veritabanına Kaydedildi
    ↓
vendor_products tablosuna otomatik ekle (importService)
    ↓
vendor_prices tablosuna otomatik ekle (importService)
    ↓
✅ Tamamlandı
```

## 🎨 UI Elemanları

### IKAS Selector Modal

```
┌─────────────────────────────────────┐
│ 🛍️ Select Product from YesilGrow  X │
├─────────────────────────────────────┤
│ [Search box]                        │
├─────────────────────────────────────┤
│ Product 1                           │
│ SKU: PRO-001                        │
│ Barcode: 123456789                  │
│ 💰 Price: 599₺ | Stock: 45          │
├─────────────────────────────────────┤
│ Product 2                           │
│ SKU: PRO-002                        │
│ Barcode: 987654321                  │
│ 💰 Price: 799₺ | Stock: 30          │
└─────────────────────────────────────┘
```

### Seçim Onayı

```
┌─────────────────────────────────────┐
│ ✅ Selected from IKAS: Grow Tent 2x2│
└─────────────────────────────────────┘
```

## ⚙️ Teknik Detaylar

### IKAS Servisi Entegrasyonu

```javascript
import { YesilGrowApiService } from '@/services/ikasService';

const yesilgrow = new YesilGrowApiService();
const products = await yesilgrow.getProductsWithVendorInfo();
```

### Otomatik Alan Doldurma

```javascript
const handleSelectIkasProduct = (product) => {
    setFormData({
        ...formData,
        sku: product.sku,              // IKAS SKU
        price: product.price,          // IKAS Fiyat
        name: {
            en: product.name,          // Ürün Adı
            tr: product.name
        },
        specs: {
            ...formData.specs,
            barcode: product.barcode,  // Barkod
            vendor_id: product.vendorProductId,  // Vendor ID
            vendor_sku: product.sku
        }
    });
};
```

## 🚨 Önemli Notlar

1. **SKU Benzersiz Olmalı**
   - IKAS'ta farklı SKU'lar benzersiz olmalı
   - Aynı SKU ile yeni ürün eklenemez

2. **Fiyat Senkronizasyonu**
   - IKAS fiyatı ürün oluşturma sırasında kaydedilir
   - Sonradan import servisi ile güncellenebilir

3. **Eşleştirme**
   - Sistem otomatik olarak IKAS ürünü ile linkler
   - vendor_products tablosuna kaydedilir

4. **Manuel Düzenleme**
   - Kaydedildikten sonra her alanı manuel düzenleyebilirsin
   - IKAS bilgileri specs'a kaydedilir

## 📱 Responsiveness

- ✅ Desktop tam destekli
- ✅ Tablet destekli
- ✅ Mobil: Modal 90% width
- ✅ Scroll: Max height 80vh

## 🔐 Permissions

- Sadece admin kullanıcılar ürün ekleyebilir
- IKAS API kimlik doğrulaması otomatik
- Supabase RLS kuralları uygulanır

## 📞 Troubleshooting

### "Cannot fetch IKAS products" hatası
```
❌ Sebep: IKAS API bağlantısı başarısız
✅ Çözüm: 
  - Network bağlantısını kontrol et
  - IKAS kimlik bilgilerini kontrol et
  - Console'da hata mesajını oku
```

### Modal açılmıyor
```
❌ Sebep: Z-index conflict
✅ Çözüm: Tarayıcıyı yenile (F5)
```

### Ürün seçilmiyor
```
❌ Sebep: Form validation
✅ Çözüm: Gerekli alanları kontrol et (SKU, Name)
```

---

**Son Güncelleme:** Aralık 2025  
**Entegrasyon:** ProductsManager.jsx  
**Servis:** ikasService.js + importService.js
