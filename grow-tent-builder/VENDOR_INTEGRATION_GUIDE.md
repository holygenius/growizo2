# IKAS Entegrasyonu - Uygulama Kılavuzu

## 📋 Genel Bakış

Bu dokümantasyon, YesilGrow (IKAS API) ile ürün entegrasyonunun sitede nasıl uygulandığını açıklamaktadır.

### Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel                              │
│          (AdminProductImport.jsx)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌─────────┐   ┌──────────┐   ┌──────────┐
   │IKAS API │   │  Import  │   │ Product  │
   │ Service │   │ Service  │   │ Service  │
   └──────────┘   └──────────┘   └──────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
   ┌──────────────────┐      ┌────────────────┐
   │ IKAS / YesilGrow │      │   Supabase DB  │
   │      API         │      │    Tables      │
   └──────────────────┘      └────────────────┘
                                     │
                     ┌───────────────┼───────────────┐
                     ▼               ▼               ▼
                ┌─────────┐     ┌──────────┐  ┌──────────┐
                │vendors  │     │vendor_   │  │vendor_   │
                │         │     │products  │  │prices    │
                └─────────┘     └──────────┘  └──────────┘
```

## 🔧 Teknik Bileşenler

### 1. **ikasService.js** - IKAS API Servisi

Dosya: `src/services/ikasService.js`

#### Sınıflar:

- **IkasApiConfig**: API kimlik bilgileri ve token yönetimi
- **IkasApiService**: Genel IKAS API işlemleri
- **YesilGrowApiService**: YesilGrow'a özel servis

#### Ana Metodlar:

```javascript
// IKAS servisini başlat
const ikasService = new IkasApiService(clientId, clientSecret, baseUrl);

// Kimlik doğrulaması yap
await ikasService.authenticate();

// Tüm ürünleri getir (sayfalama ile)
const products = await ikasService.getAllProducts();

// GraphQL cevabını parse et
const product = ikasService.parseGraphQLProduct(productNode);
```

#### YesilGrow Servisi Kullanımı:

```javascript
import { YesilGrowApiService } from '@/services/ikasService';

const yesilgrow = new YesilGrowApiService();

// Ürünleri satıcı bilgileri ile getir
const productsWithVendor = await yesilgrow.getProductsWithVendorInfo();
```

### 2. **importService.js** - İçeri Aktarma Servisi

Dosya: `src/services/importService.js`

Ürünleri eşleştir, sakla ve yönet.

#### Ana Metodlar:

```javascript
// Satıcıya ait ürünleri içeri aktar
await importService.importVendorProducts(
    vendorCode,    // 'yesilgrow'
    vendorName,    // 'YesilGrow'
    vendorProducts,// Ürün dizisi
    description    // Açıklama
);

// Eşleşmemiş ürünleri getir (manuel eşleştirme için)
const unmatched = await importService.getUnmatchedProducts('yesilgrow');

// Satıcı ürünü ile iç ürünü eşleştir
await importService.matchVendorProduct(vendorProductId, productId);

// Fiyat ve stok güncelle
await importService.updateVendorPrice(vendorProductId, price, stock);
```

### 3. **AdminProductImport.jsx** - Admin Arayüzü

Dosya: `src/components/Admin/AdminProductImport.jsx`

Yöneticilerin IKAS'tan ürün çekmesi ve seçmesi için arayüz.

#### Özellikler:

- ✅ YesilGrow'dan ürün çek
- 🔍 Ürünleri isim, SKU, barkoda göre ara
- ☑️ Toplu seçim/deseçim
- 💾 Seçili ürünleri içeri aktar
- 📊 İçeri aktarma sonuçlarını göster

#### Kullanım:

```jsx
import AdminProductImport from '@/components/Admin/AdminProductImport';

<AdminProductImport />
```

### 4. **Veritabanı Tabloları**

Dosya: `scripts/add-vendor-integration.sql`

#### Tablolar:

**vendors**
```sql
- id (UUID)
- name (string) - Satıcı adı
- vendor_code (string) - Satıcı kodu (yesilgrow, etc.)
- description (text)
- is_active (boolean)
```

**vendor_products**
```sql
- id (UUID)
- product_id (FK -> products) - İç ürün ID
- vendor_id (FK -> vendors)
- vendor_product_id (string) - Satıcıdaki ürün ID
- vendor_sku (string)
- vendor_name (string)
- barcode (string)
- is_matched (boolean) - Eşleştirildi mi?
- is_active (boolean)
```

**vendor_prices**
```sql
- id (UUID)
- vendor_product_id (FK -> vendor_products)
- vendor_id (FK -> vendors)
- price (decimal)
- currency (string) - Para birimi (TRY, etc.)
- stock_quantity (integer)
- stock_location (string)
- last_updated (timestamp)
```

**vendor_import_logs**
```sql
- id (UUID)
- vendor_id (FK -> vendors)
- total_products (integer)
- matched_products (integer)
- new_products (integer)
- errors (integer)
- error_details (JSON)
- imported_at (timestamp)
```

## 🚀 Kurulum ve Kullanım

### 1. Veritabanı Migrasyonu

SQL migrasyonunu çalıştır:

```bash
# Supabase CLI ile
supabase db push scripts/add-vendor-integration.sql

# Veya Supabase SQL Editor'den direkt yapıştır
```

### 2. Admin Panele Ekleme

Mevcut admin bileşenine ekle:

```jsx
import AdminProductImport from '@/components/Admin/AdminProductImport';

// Admin panelinde kullan
<AdminProductImport />
```

### 3. İçeri Aktarma Akışı

```
1. Admin "Ürünleri Getir" butonuna tıkla
   ↓
2. YesilGrow'dan ürünler çekilir (IKAS API)
   ↓
3. Ürünler filtrelenebilir formatta gösterilir
   ↓
4. Admin seçili ürünleri seçer
   ↓
5. "İçeri Aktar" butonuna tıkla
   ↓
6. Sistem SKU/Barkoda göre eşleştirme yapar
   ↓
7. Fiyatlar ve satıcı bilgileri kaydedilir
   ↓
8. İçeri aktarma günlüğü tutulur
```

## 📊 Veri Akışı Örneği

### YesilGrow'dan Ürün Çekme:

```javascript
const yesilgrow = new YesilGrowApiService();
const products = await yesilgrow.getProductsWithVendorInfo();

// Dönen veri formatı:
{
    vendorId: 'yesilgrow',
    vendorName: 'YesilGrow',
    vendorProductId: 'prod_123',
    name: 'Premium Grow Tent 2x2',
    sku: 'SKU-001',
    barcode: '123456789',
    price: 599.99,
    stock: 45,
    brand: 'YesilGrow',
    slug: 'premium-grow-tent-2x2',
    originalData: {...}
}
```

### İçeri Aktarma Sonucu:

```javascript
{
    totalProducts: 150,
    matchedProducts: 120,
    newVendorProducts: 0,
    skippedProducts: 30,
    errors: [],
    importedProductIds: [...]
}
```

## 💡 Fiyat Karşılaştırması

### Ürün için Tüm Satıcı Fiyatlarını Getir:

```javascript
import { productService } from '@/services/productService';

const prices = await productService.getAllVendorPrices(productId);
// Döner: [{vendor: 'yesilgrow', price: 599.99}, ...]
```

### En Ucuz Satıcıyı Bulma:

```javascript
const cheapest = await productService.getCheapestVendorPrice(productId);
// Döner: {vendor: 'yesilgrow', price: 449.99, ...}
```

## 🔐 IKAS Kimlik Doğrulaması

### OAuth2 Client Credentials Flow:

```
POST https://yesilgrow.myikas.com/api/admin/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET
```

**Yapılırken:**
- Token süresi dolduğunda otomatik olarak yenilenir
- Token 60 saniye önceden yenileme tetiklenir

## 🛠️ Gelecek Geliştirmeler

### Faz 2: Multi-Vendor Destek

```javascript
// Yeni satıcı ekleme örneği
const newVendor = await importService.getOrCreateVendor(
    'anothervendor',
    'Another Vendor',
    'Description'
);

const anotherService = new IkasApiService(
    clientId,
    clientSecret,
    baseUrl
);
```

### Faz 3: Otomatik Senkronizasyon

```javascript
// Periyodik olarak fiyatları güncelle
setInterval(async () => {
    const products = await yesilgrow.getAllProducts();
    // Fiyatları güncelle
}, 3600000); // Her saat
```

### Faz 4: Stok Yönetimi

```javascript
// Stok uyarıları
if (vendorPrice.stock_quantity < 10) {
    // Alert gönder
}
```

## ⚠️ Önemli Notlar

1. **Kimlik Bilgileri**: YesilGrow API kimlik bilgilerini `.env` dosyasında sakla
2. **Rate Limiting**: IKAS API'sine çok sık istek gönderme
3. **Eşleştirme**: SKU benzersiz olmalı, barkod da yardımcı
4. **Fiyat Güncelleme**: Günlük senkronizasyon öneriliyor

## 📞 Troubleshooting

### "Authentication failed" hatası
- Client ID ve Secret doğru mu?
- API base URL doğru mu?

### "No matching product found"
- Ürün SKU'su sistemde mevcut mu?
- Barkod alanı doğru mu?

### GraphQL query hatası
- API yanıtını console.log ile kontrol et
- GraphQL şemasını doğrula

## 📝 Kaynaklar

- IKAS API Dokümantasyonu: https://developer.myikas.com
- YesilGrow Entegrasyon: ikas-integration.md

---

**Son Güncelleme**: Aralık 2025
**Versiyon**: 1.0
