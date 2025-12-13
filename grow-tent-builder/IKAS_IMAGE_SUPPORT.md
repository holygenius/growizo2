# 🖼️ IKAS Ürün Görselleri - İçeri Aktarma ve Yönetim

## 📝 Özet

IKAS API'sinden ürün görselleri otomatik olarak çekiliyor ve uygulamada bir ürün için **birden fazla görsel** yönetimi destekleniyor.

## ✨ Yeni Özellikler

### 1. IKAS'tan Görsel Çekme
- IKAS GraphQL API'sından ürün ve variant görselleri otomatik olarak alınıyor
- Görsel sıralanması (`sortOrder`) korunuyor
- Alt metin (ALT text) kaydediliyor

### 2. Birden Fazla Görsel Desteği
- Her ürün için **sınırsız sayıda görsel** eklenebiliyor
- Görseller sıralanabilir (drag-drop gelecekte eklenebilir)
- Birincil görsel (icon) otomatik ayarlanıyor

### 3. Admin Panel İyileştirmeleri
- IKAS modal'ında ürün görselleri preview olarak gösteriliyor
- Görsel sayısı yanında badge gösteriliyor (📸)
- Seçilen ürünün tüm görselleri form'a otomatik ekleniyor

### 4. Form Yönetimi
- Görselleri liste olarak görüntüleme
- Görsel silme (× butonu)
- Yeni görsel URL'si ekleme
- Görselleri manuel olarak kopyala-yapıştır

## 🚀 Teknik Detaylar

### GraphQL Sorgusu (ikasService.js)

```javascript
// Ürün resim verilerini çekme
images {
    id
    url
    altText
    sortOrder
}

// Variant resim verilerini çekme (override ürün resimlerini)
variants {
    images {
        id
        url
        altText
        sortOrder
    }
}
```

### Veri Yapısı

**YesilGrowApiService döndürülen format:**
```javascript
{
    vendorProductId: 'prod_123',
    name: 'Grow Tent 2x2',
    price: 599.99,
    images: [
        { url: 'https://...', altText: 'Grow Tent 2x2' },
        { url: 'https://...', altText: 'Back View' },
        ...
    ]
}
```

**ProductsManager formData:**
```javascript
{
    sku: 'SKU-001',
    name: { en: '...', tr: '...' },
    images: [
        { url: 'https://...', alt: 'Grow Tent 2x2' },
        { url: 'https://...', alt: 'Grow Tent 2x2' },
    ],
    icon: 'https://...' // İlk görsel
}
```

### Database Schema

**products tablosu:**
```sql
ALTER TABLE products
ADD COLUMN images jsonb DEFAULT '[]';
```

**product_images tablosu (opsiyonel):**
```sql
CREATE TABLE product_images (
    id uuid PRIMARY KEY,
    product_id uuid FOREIGN KEY,
    image_url varchar NOT NULL,
    alt_text varchar,
    sort_order integer DEFAULT 0,
    is_primary boolean DEFAULT false,
    UNIQUE (product_id, image_url)
);
```

## 📋 Kullanım Akışı

### Admin Panel'de Ürün Ekleme

1. **Yeni Ürün Aç**
   - Admin Panel → Products Manager → Add Product

2. **IKAS'tan Ürün Seç**
   - "🛍️ Get Product from YesilGrow IKAS" butonuna tıkla
   - Modal açılır

3. **Modal'da Ürün Ara ve Seç**
   - Ürün adı, SKU veya barcodla ara
   - Ürünü tıkla (liste görselleri preview gösterir)
   - Seçilen ürünün **tüm görselleri** otomatik yüklenir

4. **Görselleri Yönet**
   - Otomatik yüklenen görseller listeleniyor
   - Gereksiz görselleri sil (× butonu)
   - Yeni görseller ekle (URL yapıştır veya Prompt ile)

5. **Ürünü Kaydet**
   - Form'daki diğer bilgileri doldur
   - Save Product tıkla
   - Görseller `images` array'ine kaydedilir

## 🎯 Örnek İş Akışı

```
1. Admin Panel açılır
   ↓
2. "Add Product" butonuna tıklanır
   ↓
3. "Get Product from YesilGrow IKAS" tıklanır
   ↓
4. Modal açılır - YesilGrow ürünleri gösterilir
   ↓
5. Ürün görüntüleri modal'da preview olarak gösterilir:
   [Görsel 1] [Görsel 2] [Görsel 3] [+2]
   ↓
6. Ürün tıklanır (seçilir)
   ↓
7. Form otomatik doldurulur:
   ✓ SKU
   ✓ İsim (EN/TR)
   ✓ Fiyat
   ✓ TÜÜM GÖRSELLER (images array)
   ✓ İkon (ilk görsel)
   ↓
8. Gerekli alanları tamamla (Brand, Category, Type)
   ↓
9. Görselleri gerektiğinde düzenle:
   - Sil
   - Ekle
   ↓
10. Save Product tıkla
    ↓
11. Ürün + görselleri kaydedilir
```

## 💻 Kod Entegrasyonu

### 1. ikasService.js - GraphQL'ye Images Ekleme

```javascript
// Ürün images field'ı GraphQL sorgusuna eklendi
images {
    id
    url
    altText
    sortOrder
}

// Variant images field'ı da eklendi (variant resimleri üst resimleri override eder)
variants {
    images {
        id
        url
        altText
        sortOrder
    }
}
```

### 2. parseGraphQLProduct() - Image Parsing

```javascript
// Ürün level images
if (productNode.images && productNode.images.length > 0) {
    product.images = productNode.images.map(img => ({
        url: img.url,
        altText: img.altText || product.name
    }));
}

// Variant level images (override ürün images)
if (activeVariant.images && activeVariant.images.length > 0) {
    product.images = activeVariant.images.map(img => ({
        url: img.url,
        altText: img.altText || product.name
    }));
}
```

### 3. YesilGrowApiService - Görsel Bilgisini Format Etme

```javascript
const vendorProduct = {
    // ... diğer alanlar
    images: ikasProduct.images || [], // Ürün görselleri
    // ...
};
```

### 4. ProductsManager.jsx - Görselleri Form'a Ekleme

```javascript
const handleSelectIkasProduct = (product) => {
    const images = product.images && product.images.length > 0 
        ? product.images.map(img => ({
            url: img.url,
            alt: img.altText || product.name
        }))
        : [];
    
    setFormData({
        ...formData,
        images: images,           // Tüm görseller
        icon: images[0].url,      // İlk görsel icon olarak
        // ... diğer alanlar
    });
};
```

### 5. Form UI - Görselleri Yönetme

```jsx
{/* Görsel listesi */}
{formData.images?.map((img, idx) => (
    <div key={idx}>
        <img src={img.url} alt={img.alt} />
        <button onClick={() => {
            // Görseli kaldır
            setFormData({
                images: formData.images.filter((_, i) => i !== idx)
            });
        }}>×</button>
    </div>
))}

{/* Yeni görsel ekleme */}
<input placeholder="Görsel URL'sini yapıştır..." />
<button onClick={() => {
    // Yeni görsel ekle
    setFormData({
        images: [...formData.images, { url, alt }]
    });
}}>+ Görsel Ekle</button>
```

## 📸 Modal Preview Görselleri

Modal'daki ürün kartında:
- İlk 3 görsel thumbnail'i gösterilir (50x50px)
- 3'ten fazla görsel varsa "+N" badge'i gösterilir
- Görsel sayısı "📸 Images: X" olarak listelenir

## 🔄 Migration (Database)

Migration dosyasında bu değişiklikler yapılmıştır:

```sql
-- Products tablosuna images kolonu ekleme
ALTER TABLE products ADD COLUMN images jsonb DEFAULT '[]';

-- Product images tablosu (opsiyonel)
CREATE TABLE product_images (
    id uuid PRIMARY KEY,
    product_id uuid FOREIGN KEY,
    image_url varchar NOT NULL,
    alt_text varchar,
    sort_order integer DEFAULT 0,
    is_primary boolean DEFAULT false
);
```

## 🚨 Önemli Notlar

1. **Görsel URL'leri Geçerliliği**
   - URL'ler geçerli ve erişilebilir olmalı
   - HTTPS kullanılması önerilir
   - Resim formatları: JPG, PNG, WebP

2. **ALT Metin**
   - SEO için ALT metin önemlidir
   - IKAS'tan gelen ALT metin korunur
   - Ürün ismi default olarak kullanılır

3. **Görsel Sıralanması**
   - IKAS'ta `sortOrder` varsa korunur
   - Manuel olarak eklendiğinde sıra kullanıcı tercihine göre

4. **Performans**
   - Çok sayıda görsel yüklemek performansı etkileyebilir
   - Ürün başına 5-10 görsel tavsiye ediliyor

## 🎨 UI Özellikler

### Modal'da Görsel Preview
```
[Görsel 1] [Görsel 2] [Görsel 3] [+2]
Product Name
SKU: SKU-001
Barcode: 123456789
📸 Images: 5
💰 Price: 599₺ | Stock: 45
```

### Form'da Görsel Yönetimi
```
📸 Product Images (5)

[Görsel1] [Görsel2] [Görsel3] [Görsel4] [Görsel5]
   ×         ×         ×         ×         ×

[Görsel URL'sini yapıştır...] [+ Görsel Ekle]
```

## 🔗 İlgili Dosyalar

- **ikasService.js** - IKAS API çekmesi (GraphQL sorgusu)
- **ProductsManager.jsx** - Admin form ve modal
- **add-vendor-integration.sql** - Database migration
- **IKAS_IMAGE_SUPPORT.md** - Bu dosya

## ✅ Checklist - Kurulum

- [ ] Migration'ı Supabase'de çalıştır
- [ ] ikasService.js'deki GraphQL sorgusunun images field'ı içerdiğini doğrula
- [ ] ProductsManager.jsx'de form yüklendiğinde images field'ı var mı doğrula
- [ ] Modal'da ürün görselleri preview'ı göster
- [ ] Admin panel'de test et - IKAS ürünü seç
- [ ] Görsellerin form'a yüklendiğini doğrula
- [ ] Ürünü kaydet
- [ ] Ürün detayında görsellerin kaydedildiğini doğrula

## 📞 Destek

Sorun ya da soru varsa:
1. Browser console'ı kontrol et (F12)
2. Network tab'ında IKAS API response'unu kontrol et
3. ikasService.js'deki parseGraphQLProduct() console log'larını kontrol et

---

**Son Güncelleme:** Aralık 2025  
**Versiyon:** 2.0 (Görsel Desteği Eklendi)  
**Durum:** ✅ Production Ready
