namespace grow_crawler.Services
{
    public interface IProductParser
    {
        Task<ProductDetail?> ParseProductDetailAsync(string url);
    }
}


namespace grow_crawler.Services
{
    public class IkasApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IkasApiConfig _config;

        public IkasApiService(HttpClient httpClient, IkasApiConfig config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<bool> AuthenticateAsync()
        {
            try
            {
                Console.WriteLine($"🔐 Attempting authentication with: {_config.BaseUrl}");
                var tokenUrl = $"{_config.BaseUrl}/admin/oauth/token";
                Console.WriteLine($"📡 Token URL: {tokenUrl}");

                var formData = new Dictionary<string, string>
                {
                    {"grant_type", "client_credentials"},
                    {"client_id", _config.ClientId},
                    {"client_secret", _config.ClientSecret}
                };

                var formContent = new FormUrlEncodedContent(formData);
                
                // Clear and set headers
                _httpClient.DefaultRequestHeaders.Clear();
                
                var response = await _httpClient.PostAsync(tokenUrl, formContent);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"✅ Authentication successful!");
                    Console.WriteLine($"📄 Token response: {responseContent}");
                    
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    
                    var tokenResponse = JsonSerializer.Deserialize<IkasTokenResponse>(responseContent, options);
                    
                    if (tokenResponse != null && !string.IsNullOrEmpty(tokenResponse.AccessToken))
                    {
                        _config.AccessToken = tokenResponse.AccessToken;
                        _config.TokenExpiresAt = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn - 60); // 1 minute buffer
                        
                        Console.WriteLine($"🎫 Token expires at: {_config.TokenExpiresAt}");
                        return true;
                    }
                }
                else
                {
                    Console.WriteLine($"❌ Authentication failed: {response.StatusCode}");
                    Console.WriteLine($"❌ Error response: {responseContent}");
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Authentication error: {ex.Message}");
                return false;
            }
        }

        public async Task<List<IkasProduct>> GetAllProductsAsync()
        {
            var allProducts = new List<IkasProduct>();
            int currentPage = 1;
            bool hasNext = true;
            
            try
            {
                // Check if we need to authenticate
                if (string.IsNullOrEmpty(_config.AccessToken) || DateTime.UtcNow >= _config.TokenExpiresAt)
                {
                    Console.WriteLine("🔄 Token expired or missing, re-authenticating...");
                    if (!await AuthenticateAsync())
                    {
                        Console.WriteLine("❌ Failed to authenticate, returning empty product list");
                        return allProducts;
                    }
                }

                while (hasNext)
                {
                    Console.WriteLine($"📄 Fetching page {currentPage}...");
                    
                    // Use GraphQL to get products with only confirmed fields
                    var query = $@"{{
                        listProduct(pagination: {{ page: {currentPage}, limit: 100 }}) {{
                            count
                            data {{
                                id
                                name
                                totalStock
                                variants {{
                                    id
                                    sku
                                    barcodeList
                                    isActive
                                    prices {{
                                        sellPrice
                                        currency
                                        currencyCode
                                    }}
                                    stocks {{
                                        stockCount
                                        stockLocationId
                                    }}
                                }}
                            }}
                            hasNext
                            page
                            limit
                        }}
                    }}";

                    var graphqlRequest = new
                    {
                        query = query
                    };

                    var jsonContent = JsonSerializer.Serialize(graphqlRequest);
                    var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                    // Set headers for GraphQL request
                    _httpClient.DefaultRequestHeaders.Clear();
                    _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_config.AccessToken}");

                    // Use the main Ikas API endpoint for GraphQL
                    var graphqlUrl = "https://api.myikas.com/api/v1/admin/graphql";

                    var response = await _httpClient.PostAsync(graphqlUrl, content);
                    var responseContent = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"✅ Page {currentPage} request successful!");
                        
                        // Parse GraphQL response and convert to IkasProduct format
                        var graphqlResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
                        
                        if (graphqlResponse.TryGetProperty("data", out var data) &&
                            data.TryGetProperty("listProduct", out var listProduct) &&
                            listProduct.TryGetProperty("data", out var products))
                        {
                            Console.WriteLine($"📦 Found {products.GetArrayLength()} products on page {currentPage}");
                            
                            // Check pagination info
                            if (listProduct.TryGetProperty("count", out var totalCount))
                                Console.WriteLine($"📊 Total products available: {totalCount.GetInt32()}");
                            
                            if (listProduct.TryGetProperty("hasNext", out var hasNextElement))
                                hasNext = hasNextElement.GetBoolean();
                            else
                                hasNext = false;
                            
                            foreach (var productElement in products.EnumerateArray())
                            {
                                var product = ParseGraphQLProduct(productElement);
                                if (product != null)
                                {
                                    Console.WriteLine($"✅ Parsed product: {product.Name} (ID: {product.Id})");
                                    allProducts.Add(product);
                                }
                            }
                            
                            currentPage++;
                        }
                        else
                        {
                            Console.WriteLine($"❌ Unexpected response structure on page {currentPage}: {responseContent}");
                            hasNext = false;
                        }
                    }
                    else
                    {
                        Console.WriteLine($"❌ Page {currentPage} request failed: {response.StatusCode}");
                        Console.WriteLine($"❌ Error response: {responseContent}");
                        hasNext = false;
                    }
                    
                    // Small delay between requests to be respectful
                    await Task.Delay(100);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error getting products: {ex.Message}");
                Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
            }

            Console.WriteLine($"📦 Retrieved {allProducts.Count} products from GraphQL API");
            return allProducts;
        }

        private IkasProduct? ParseGraphQLProduct(JsonElement productNode)
        {
            try
            {
                var product = new IkasProduct();
                
                // Get basic product info
                if (productNode.TryGetProperty("id", out var id))
                    product.Id = id.GetString() ?? "";
                
                if (productNode.TryGetProperty("name", out var name))
                    product.Name = name.GetString() ?? "";
                
                // Get brand info
                if (productNode.TryGetProperty("brand", out var brand) && 
                    brand.TryGetProperty("name", out var brandName))
                {
                    product.Brand = new IkasBrand { Name = brandName.GetString() ?? "YesilGrow" };
                }
                else
                {
                    product.Brand = new IkasBrand { Name = "YesilGrow" };
                }
                
                // Get variants info for barcode, price, and stock
                if (productNode.TryGetProperty("variants", out var variants) && variants.GetArrayLength() > 0)
                {
                    // Use first active variant
                    JsonElement? activeVariant = null;
                    foreach (var variant in variants.EnumerateArray())
                    {
                        if (variant.TryGetProperty("isActive", out var isActive) && isActive.GetBoolean())
                        {
                            activeVariant = variant;
                            break;
                        }
                    }
                    
                    // If no active variant found, use first variant
                    if (activeVariant == null && variants.GetArrayLength() > 0)
                    {
                        activeVariant = variants[0];
                    }
                    
                    if (activeVariant.HasValue)
                    {
                        var variantValue = activeVariant.Value;
                        
                        // Get SKU
                        if (variantValue.TryGetProperty("sku", out var sku))
                            product.Sku = sku.GetString() ?? product.Id;
                        else
                            product.Sku = product.Id;
                        
                        // Get barcode from barcodeList
                        if (variantValue.TryGetProperty("barcodeList", out var barcodeList) && 
                            barcodeList.ValueKind == JsonValueKind.Array && barcodeList.GetArrayLength() > 0)
                        {
                            product.Barcode = barcodeList[0].GetString() ?? product.Id;
                        }
                        else
                            product.Barcode = product.Id;
                        
                        // Get price from prices array
                        if (variantValue.TryGetProperty("prices", out var prices))
                        {
                            if (prices.ValueKind == JsonValueKind.Array && prices.GetArrayLength() > 0)
                            {
                                // Get sellPrice from first price
                                var firstPrice = prices[0];
                                if (firstPrice.TryGetProperty("sellPrice", out var sellPrice))
                                    product.Price = (decimal)sellPrice.GetDouble();
                                else
                                    product.Price = 0;
                            }
                            else
                                product.Price = 0;
                        }
                        else
                        {
                            product.Price = 0;
                        }
                        
                        // Get stock from stocks array
                        if (variantValue.TryGetProperty("stocks", out var stocks))
                        {
                            if (stocks.ValueKind == JsonValueKind.Array && stocks.GetArrayLength() > 0)
                            {
                                // Sum all stockCount values
                                int totalVariantStock = 0;
                                foreach (var stockItem in stocks.EnumerateArray())
                                {
                                    if (stockItem.TryGetProperty("stockCount", out var stockCount))
                                        totalVariantStock += (int)stockCount.GetDouble();
                                }
                                product.StockQuantity = totalVariantStock;
                            }
                            else
                                product.StockQuantity = 0;
                        }
                        else
                        {
                            product.StockQuantity = 0;
                        }
                    }
                    else
                    {
                        // No variants found, use defaults
                        product.Sku = product.Id;
                        product.Barcode = product.Id;
                        product.Price = 0;
                        product.StockQuantity = 0;
                    }
                }
                else
                {
                    // No variants, use product ID as fallback
                    product.Sku = product.Id;
                    product.Barcode = product.Id;
                    product.Price = 0;
                    product.StockQuantity = 0;
                }
                
                // Fallback to totalStock if variant stock is 0
                if (productNode.TryGetProperty("totalStock", out var totalStock))
                {
                    if (totalStock.ValueKind != JsonValueKind.Null && product.StockQuantity == 0)
                    {
                        product.StockQuantity = (int)totalStock.GetDouble();
                    }
                }
                
                // Set default values for missing fields
                product.Slug = product.Name.ToLowerInvariant().Replace(" ", "-");
                product.Status = "active";

                return product;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error parsing product: {ex.Message}");
                return null;
            }
        }
    }
}



using grow_crawler.Models;

namespace grow_crawler.Services
{
    public class YesilGrowParser : IProductParser
    {
        private readonly IkasApiService _ikasApiService;

        public YesilGrowParser(HttpClient httpClient)
        {
            var config = new IkasApiConfig
            {
                ClientId = "3bc76118-fdad-421e-b62c-3ddf1bce1637",
                ClientSecret = "s_Lum7Zovyq8FfJmqWYq1UXnE70f56d280ac1a4cb1a6bf9ffb09817099",
                BaseUrl = "https://yesilgrow.myikas.com/api"
            };

            _ikasApiService = new IkasApiService(httpClient, config);
        }

        public async Task<ProductDetail?> ParseProductDetailAsync(string url)
        {
            // For API-based integration, this method won't be used in the traditional way
            // Instead, we'll use GetAllProductsAsync method
            throw new NotImplementedException("YesilGrow uses API integration. Use YesilGrowApiCrawler instead.");
        }

        public async Task<List<ProductDetail>> GetAllProductsAsync()
        {
            var ikasProducts = await _ikasApiService.GetAllProductsAsync();
            var productDetails = new List<ProductDetail>();

            foreach (var ikasProduct in ikasProducts)
            {
                // Skip inactive products
                if (ikasProduct.Status != "active")
                {
                    continue;
                }

                var productDetail = new ProductDetail
                {
                    ProductName = ikasProduct.Name,
                    ProductPrice = ikasProduct.Price,
                    ProductPriceKDVIncluded = ikasProduct.Price, // Assuming price includes VAT
                    Barcode = !string.IsNullOrEmpty(ikasProduct.Barcode) ? ikasProduct.Barcode : ikasProduct.Sku,
                    Stock = ikasProduct.StockQuantity,
                    BrandName = ikasProduct.Brand?.Name ?? "YesilGrow"
                };

                productDetails.Add(productDetail);
            }

            return productDetails;
        }
    }
}