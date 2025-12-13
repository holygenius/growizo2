# ✅ IKAS Entegrasyonu - Kurulum Checklist

## 📋 Kurulum Adımları

### Faz 1: Dosya Kontrolü ✅

- [x] `src/services/ikasService.js` - IKAS API servisi oluşturuldu
- [x] `src/services/importService.js` - İçeri aktarma servisi oluşturuldu
- [x] `src/services/productService.js` - Vendor methods eklendi
- [x] `src/components/Admin/AdminProductImport.jsx` - Admin UI bileşeni oluşturuldu
- [x] `src/components/Admin/AdminProductImport.module.css` - Stiller oluşturuldu
- [x] `src/services/ikasIntegrationExamples.js` - Kullanım örnekleri oluşturuldu

### Faz 2: Veritabanı Kurulumu

- [ ] `scripts/add-vendor-integration.sql` dosyasını Supabase SQL Editor'de çalıştır
- [ ] Şu tabloların oluşturulduğunu kontrol et:
  - [ ] `vendors`
  - [ ] `vendor_products`
  - [ ] `vendor_prices`
  - [ ] `vendor_import_logs`
- [ ] Index'lerin oluşturulduğunu kontrol et
- [ ] YesilGrow vendor'ının eklendiğini kontrol et

### Faz 3: Admin Arayüzü Entegrasyonu

- [ ] `src/pages/AdminPanel.jsx` veya admin route'una `AdminProductImport` bileşenini ekle
  ```jsx
  import AdminProductImport from '@/components/Admin/AdminProductImport';
  
  // Admin panelinde kullan
  <AdminProductImport />
  ```
- [ ] Admin paneli test et
- [ ] Ürünleri getirme özelliğini test et
- [ ] Filtreleme özelliğini test et
- [ ] Seçim/deseçim özelliğini test et

### Faz 4: Ürün Sayfası Entegrasyonu

- [ ] `src/pages/ProductDetail.jsx` veya ürün bileşenine vendor prices ekleme:
  ```jsx
  import { productService } from '@/services/productService';
  
  const vendorPrices = await productService.getAllVendorPrices(productId);
  const cheapest = await productService.getCheapestVendorPrice(productId);
  ```
- [ ] Satıcı fiyatlarını göster
- [ ] En ucuz fiyat görünümünü ekle
- [ ] Stok durumunu göster

### Faz 5: Testing

#### Admin Paneli Tests
- [ ] "Ürünleri Getir" butonunu test et
- [ ] YesilGrow'dan ürünlerin çekildiğini kontrol et
- [ ] Ürün listesinin yüklendiğini kontrol et
- [ ] Arama özelliğini test et
  - [ ] İsimle ara
  - [ ] SKU'yla ara
  - [ ] Barkodla ara
- [ ] "Tümünü Seç" butonunu test et
- [ ] "Seçimi Kaldır" butonunu test et
- [ ] Birkaç ürün seç ve içeri aktar
- [ ] İçeri aktarma sonucunu kontrol et

#### Veritabanı Tests
- [ ] Supabase'de `vendors` tablosuna veri girişini kontrol et
- [ ] `vendor_products` tablosuna mapping'in eklendiğini kontrol et
- [ ] `vendor_prices` tablosuna fiyatların kaydedildiğini kontrol et
- [ ] İçeri aktarma günlüğünü kontrol et

#### Ürün Sayfası Tests
- [ ] Ürün detay sayfasında satıcı fiyatlarının göründüğünü kontrol et
- [ ] En ucuz fiyatın vurgulandığını kontrol et
- [ ] Stok bilgisinin doğru göründüğünü kontrol et
- [ ] Birden fazla satıcı fiyatının göründüğünü kontrol et

### Faz 6: Error Handling

- [ ] API authentication hatasını test et
- [ ] Network hatası durumunda fallback kontrol et
- [ ] Eşleşmemiş ürün durumunu test et
- [ ] Boş ürün listesi durumunu test et
- [ ] Loading state'i test et

### Faz 7: Performance

- [ ] Admin panelinde 1000+ ürün yükleme testini yap
- [ ] Filtering performance'ını test et
- [ ] Database query'lerinin indexed olduğunu kontrol et
- [ ] API response time'ını kontrol et (< 5 sn ideal)

### Faz 8: Security

- [ ] IKAS credentials .env'de saklandığını kontrol et
  ```
  VITE_IKAS_CLIENT_ID=xxx
  VITE_IKAS_CLIENT_SECRET=xxx
  VITE_IKAS_BASE_URL=xxx
  ```
- [ ] Credentials'i hardcode'dan `.env`'ye taşı
- [ ] API credentials'i public log'lara çıkmadığını kontrol et
- [ ] Supabase RLS kurallarını kontrol et
- [ ] Authentication token'ının secure olduğunu kontrol et

## 🎯 Development Workflow

### Günlük İş Akışı

```
1. Admin Paneli Açılır
   ↓
2. "Ürünleri Getir" Tıklanır
   ↓
3. YesilGrow'dan Ürünler Çekilir
   ↓
4. Ürünler Filtrelenir
   ↓
5. Seçili Ürünler İçeri Aktarılır
   ↓
6. Sistem SKU/Barkoda Göre Eşleştirir
   ↓
7. Fiyatlar Kaydedilir
   ↓
8. Ürün Sayfasında Gösterilir
```

### Eşleşmemiş Ürün Akışı

```
1. Eşleşmemiş Ürünler Bulunur
   ↓
2. Manuel Arama Yapılır
   ↓
3. Ürün Bulunursa Eşleştirilir
   ↓
4. Eşleşme Fiyatı Kaydedilir
```

## 🔍 Test Kodları

### Test 1: IKAS Servisi
```javascript
import { YesilGrowApiService } from '@/services/ikasService';

async function testIkasService() {
  const yesilgrow = new YesilGrowApiService();
  const products = await yesilgrow.getProductsWithVendorInfo();
  console.log(`✅ Fetched ${products.length} products`);
  return products;
}

await testIkasService();
```

### Test 2: İçeri Aktarma
```javascript
import { importService } from '@/services/importService';

async function testImport() {
  const result = await importService.importVendorProducts(
    'yesilgrow',
    'YesilGrow',
    [{
      vendorProductId: 'test-1',
      name: 'Test Product',
      sku: 'TEST-001',
      barcode: '123456',
      price: 99.99,
      stock: 10
    }]
  );
  console.log('✅ Import result:', result);
  return result;
}

await testImport();
```

### Test 3: Fiyat Getirme
```javascript
import { productService } from '@/services/productService';

async function testPrices() {
  const productId = 'YOUR_PRODUCT_ID';
  
  const prices = await productService.getAllVendorPrices(productId);
  console.log('✅ All vendor prices:', prices);
  
  const cheapest = await productService.getCheapestVendorPrice(productId);
  console.log('✅ Cheapest price:', cheapest);
  
  return { prices, cheapest };
}

await testPrices();
```

## 📊 Monitoring

### Supabase Monitoring

Aşağıdaki sorguları düzenli olarak çalıştır:

```sql
-- Toplam satıcı ürünü sayısı
SELECT vendor_id, COUNT(*) as total FROM vendor_products GROUP BY vendor_id;

-- Eşleşmiş vs eşleşmemiş
SELECT is_matched, COUNT(*) FROM vendor_products GROUP BY is_matched;

-- En fazla imported ürün
SELECT v.name, COUNT(vp.id) as count 
FROM vendors v 
LEFT JOIN vendor_products vp ON v.id = vp.vendor_id 
GROUP BY v.id, v.name;

-- Son import zamanı
SELECT * FROM vendor_import_logs ORDER BY imported_at DESC LIMIT 10;
```

## 🐛 Troubleshooting Guide

| Sorun | Sebep | Çözüm |
|-------|-------|-------|
| "Cannot find ikasService" | Import path yanlış | Path'i kontrol et: `@/services/ikasService` |
| IKAS auth hatası | Credentials yanlış | `.env` dosyasını kontrol et |
| Ürün eşleşmiyor | SKU/barcode mismatch | Manual matching kulllan |
| Admin paneli boş | Veri yok | Veritabanını kontrol et |
| Stok 0 gösteriliyor | GraphQL response sorunu | Network tab'ı kontrol et |

## ✨ Post-Launch Checklist

Canlıya almadan önce:

- [ ] Tüm tests pass
- [ ] Performance OK (< 5s load)
- [ ] Security review complete
- [ ] Error handling tested
- [ ] Documentation updated
- [ ] Credentials secured
- [ ] Backup created
- [ ] Rollback plan ready

## 📝 Documentation Status

- [x] IKAS_QUICK_START.md - Hızlı başlangıç rehberi
- [x] VENDOR_INTEGRATION_GUIDE.md - Detaylı teknik rehber
- [x] INTEGRATION_SUMMARY.md - Sistem özeti
- [x] ikasIntegrationExamples.js - Kod örnekleri
- [x] Bu Checklist - Kurulum talimatları

## 🎉 Tamamlama Kriterleri

Entegrasyon başarılı sayılıyor eğer:

1. ✅ Veritabanı tabloları oluşturuldu
2. ✅ Admin panelinden ürün çekiyor
3. ✅ Ürünler otomatik eşleşiyor
4. ✅ Fiyatlar kaydediliyor
5. ✅ Ürün sayfasında gösteriliyor
6. ✅ Error handling çalışıyor
7. ✅ Performance acceptable
8. ✅ Security OK

---

**Entegrasyon Tarihi:** Aralık 2025  
**Versiyon:** 1.0  
**Durum:** Ready for Deployment ✅

