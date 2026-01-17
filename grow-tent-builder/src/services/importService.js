import { supabase } from './supabase';

/**
 * Service for managing vendor product imports
 * Handles matching, storing, and syncing vendor products with internal products
 * 
 * Updated: vendor_products now contains price and URL directly
 */
export const importService = {
    /**
     * Get or create a vendor entry
     */
    async getOrCreateVendor(vendorCode, vendorName, description = '') {
        // First try to get existing vendor
        const { data: existingVendor } = await supabase
            .from('vendors')
            .select('*')
            .eq('vendor_code', vendorCode)
            .maybeSingle();

        if (existingVendor) {
            return existingVendor;
        }

        // Create new vendor if doesn't exist
        const { data: newVendor, error } = await supabase
            .from('vendors')
            .insert([
                {
                    name: vendorName,
                    vendor_code: vendorCode,
                    description: description,
                    is_active: true,
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating vendor:', error);
            throw error;
        }

        return newVendor;
    },

    /**
     * Find matching product by SKU or barcode
     */
    async findMatchingProduct(sku, barcode = null) {
        try {
            // Try to find by SKU first
            if (sku) {
                const { data: productBySku } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('sku', sku)
                    .maybeSingle();

                if (productBySku) {
                    return productBySku;
                }
            }

            // Try to find by barcode in specs
            if (barcode) {
                const { data: productByBarcode } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('key_properties', `%"barcode":"${barcode}"%`)
                    .maybeSingle();

                if (productByBarcode) {
                    return productByBarcode;
                }
            }

            return null;
        } catch (error) {
            console.error('Error finding matching product:', error);
            return null;
        }
    },

    /**
     * Import vendor products and match with existing products
     * Price and URL are now stored directly in vendor_products
     */
    async importVendorProducts(vendorCode, vendorName, vendorProducts, description = '') {
        const result = {
            totalProducts: vendorProducts.length,
            matchedProducts: 0,
            newVendorProducts: 0,
            skippedProducts: 0,
            errors: [],
            importedProductIds: [],
        };

        try {
            // Get or create vendor
            const vendor = await this.getOrCreateVendor(vendorCode, vendorName, description);
            result.vendorId = vendor.id;

            // Process each vendor product
            for (const vendorProduct of vendorProducts) {
                try {
                    // Find matching internal product
                    const matchingProduct = await this.findMatchingProduct(
                        vendorProduct.sku,
                        vendorProduct.barcode
                    );

                    if (matchingProduct) {
                        // Check if vendor product already exists
                        const { data: existingVendorProduct } = await supabase
                            .from('vendor_products')
                            .select('id')
                            .eq('vendor_id', vendor.id)
                            .eq('product_id', matchingProduct.id)
                            .maybeSingle();

                        if (!existingVendorProduct) {
                            // Create vendor product link (price included)
                            const { data: newVendorProduct, error: insertError } = await supabase
                                .from('vendor_products')
                                .insert([
                                    {
                                        product_id: matchingProduct.id,
                                        vendor_id: vendor.id,
                                        vendor_sku: vendorProduct.sku,
                                        vendor_product_name: vendorProduct.name,
                                        barcode: vendorProduct.barcode,
                                        price: vendorProduct.price || 0,
                                        currency: vendorProduct.currency || 'TRY',
                                        product_url: vendorProduct.url || vendorProduct.productUrl || null,
                                        stock_quantity: vendorProduct.stock || 0,
                                        stock_status: vendorProduct.stock > 0 ? 'in_stock' : 'out_of_stock',
                                        is_active: true,
                                        last_synced_at: new Date().toISOString(),
                                    }
                                ])
                                .select()
                                .single();

                            if (insertError) throw insertError;

                            result.matchedProducts++;
                            result.newVendorProducts++;
                            result.importedProductIds.push(newVendorProduct.id);
                        } else {
                            // Update existing vendor product
                            const { error: updateError } = await supabase
                                .from('vendor_products')
                                .update({
                                    vendor_sku: vendorProduct.sku,
                                    vendor_product_name: vendorProduct.name,
                                    barcode: vendorProduct.barcode,
                                    price: vendorProduct.price || 0,
                                    currency: vendorProduct.currency || 'TRY',
                                    product_url: vendorProduct.url || vendorProduct.productUrl || null,
                                    stock_quantity: vendorProduct.stock || 0,
                                    stock_status: vendorProduct.stock > 0 ? 'in_stock' : 'out_of_stock',
                                    last_synced_at: new Date().toISOString(),
                                })
                                .eq('id', existingVendorProduct.id);

                            if (updateError) throw updateError;
                            result.matchedProducts++;
                        }
                    } else {
                        // No matching product found - skip
                        result.skippedProducts++;
                        console.log(`⚠️ No matching product found for: ${vendorProduct.name} (SKU: ${vendorProduct.sku})`);
                    }
                } catch (error) {
                    result.errors.push({
                        sku: vendorProduct.sku,
                        name: vendorProduct.name,
                        error: error.message,
                    });
                    console.error(`Error processing vendor product ${vendorProduct.name}:`, error);
                }
            }

            console.log(`✅ Import completed: ${result.matchedProducts} matched, ${result.skippedProducts} skipped, ${result.errors.length} errors`);
            return result;
        } catch (error) {
            console.error('Error importing vendor products:', error);
            throw error;
        }
    },

    /**
     * Get vendor products for a specific vendor
     */
    async getVendorProducts(vendorCode) {
        try {
            const { data, error } = await supabase
                .from('vendor_products')
                .select(`
                    *,
                    products (*),
                    vendors (*)
                `)
                .eq('vendors.vendor_code', vendorCode)
                .eq('is_active', true);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching vendor products:', error);
            return [];
        }
    },

    /**
     * Get all vendor products for a specific product
     */
    async getProductVendors(productId) {
        try {
            const { data, error } = await supabase
                .from('vendor_products')
                .select(`
                    *,
                    vendors (*)
                `)
                .eq('product_id', productId)
                .eq('is_active', true)
                .order('price', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching product vendors:', error);
            return [];
        }
    },

    /**
     * Update vendor product price and stock
     */
    async updateVendorProduct(vendorProductId, updates) {
        try {
            const { data, error } = await supabase
                .from('vendor_products')
                .update({
                    ...updates,
                    last_synced_at: new Date().toISOString(),
                })
                .eq('id', vendorProductId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating vendor product:', error);
            throw error;
        }
    },

    /**
     * Create vendor product link manually
     */
    async linkProductToVendor(productId, vendorId, vendorData) {
        try {
            const { data, error } = await supabase
                .from('vendor_products')
                .insert([
                    {
                        product_id: productId,
                        vendor_id: vendorId,
                        vendor_sku: vendorData.sku,
                        vendor_product_name: vendorData.name,
                        barcode: vendorData.barcode,
                        price: vendorData.price || 0,
                        currency: vendorData.currency || 'TRY',
                        product_url: vendorData.url,
                        stock_quantity: vendorData.stock || 0,
                        stock_status: vendorData.stock > 0 ? 'in_stock' : 'out_of_stock',
                        is_active: true,
                        last_synced_at: new Date().toISOString(),
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            console.log(`✅ Linked product to vendor`);
            return data;
        } catch (error) {
            console.error('Error linking product to vendor:', error);
            throw error;
        }
    },
};
