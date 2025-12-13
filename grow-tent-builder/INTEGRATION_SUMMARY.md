# 🛍️ IKAS Vendor Integration - Ürün Entegrasyon Sistemi

## 📝 Özet

Bu projede **IKAS altyapısı** üzerinden YesilGrow satıcısının ürünleri sisteminize entegre edilmiştir. Sistem, ürün seçimi, eşleştirme, fiyat saklama ve karşılaştırma özelliklerine sahiptir.

### ✨ Temel Özellikler

- ✅ **IKAS API Entegrasyonu** - YesilGrow'dan ürün çekme (GraphQL)
- ✅ **Ürün Eşleştirme** - SKU/barkod ile otomatik eşleştirme
- ✅ **Fiyat Yönetimi** - Satıcı fiyatlarını saklama ve takip
- ✅ **Admin Arayüzü** - Ürünleri filtreleme ve seçme
- ✅ **Fiyat Karşılaştırması** - En ucuz satıcıyı bulma
- ✅ **İçeri Aktarma Günlüğü** - Tüm işlemleri kaydetme
- 🔜 **Multi-Vendor Destek** - Gelecekte daha fazla satıcı eklenebilir

## 🏗️ Sistem Mimarisi

```
┌─────────────────────────────────────────┐
│      Admin Product Import UI            │
│   (AdminProductImport.jsx)              │
└──────────────┬──────────────────────────┘
               │
     ┌─────────┴─────────┐
     ▼                   ▼
┌─────────────────┐ ┌──────────────┐
│  IKAS Service   │ │ Import       │
│ (ikasService)   │ │ Service      │
└────────┬────────┘ │(importService)
         │          └──────┬───────┘
         │                 │
    ┌────┴─────────────────┴────┐
    ▼                           ▼
┌─────────────────────┐  ┌──────────────────┐
│  IKAS API           │  │  Product Service │
│ (YesilGrow)         │  │ (productService) │
└────────┬────────────┘  └────────┬─────────┘
         │                        │
         └────────────┬───────────┘
                      ▼
            ┌──────────────────────┐
            │   Supabase Database  │
            │  (Vendor Tables)     │
            └──────────────────────┘
```

## 📁 Dosya Yapısı

```
grow-tent-builder/
├── src/
│   └── services/
│       ├── ikasService.js                    # IKAS API Servisi
│       ├── importService.js                  # İçeri Aktarma Servisi
│       ├── productService.js                 # Güncellenmiş (vendor methods)
│       └── ikasIntegrationExamples.js        # Kullanım Örnekleri
│   └── components/
│       └── Admin/
│           ├── AdminProductImport.jsx        # Admin UI Bileşeni
│           └── AdminProductImport.module.css # Stiller
├── scripts/
│   └── add-vendor-integration.sql            # DB Migrasyonu
├── VENDOR_INTEGRATION_GUIDE.md               # Detaylı Rehber
├── IKAS_QUICK_START.md                       # Hızlı Başlangıç
└── INTEGRATION_SUMMARY.md                    # Bu Dosya
```

## 🚀 Hızlı Başlangıç

### 1. Veritabanını Kur

```bash
# Supabase SQL Editor'de çalıştır
scripts/add-vendor-integration.sql
```

**Oluşturulan tablolar:**
- `vendors` - Satıcı bilgileri
- `vendor_products` - Satıcı ürünleri ve eşleştirmeler
- `vendor_prices` - Ürün fiyatları ve stok
- `vendor_import_logs` - İşlem geçmişi

### 2. Admin Panele Ekle

```jsx
// src/pages/AdminPanel.jsx veya benzer dosya

import AdminProductImport from '@/components/Admin/AdminProductImport';

export function AdminPanel() {
  return (
    <div>
      <AdminProductImport />
    </div>
  );
}
```

### 3. Ürün Sayfasında Göster

```jsx
import { productService } from '@/services/productService';

const vendorPrices = await productService.getAllVendorPrices(productId);
```

## 💻 API Referans

### IKAS Service

```javascript
import { YesilGrowApiService } from '@/services/ikasService';

const yesilgrow = new YesilGrowApiService();

// Ürünleri çek
const products = await yesilgrow.getAllProducts();

// Satıcı bilgileri ile çek
const productsWithVendor = await yesilgrow.getProductsWithVendorInfo();
```

### Import Service

```javascript
import { importService } from '@/services/importService';

// Ürünleri içeri aktar
await importService.importVendorProducts(
  'yesilgrow',        // vendor code
  'YesilGrow',        // vendor name
  productsArray,      // vendor products
  'description'       // optional
);

// Eşleşmemiş ürünleri getir
const unmatched = await importService.getUnmatchedProducts('yesilgrow');

// Manuel eşleştir
await importService.matchVendorProduct(vendorProductId, internalProductId);

// Fiyat güncelle
await importService.updateVendorPrice(vendorProductId, price, stock);
```

### Product Service (Yeni Metodlar)

```javascript
import { productService } from '@/services/productService';

// Ürünü satıcı bilgileri ile getir
const product = await productService.getProductWithVendors(productId);

// Tüm satıcı fiyatlarını getir
const prices = await productService.getAllVendorPrices(productId);

// En ucuz fiyatı getir
const cheapest = await productService.getCheapestVendorPrice(productId);

// Tipe göre satıcı bilgileri ile getir
const products = await productService.getProductsByTypeWithVendors('light');

// Fiyat karşılaştırması (multiple products)
const comparison = await productService.getVendorPriceComparison([id1, id2, id3]);
```

## 📊 Veri Modeli

### Vendor
```javascript
{
  id: UUID,
  name: 'YesilGrow',
  vendor_code: 'yesilgrow',
  description: string,
  is_active: boolean
}
```

### Vendor Product
```javascript
{
  id: UUID,
  product_id: UUID,           // İç ürün
  vendor_id: UUID,            // Satıcı
  vendor_product_id: string,  // Satıcıdaki ürün ID
  vendor_sku: string,
  vendor_name: string,
  barcode: string,
  is_matched: boolean,        // Eşleştirildi mi?
  is_active: boolean
}
```

### Vendor Price
```javascript
{
  id: UUID,
  vendor_product_id: UUID,
  vendor_id: UUID,
  price: decimal,             // Fiyat
  currency: string,           // Para birimi (TRY)
  stock_quantity: integer,    // Stok
  stock_location: string,     // Depo bilgisi
  last_updated: timestamp
}
```

## 🔄 İş Akışı Örnekleri

### Örnek 1: Ürün İçeri Aktarma

```javascript
// 1. YesilGrow'dan ürünleri çek
const yesilgrow = new YesilGrowApiService();
const products = await yesilgrow.getProductsWithVendorInfo();

// 2. Filtrele (opsiyonel)
const filtered = products.filter(p => p.price < 1000);

// 3. İçeri aktar
const result = await importService.importVendorProducts(
  'yesilgrow',
  'YesilGrow',
  filtered
);

// result:
// {
//   totalProducts: 150,
//   matchedProducts: 120,
//   newVendorProducts: 0,
//   skippedProducts: 30,
//   errors: [],
//   importedProductIds: [...]
// }
```

### Örnek 2: Ürün Sayfasında En Ucuz Fiyatı Göster

```javascript
// Component içinde
const { data: product } = useAsync(() => 
  productService.getProductWithVendors(productId)
);

const { data: cheapest } = useAsync(() =>
  productService.getCheapestVendorPrice(productId)
);

// Render
<div>
  <h1>{product.name}</h1>
  <p>Kendi Fiyat: {product.price}₺</p>
  
  {cheapest && (
    <div className="vendor-price">
      <p>{cheapest.vendors.name}: {cheapest.price}₺</p>
      <p>Tasarruf: {product.price - cheapest.price}₺</p>
    </div>
  )}
</div>
```

### Örnek 3: Eşleşmemiş Ürünleri Bulma

```javascript
// Eşleşmemiş ürünleri getir
const unmatched = await importService.getUnmatchedProducts('yesilgrow');

// Her biri için arama yap ve eşleştir
for (const vendorProduct of unmatched) {
  const matching = await productService.getProductBySku(vendorProduct.vendor_sku);
  
  if (matching) {
    await importService.matchVendorProduct(
      vendorProduct.id,
      matching.id
    );
  }
}
```

## 🔐 Güvenlik

### OAuth2 Client Credentials Flow

```
POST https://yesilgrow.myikas.com/api/admin/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
client_id=XXXX
client_secret=XXXX
```

**Token Yönetimi:**
- Token otomatik olarak yenilenir
- 60 saniye buffer ile yenilenme tetiklenir
- Token başarısız olursa yeniden kimlik doğru yapılır

### Supabase RLS

Veritabanı tabloları RLS ile korunmalıdır:
- Admin sadece veri ekleyebilir
- Kullanıcılar sadece okumalı erişime sahip

## 🛠️ Hata Giderme

### "Authentication failed" Hatası
```
❌ Sebep: Client ID/Secret yanlış
✅ Çözüm: Credentials doğru mu kontrol et
```

### "No matching product found"
```
❌ Sebep: SKU sisteme yok
✅ Çözüm: Manuel eşleştir veya yeni ürün ekle
```

### GraphQL Query Hatası
```
❌ Sebep: API şeması değişti
✅ Çözüm: IKAS docs'unu kontrol et
```

### RLS Permission Denied
```
❌ Sebep: User policy eksik
✅ Çözüm: Supabase RLS kurallarını kontrol et
```

## 📈 Gelecek Geliştirmeler

### Faz 2: Multi-Vendor
- [ ] Yeni satıcı ekle
- [ ] Satıcı yönetim UI
- [ ] Satıcı bazlı filtreleme

### Faz 3: Otomatik Senkronizasyon
- [ ] Periyodik fiyat güncelleme (cron)
- [ ] Stok senkronizasyonu
- [ ] Fiyat değişim alertleri

### Faz 4: Stok Yönetimi
- [ ] Stok uyarıları
- [ ] Minimum stok limitleri
- [ ] Otomatik sipariş sistemi

### Faz 5: Raporlama
- [ ] Satıcı karşılaştırması
- [ ] Tasarruf raporu
- [ ] Fiyat trendleri

## 📚 Kaynaklar

1. **Hızlı Başlangıç**: [IKAS_QUICK_START.md](IKAS_QUICK_START.md)
2. **Detaylı Rehber**: [VENDOR_INTEGRATION_GUIDE.md](VENDOR_INTEGRATION_GUIDE.md)
3. **Kod Örnekleri**: `src/services/ikasIntegrationExamples.js`
4. **İlk Entegrasyon**: [ikas-integration.md](ikas-integration.md)
5. **IKAS Docs**: https://developer.myikas.com

## 🤝 Katkı

Bu sistem ileride şu şekilde genişletilecektir:
1. Yeni satıcılar ekleme (diğer IKAS altyapıları)
2. Fiyat karşılaştırması engine
3. Otomatik senkronizasyon
4. Gelişmiş raporlama

## 📞 Destek

Sorular veya sorunlar için:
1. Console logs'unu kontrol et
2. Supabase dashboard'da tabloları kontrol et
3. IKAS API response'unu network tab'da kontrol et

---

**Versiyon:** 1.0  
**Son Güncelleme:** Aralık 2025  
**Durum:** ✅ Production Ready

