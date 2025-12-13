/**
 * IKAS API Service
 * Handles authentication and product fetching from IKAS infrastructure
 * Currently integrated with YesilGrow vendor
 */

class IkasApiConfig {
    constructor(clientId, clientSecret, baseUrl) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = baseUrl;
        this.accessToken = null;
        this.tokenExpiresAt = null;
    }
}

export class IkasApiService {
    constructor(clientId, clientSecret, baseUrl) {
        this.config = new IkasApiConfig(clientId, clientSecret, baseUrl);
    }

    /**
     * Authenticate with IKAS API using OAuth2 client credentials
     */
    async authenticate() {
        try {
            console.log(`🔐 Attempting authentication with: ${this.config.baseUrl}`);
            const tokenUrl = `${this.config.baseUrl}/admin/oauth/token`;
            console.log(`📡 Token URL: ${tokenUrl}`);

            const formData = new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
            });

            const response = await fetch(tokenUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const responseContent = await response.text();

            if (response.ok) {
                console.log('✅ Authentication successful!');
                console.log(`📄 Token response: ${responseContent}`);

                const tokenResponse = JSON.parse(responseContent);

                if (tokenResponse && tokenResponse.access_token) {
                    this.config.accessToken = tokenResponse.access_token;
                    this.config.tokenExpiresAt = new Date(Date.now() + (tokenResponse.expires_in - 60) * 1000);

                    console.log(`🎫 Token expires at: ${this.config.tokenExpiresAt}`);
                    return true;
                }
            } else {
                console.log(`❌ Authentication failed: ${response.status}`);
                console.log(`❌ Error response: ${responseContent}`);
            }

            return false;
        } catch (error) {
            console.log(`❌ Authentication error: ${error.message}`);
            return false;
        }
    }

    /**
     * Fetch all products from IKAS with pagination
     */
    async getAllProducts() {
        const allProducts = [];
        let currentPage = 1;
        let hasNext = true;

        try {
            // Check if we need to authenticate
            if (!this.config.accessToken || new Date() >= this.config.tokenExpiresAt) {
                console.log('🔄 Token expired or missing, re-authenticating...');
                if (!(await this.authenticate())) {
                    console.log('❌ Failed to authenticate, returning empty product list');
                    return allProducts;
                }
            }

            while (hasNext) {
                console.log(`📄 Fetching page ${currentPage}...`);

                const query = `{
                    listProduct(pagination: { page: ${currentPage}, limit: 100 }) {
                        count
                        data {
                            id
                            name
                            description
                            shortDescription
                            totalStock
                            variants {
                                id
                                sku
                                barcodeList
                                isActive
                                prices {
                                    sellPrice
                                    currency
                                    currencyCode
                                }
                                stocks {
                                    stockCount
                                    stockLocationId
                                }
                            }
                        }
                        hasNext
                        page
                        limit
                    }
                }`;

                const graphqlRequest = { query };
                const jsonContent = JSON.stringify(graphqlRequest);
                const graphqlUrl = 'https://api.myikas.com/api/v1/admin/graphql';

                const response = await fetch(graphqlUrl, {
                    method: 'POST',
                    body: jsonContent,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.config.accessToken}`,
                    },
                });

                const responseContent = await response.json();

                if (response.ok) {
                    console.log(`✅ Page ${currentPage} request successful!`);

                    if (responseContent.data?.listProduct?.data) {
                        const products = responseContent.data.listProduct.data;
                        console.log(`📦 Found ${products.length} products on page ${currentPage}`);

                        if (responseContent.data.listProduct.count) {
                            console.log(`📊 Total products available: ${responseContent.data.listProduct.count}`);
                        }

                        hasNext = responseContent.data.listProduct.hasNext || false;

                        for (const productElement of products) {
                            const product = this.parseGraphQLProduct(productElement);
                            if (product) {
                                console.log(`✅ Parsed product: ${product.name} (ID: ${product.id})`);
                                allProducts.push(product);
                            }
                        }

                        currentPage++;
                    } else {
                        console.log(`❌ Unexpected response structure on page ${currentPage}`);
                        hasNext = false;
                    }
                } else {
                    console.log(`❌ Page ${currentPage} request failed: ${response.status}`);
                    hasNext = false;
                }

                // Small delay between requests to be respectful
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.log(`❌ Error getting products: ${error.message}`);
            console.log(`❌ Stack trace: ${error.stack}`);
        }

        console.log(`📦 Retrieved ${allProducts.length} products from GraphQL API`);
        return allProducts;
    }

    /**
     * Parse a GraphQL product response into a standardized format
     */
    parseGraphQLProduct(productNode) {
        try {
            const product = {
                id: '',
                name: '',
                description: '',
                shortDescription: '',
                sku: '',
                barcode: '',
                price: 0,
                stockQuantity: 0,
                brand: { name: 'YesilGrow' },
                slug: '',
                status: 'active',
                images: [],
            };

            // Get basic product info
            if (productNode.id) {
                product.id = productNode.id;
            }

            if (productNode.name) {
                product.name = productNode.name;
            }

            // Get description fields
            if (productNode.description) {
                product.description = productNode.description;
                console.log(`📝 Description found for ${productNode.name}: ${productNode.description.substring(0, 100)}...`);
            }

            if (productNode.shortDescription) {
                product.shortDescription = productNode.shortDescription;
                console.log(`📝 Short description found for ${productNode.name}: ${productNode.shortDescription.substring(0, 100)}...`);
            }

            // Get brand info
            if (productNode.brand?.name) {
                product.brand = { name: productNode.brand.name };
            } else {
                product.brand = { name: 'YesilGrow' };
            }

            // Get variants info for barcode, price, and stock
            if (productNode.variants && productNode.variants.length > 0) {
                // Use first active variant
                let activeVariant = null;
                for (const variant of productNode.variants) {
                    if (variant.isActive) {
                        activeVariant = variant;
                        break;
                    }
                }

                // If no active variant found, use first variant
                if (!activeVariant && productNode.variants.length > 0) {
                    activeVariant = productNode.variants[0];
                }

                if (activeVariant) {
                    // Get SKU
                    product.sku = activeVariant.sku || product.id;

                    // Get barcode from barcodeList
                    if (activeVariant.barcodeList && activeVariant.barcodeList.length > 0) {
                        product.barcode = activeVariant.barcodeList[0] || product.id;
                    } else {
                        product.barcode = product.id;
                    }

                    // Get price from prices array
                    if (activeVariant.prices && activeVariant.prices.length > 0) {
                        const firstPrice = activeVariant.prices[0];
                        product.price = firstPrice.sellPrice || 0;
                    } else {
                        product.price = 0;
                    }

                    // Get stock from stocks array
                    if (activeVariant.stocks && activeVariant.stocks.length > 0) {
                        let totalVariantStock = 0;
                        for (const stockItem of activeVariant.stocks) {
                            totalVariantStock += stockItem.stockCount || 0;
                        }
                        product.stockQuantity = totalVariantStock;
                    } else {
                        product.stockQuantity = 0;
                    }


                } else {
                    // No variants found, use defaults
                    product.sku = product.id;
                    product.barcode = product.id;
                    product.price = 0;
                    product.stockQuantity = 0;
                }
            } else {
                // No variants, use product ID as fallback
                product.sku = product.id;
                product.barcode = product.id;
                product.price = 0;
                product.stockQuantity = 0;
            }

            // Fallback to totalStock if variant stock is 0
            if (productNode.totalStock && product.stockQuantity === 0) {
                product.stockQuantity = productNode.totalStock;
            }

            // Set default values for missing fields
            product.slug = product.name.toLowerCase().replace(/\s+/g, '-');
            product.status = 'active';

            return product;
        } catch (error) {
            console.log(`❌ Error parsing product: ${error.message}`);
            return null;
        }
    }
}

/**
 * YesilGrow specific API service
 */
export class YesilGrowApiService {
    constructor() {
        // IKAS credentials for YesilGrow
        const config = {
            clientId: '3bc76118-fdad-421e-b62c-3ddf1bce1637',
            clientSecret: 's_Lum7Zovyq8FfJmqWYq1UXnE70f56d280ac1a4cb1a6bf9ffb09817099',
            baseUrl: 'https://yesilgrow.myikas.com/api',
        };

        this.ikasService = new IkasApiService(config.clientId, config.clientSecret, config.baseUrl);
    }

    /**
     * Get all products from YesilGrow
     */
    async getAllProducts() {
        return this.ikasService.getAllProducts();
    }

    /**
     * Get products and convert to a more usable format with vendor metadata
     */
    async getProductsWithVendorInfo() {
        const ikasProducts = await this.ikasService.getAllProducts();
        const vendorProducts = [];

        for (const ikasProduct of ikasProducts) {
            // Skip inactive products
            if (ikasProduct.status !== 'active') {
                continue;
            }

            const vendorProduct = {
                vendorId: 'yesilgrow',
                vendorName: 'YesilGrow',
                vendorProductId: ikasProduct.id,
                name: ikasProduct.name,
                description: ikasProduct.description || '',
                shortDescription: ikasProduct.shortDescription || '',
                sku: ikasProduct.sku,
                barcode: ikasProduct.barcode,
                price: ikasProduct.price,
                stock: ikasProduct.stockQuantity,
                brand: ikasProduct.brand?.name || 'YesilGrow',
                slug: ikasProduct.slug,
                images: ikasProduct.images || [],
                originalData: ikasProduct, // Keep original data for reference
            };

            vendorProducts.push(vendorProduct);
        }

        return vendorProducts;
    }
}

/**
 * Factory function to create IKAS services for different vendors
 */
export const createIkasService = (vendorConfig) => {
    return new IkasApiService(
        vendorConfig.clientId,
        vendorConfig.clientSecret,
        vendorConfig.baseUrl
    );
};

/**
 * Pre-configured vendor services
 */
export const vendorServices = {
    yesilgrow: new YesilGrowApiService(),
};
