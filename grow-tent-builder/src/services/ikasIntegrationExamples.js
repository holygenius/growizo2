/**
 * Integration Example - IKAS/YesilGrow Entegrasyonu
 * 
 * Bu örnek, sistemde ürün ekleme sırasında IKAS entegrasyonunun
 * nasıl kullanılacağını göstermektedir.
 */

import { YesilGrowApiService } from '@/services/ikasService';
import { importService } from '@/services/importService';
import { productService } from '@/services/productService';

// ============================================================================
// ÖRNEK 1: Yönetici panelinden ürün çekme ve manuel seçme
// ============================================================================

export async function exampleImportProductsManually() {
    try {
        // YesilGrow servisini başlat
        const yesilgrow = new YesilGrowApiService();

        // Ürünleri çek
        console.log('🔄 YesilGrow ürünleri çekiliyor...');
        const vendorProducts = await yesilgrow.getProductsWithVendorInfo();
        console.log(`✅ ${vendorProducts.length} ürün çekildi`);

        // Ürünleri filtrele (örn: 250₺ altında olanlar)
        const affordableProducts = vendorProducts.filter(p => p.price < 250);
        console.log(`📊 Uygun fiyatlı: ${affordableProducts.length} ürün`);

        // Seçili ürünleri içeri aktar
        const result = await importService.importVendorProducts(
            'yesilgrow',           // vendorCode
            'YesilGrow',           // vendorName
            affordableProducts,    // vendorProducts
            'YesilGrow - Uygun fiyatlı ürünler'
        );

        console.log(`📦 İçeri aktarma sonucu:`, result);
        return result;
    } catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}

// ============================================================================
// ÖRNEK 2: Eşleşmemiş ürünleri bulma ve manuel eşleştirme
// ============================================================================

export async function exampleManualMatching() {
    try {
        // Eşleşmemiş ürünleri getir
        const unmatchedProducts = await importService.getUnmatchedProducts('yesilgrow');
        console.log(`⚠️  ${unmatchedProducts.length} eşleşmemiş ürün`);

        // Her biri için arama yap
        for (const vendorProduct of unmatchedProducts.slice(0, 5)) {
            console.log(`\n🔍 Aranıyor: ${vendorProduct.vendor_name}`);

            // SKU'ya göre arama
            try {
                const matchingProduct = await productService.getProductBySku(
                    vendorProduct.vendor_sku
                );

                if (matchingProduct) {
                    console.log(`✅ Eşleştirme bulundu: ${matchingProduct.name}`);

                    // Eşleştir
                    await importService.matchVendorProduct(
                        vendorProduct.id,
                        matchingProduct.id
                    );
                }
            } catch (e) {
                console.log(`⚠️  SKU eşleşmesi yok`);
            }
        }
    } catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}

// ============================================================================
// ÖRNEK 3: Ürün sayfasında satıcı fiyatlarını gösterme
// ============================================================================

export async function exampleShowVendorPrices(productId) {
    try {
        // Ürünü satıcı bilgileri ile getir
        const product = await productService.getProductWithVendors(productId);
        console.log(`📦 Ürün: ${product.name}`);

        if (product.vendor_products && product.vendor_products.length > 0) {
            console.log(`\n💰 Satıcı Fiyatları:`);

            product.vendor_products.forEach(vp => {
                const price = vp.vendor_prices?.[0];
                console.log(
                    `- ${vp.vendors.name}: ${price?.price}₺ (Stok: ${price?.stock_quantity})`
                );
            });
        }

        return product;
    } catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}

// ============================================================================
// ÖRNEK 4: En ucuz fiyatı bulma
// ============================================================================

export async function exampleFindCheapestPrice(productId) {
    try {
        const cheapest = await productService.getCheapestVendorPrice(productId);

        if (cheapest) {
            console.log(`✅ En Ucuz Satıcı:`);
            console.log(`   - ${cheapest.vendors.name}`);
            console.log(`   - Fiyat: ${cheapest.price}₺`);
            console.log(`   - Stok: ${cheapest.stock_quantity}`);
        } else {
            console.log('❌ Satıcı fiyatı bulunamadı');
        }

        return cheapest;
    } catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}

// ============================================================================
// ÖRNEK 5: Ürün tipine göre fiyat karşılaştırması
// ============================================================================

export async function exampleComparePricesByType(productType) {
    try {
        // Ürün tipini satıcı bilgileri ile getir
        const products = await productService.getProductsByTypeWithVendors(productType);
        console.log(`📦 ${productType} kategorisinde ${products.length} ürün`);

        const comparison = {};

        for (const product of products) {
            const cheapest = await productService.getCheapestVendorPrice(product.id);

            if (cheapest) {
                comparison[product.name] = {
                    systemPrice: product.price,
                    vendorPrice: cheapest.price,
                    vendorName: cheapest.vendors.name,
                    savings: product.price - cheapest.price,
                };
            }
        }

        // Sonuçları göster
        console.log('\n💰 Fiyat Karşılaştırması:');
        Object.entries(comparison).forEach(([name, prices]) => {
            const savingPercent = ((prices.savings / prices.systemPrice) * 100).toFixed(1);
            console.log(`
  ${name}:
    Sistem: ${prices.systemPrice}₺
    ${prices.vendorName}: ${prices.vendorPrice}₺
    Tasarruf: ${prices.savings}₺ (${savingPercent}%)
            `);
        });

        return comparison;
    } catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}

// ============================================================================
// ÖRNEK 6: Tüm satıcı fiyatlarını getirme ve karşılaştırma
// ============================================================================

export async function exampleGetAllVendorPricesForProduct(productId) {
    try {
        const prices = await productService.getAllVendorPrices(productId);

        if (prices.length === 0) {
            console.log('❌ Bu ürün için satıcı fiyatı bulunamadı');
            return [];
        }

        console.log(`📊 ${prices.length} satıcı fiyatı:`);

        prices.forEach((priceData, index) => {
            console.log(`
  ${index + 1}. ${priceData.vendors.name}
     Fiyat: ${priceData.price}₺
     Stok: ${priceData.stock_quantity}
     Son Güncellenme: ${new Date(priceData.last_updated).toLocaleString('tr-TR')}
            `);
        });

        // Ortalama fiyatı hesapla
        const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
        console.log(`\n📈 Ortalama Fiyat: ${avgPrice.toFixed(2)}₺`);

        return prices;
    } catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}

// ============================================================================
// ÖRNEK 7: Satıcı ürün güncellemeleri
// ============================================================================

export async function exampleUpdateVendorPrice(vendorProductId, newPrice, newStock) {
    try {
        const updated = await importService.updateVendorPrice(
            vendorProductId,
            newPrice,
            newStock,
            'Istanbul Warehouse'
        );

        console.log(`✅ Satıcı fiyatı güncellendi:`);
        console.log(`   Yeni Fiyat: ${updated.price}₺`);
        console.log(`   Yeni Stok: ${updated.stock_quantity}`);

        return updated;
    } catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}

// ============================================================================
// ÖRNEK 8: Kullanıcıya en iyi fiyatı gösterme
// ============================================================================

export async function exampleDisplayBestPriceToUser(productId) {
    try {
        const product = await productService.getProductWithVendors(productId);
        const cheapest = await productService.getCheapestVendorPrice(productId);

        const userInfo = {
            productName: product.name,
            systemPrice: product.price,
            bestVendorPrice: cheapest?.price || product.price,
            vendorName: cheapest?.vendors?.name || 'Kendi Ağımız',
            savings: product.price - (cheapest?.price || 0),
            stock: cheapest?.stock_quantity || 0,
        };

        // UI'da gösterilecek bilgi
        console.log(`
🛒 ${userInfo.productName}
   Fiyat: ${userInfo.bestVendorPrice}₺ (${userInfo.vendorName})
   ${userInfo.savings > 0 ? `💰 Tasarruf: ${userInfo.savings}₺` : ''}
   ${userInfo.stock > 0 ? `✅ Stokta: ${userInfo.stock}` : '❌ Tükendi'}
        `);

        return userInfo;
    } catch (error) {
        console.error('❌ Hata:', error);
        throw error;
    }
}

// ============================================================================
// KULLANIM ÖRNEĞİ
// ============================================================================

export async function runAllExamples() {
    console.log('🚀 IKAS Entegrasyonu Örneklerini Çalıştırıyor...\n');

    try {
        // Örnek 1: Manuel ürün içeri aktarma
        console.log('--- ÖRNEK 1: Manuel İçeri Aktarma ---');
        // await exampleImportProductsManually();

        // Örnek 2: Eşleşmemiş ürünleri eşleştirme
        console.log('\n--- ÖRNEK 2: Manuel Eşleştirme ---');
        // await exampleManualMatching();

        // Örnek 3: Satıcı fiyatlarını gösterme
        console.log('\n--- ÖRNEK 3: Satıcı Fiyatlarını Göster ---');
        // const productId = 'YOUR_PRODUCT_ID';
        // await exampleShowVendorPrices(productId);

        // Örnek 4: En ucuz fiyatı bulma
        console.log('\n--- ÖRNEK 4: En Ucuz Fiyatı Bul ---');
        // await exampleFindCheapestPrice(productId);

        // Örnek 5: Fiyat karşılaştırması
        console.log('\n--- ÖRNEK 5: Fiyat Karşılaştırması ---');
        // await exampleComparePricesByType('light');

        console.log('\n✅ Tüm örnekler tamamlandı!');
    } catch (error) {
        console.error('❌ Hata oluştu:', error);
    }
}

export default {
    exampleImportProductsManually,
    exampleManualMatching,
    exampleShowVendorPrices,
    exampleFindCheapestPrice,
    exampleComparePricesByType,
    exampleGetAllVendorPricesForProduct,
    exampleUpdateVendorPrice,
    exampleDisplayBestPriceToUser,
    runAllExamples,
};
