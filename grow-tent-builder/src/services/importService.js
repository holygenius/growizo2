import { supabase } from './supabase';

/**
 * Service for managing vendor product imports
 * Handles matching, storing, and syncing vendor products with internal products
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
            .single();

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
                    .eq('sku', sku)
                    .single();

                if (productBySku) {
                    return productBySku;
                }
            }

            // Try to find by barcode
            if (barcode) {
                // This assumes barcodes are stored in a specific field or JSON
                // Adjust based on your actual schema
                const { data: productByBarcode } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('key_properties', `%"barcode":"${barcode}"%`)
                    .single();

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
                            .eq('vendor_product_id', vendorProduct.vendorProductId)
                            .single();

                        if (!existingVendorProduct) {
                            // Create vendor product link
                            const { data: newVendorProduct, error: insertError } = await supabase
                                .from('vendor_products')
                                .insert([
                                    {
                                        product_id: matchingProduct.id,
                                        vendor_id: vendor.id,
                                        vendor_product_id: vendorProduct.vendorProductId,
                                        vendor_sku: vendorProduct.sku,
                                        vendor_name: vendorProduct.name,
                                        barcode: vendorProduct.barcode,
                                        is_matched: true,
                                        is_active: true,
                                    }
                                ])
                                .select()
                                .single();

                            if (insertError) throw insertError;

                            // Store vendor price
                            const { error: priceError } = await supabase
                                .from('vendor_prices')
                                .insert([
                                    {
                                        vendor_product_id: newVendorProduct.id,
                                        vendor_id: vendor.id,
                                        price: vendorProduct.price,
                                        currency: vendorProduct.currency || 'TRY',
                                        stock_quantity: vendorProduct.stock || 0,
                                        stock_location: vendorProduct.stockLocation || null,
                                        last_updated: new Date().toISOString(),
                                    }
                                ])
                                .select()
                                .single();

                            if (priceError) throw priceError;

                            result.matchedProducts++;
                            result.importedProductIds.push(newVendorProduct.id);
                        } else {
                            // Update existing vendor price
                            const { error: updateError } = await supabase
                                .from('vendor_prices')
                                .update({
                                    price: vendorProduct.price,
                                    currency: vendorProduct.currency || 'TRY',
                                    stock_quantity: vendorProduct.stock || 0,
                                    stock_location: vendorProduct.stockLocation || null,
                                    last_updated: new Date().toISOString(),
                                })
                                .eq('vendor_product_id', existingVendorProduct.id);

                            if (updateError) throw updateError;
                            result.matchedProducts++;
                        }
                    } else {
                        // No matching product found - skip for now
                        result.skippedProducts++;
                        console.log(`⚠️ No matching product found for: ${vendorProduct.name} (SKU: ${vendorProduct.sku})`);
                    }
                } catch (error) {
                    result.errors.push({
                        vendorProductId: vendorProduct.vendorProductId,
                        name: vendorProduct.name,
                        error: error.message,
                    });
                    console.error(`Error processing vendor product ${vendorProduct.name}:`, error);
                }
            }

            // Log import results
            await this.logImport(vendor.id, result);

            console.log(`✅ Import completed: ${result.matchedProducts} matched, ${result.skippedProducts} skipped, ${result.errors.length} errors`);
            return result;
        } catch (error) {
            console.error('Error importing vendor products:', error);
            throw error;
        }
    },

    /**
     * Log import attempt for audit trail
     */
    async logImport(vendorId, result) {
        try {
            const { error } = await supabase
                .from('vendor_import_logs')
                .insert([
                    {
                        vendor_id: vendorId,
                        total_products: result.totalProducts,
                        matched_products: result.matchedProducts,
                        new_products: result.newVendorProducts,
                        errors: result.errors.length,
                        error_details: result.errors.length > 0 ? result.errors : null,
                    }
                ]);

            if (error) {
                console.error('Error logging import:', error);
            }
        } catch (error) {
            console.error('Error in logImport:', error);
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
                    vendors (*),
                    vendor_prices (*)
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
     * Get vendor price information for a product
     */
    async getVendorPrice(productId, vendorCode) {
        try {
            const { data, error } = await supabase
                .from('vendor_prices')
                .select(`
                    *,
                    vendor_products (*),
                    vendors (*)
                `)
                .eq('vendor_products.product_id', productId)
                .eq('vendors.vendor_code', vendorCode)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
            return data || null;
        } catch (error) {
            console.error('Error fetching vendor price:', error);
            return null;
        }
    },

    /**
     * Get all vendor prices for a product
     */
    async getAllVendorPrices(productId) {
        try {
            const { data, error } = await supabase
                .from('vendor_prices')
                .select(`
                    *,
                    vendor_products (*),
                    vendors (*)
                `)
                .eq('vendor_products.product_id', productId);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching all vendor prices:', error);
            return [];
        }
    },

    /**
     * Filter unmatched vendor products for manual matching
     */
    async getUnmatchedProducts(vendorCode) {
        try {
            const { data, error } = await supabase
                .from('vendor_products')
                .select(`
                    *,
                    vendors (*)
                `)
                .eq('vendors.vendor_code', vendorCode)
                .eq('is_matched', false)
                .eq('is_active', true);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching unmatched products:', error);
            return [];
        }
    },

    /**
     * Manually match a vendor product with an internal product
     */
    async matchVendorProduct(vendorProductId, productId) {
        try {
            const { data, error } = await supabase
                .from('vendor_products')
                .update({
                    product_id: productId,
                    is_matched: true,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', vendorProductId)
                .select()
                .single();

            if (error) throw error;
            console.log(`✅ Matched vendor product to internal product: ${productId}`);
            return data;
        } catch (error) {
            console.error('Error matching vendor product:', error);
            throw error;
        }
    },

    /**
     * Update vendor product price and stock
     */
    async updateVendorPrice(vendorProductId, price, stock, stockLocation = null) {
        try {
            // Find the vendor price record
            const { data: vendorPrice, error: fetchError } = await supabase
                .from('vendor_prices')
                .select('id')
                .eq('vendor_product_id', vendorProductId)
                .single();

            if (fetchError) throw fetchError;

            // Update the price
            const { data, error } = await supabase
                .from('vendor_prices')
                .update({
                    price: price,
                    stock_quantity: stock,
                    stock_location: stockLocation,
                    last_updated: new Date().toISOString(),
                })
                .eq('id', vendorPrice.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating vendor price:', error);
            throw error;
        }
    },
};
