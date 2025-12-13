# IKAS Entegrasyonu - Hızlı Başlangıç

## ⚡ 5 Dakikada Kurulum

### 1️⃣ Adım 1: Veritabanını Güncelle

SQL migrasyonunu çalıştır:

```bash
# Supabase SQL Editor'de açıp çalıştır:
scripts/add-vendor-integration.sql
```

**Oluşturulan Tablolar:**
- `vendors` - Satıcılar
- `vendor_products` - Satıcı ürünleri
- `vendor_prices` - Satıcı fiyatları
- `vendor_import_logs` - İçeri aktarma günlüğü

### 2️⃣ Adım 2: Servisleri Kontrol Et

Dosyalar zaten oluşturulmuş:
- ✅ `src/services/ikasService.js` - IKAS API
- ✅ `src/services/importService.js` - İçeri aktarma
- ✅ `src/services/productService.js` - Güncellenmiş

### 3️⃣ Adım 3: Admin Panele Ekle

Admin bileşenine ekle:

```jsx
// src/pages/AdminPanel.jsx veya Admin route'unun olduğu yer

import AdminProductImport from '@/components/Admin/AdminProductImport';

export function AdminPanel() {
  return (
    <div>
      {/* ... diğer admin bileşenleri ... */}
      <AdminProductImport />
    </div>
  );
}
```

### 4️⃣ Adım 4: Ürün Sayfasında Göster

Ürün detay sayfasında satıcı fiyatlarını göster:

```jsx
import { productService } from '@/services/productService';
import { useEffect, useState } from 'react';

export function ProductDetail({ productId }) {
  const [vendorPrices, setVendorPrices] = useState([]);

  useEffect(() => {
    const loadPrices = async () => {
      const prices = await productService.getAllVendorPrices(productId);
      setVendorPrices(prices);
    };
    loadPrices();
  }, [productId]);

  return (
    <div>
      <h1>Ürün Detayları</h1>
      
      {vendorPrices.length > 0 && (
        <div className="vendor-prices">
          <h3>💰 Satıcı Fiyatları:</h3>
          {vendorPrices.map(price => (
            <div key={price.id}>
              <strong>{price.vendors.name}</strong>: {price.price}₺
              (Stok: {price.stock_quantity})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🎯 Temel Kullanım Örnekleri

### YesilGrow'dan Ürün Çek

```javascript
import { YesilGrowApiService } from '@/services/ikasService';

const yesilgrow = new YesilGrowApiService();
const products = await yesilgrow.getProductsWithVendorInfo();
```

### Ürünleri İçeri Aktar

```javascript
import { importService } from '@/services/importService';

const result = await importService.importVendorProducts(
  'yesilgrow',
  'YesilGrow',
  productsArray
);
```

### Satıcı Fiyatlarını Getir

```javascript
import { productService } from '@/services/productService';

const prices = await productService.getAllVendorPrices(productId);
const cheapest = await productService.getCheapestVendorPrice(productId);
```

## 📊 İşlem Akışı

```
Admin Paneli
    ↓
[Ürünleri Getir] → YesilGrow API → IKAS
    ↓
Ürünleri Filtrele ve Seç
    ↓
[İçeri Aktar]
    ↓
SKU/Barkod ile Eşleştir
    ↓
Veritabanına Kaydet
    ↓
Ürün Sayfasında Göster
```

## 🔧 Gelişmiş Özellikler

### Eşleşmemiş Ürünleri Bulma

```javascript
const unmatched = await importService.getUnmatchedProducts('yesilgrow');
```

### Manuel Eşleştirme

```javascript
await importService.matchVendorProduct(vendorProductId, internalProductId);
```

### Fiyat Güncelleme

```javascript
await importService.updateVendorPrice(vendorProductId, price, stock);
```

### Ürün Tipi ile Fiyat Karşılaştırması

```javascript
const products = await productService.getProductsByTypeWithVendors('light');
const comparison = await productService.getVendorPriceComparison(productIds);
```

## ⚙️ Ortam Değişkenleri

`.env.local` dosyasında gerekli değişkenler:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# IKAS/YesilGrow (zaten ikasService.js'de hardcode)
# Ama sonra .env'ye taşı:
VITE_IKAS_CLIENT_ID=your_client_id
VITE_IKAS_CLIENT_SECRET=your_client_secret
VITE_IKAS_BASE_URL=https://yesilgrow.myikas.com/api
```

Sonra `ikasService.js`'i güncelle:

```javascript
const config = {
    clientId: import.meta.env.VITE_IKAS_CLIENT_ID,
    clientSecret: import.meta.env.VITE_IKAS_CLIENT_SECRET,
    baseUrl: import.meta.env.VITE_IKAS_BASE_URL,
};
```

## 🚨 Troubleshooting

### "Cannot find module" hatası
```bash
# node_modules yeniden kur
rm -rf node_modules package-lock.json
npm install
```

### IKAS authentication hatası
- Client ID ve Secret doğru mu? Check credentials
- API base URL doğru mu?
- Network erişimi var mı?

### Veri eşleşmeme sorunu
- SKU benzersiz mi?
- Barkod doğru mu?
- Manuel eşleştir: `matchVendorProduct()`

### Supabase RLS (Row Level Security) hatası
- RLS kurallarını kontrol et
- Authenticated user permission kontrol et

## 📚 Daha Fazla Bilgi

- **Detaylı Rehber**: [VENDOR_INTEGRATION_GUIDE.md](VENDOR_INTEGRATION_GUIDE.md)
- **Kod Örnekleri**: [src/services/ikasIntegrationExamples.js](src/services/ikasIntegrationExamples.js)
- **İlk Entegrasyon**: [ikas-integration.md](ikas-integration.md)

## 🎓 Adım Adım Öğretici

### Senario: Yeni Ürün Ekleme

1. **Admin Panelinde**
   ```
   [Ürünleri Getir] → YesilGrow'dan çek
   ```

2. **Filtrele**
   ```
   Ara: "Grow Tent" → 25 ürün bulundu
   ```

3. **Seç**
   ```
   ☑ Grow Tent 2x2
   ☑ Grow Tent 2x4
   ☑ Grow Tent 4x4
   ```

4. **İçeri Aktar**
   ```
   [İçeri Aktar] → 3 ürün eşleştirildi
   ```

5. **Ürün Sayfasında**
   ```
   💰 Satıcı Fiyatları: YesilGrow 599₺
   ```

## 📞 Destek

Hata veya soru varsa:
1. Console'da error mesajını kontrol et
2. Supabase logs'u kontrol et
3. Network tab'ında API çağrısını kontrol et

---

**Hızlı Başlangıç Tamamlandı! 🎉**

Sonraki adımlar:
- [ ] Veritabanını güncelle
- [ ] Admin panele ekleme komponentini ekle
- [ ] Test yap
- [ ] Ürün sayfasında göster
- [ ] Canlıya al

