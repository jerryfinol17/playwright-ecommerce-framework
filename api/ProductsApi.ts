import { APIRequestContext } from '@playwright/test';
import { BaseApi, ApiResponse } from './BaseApi';
import {
    Product,
    ProductsResponse,
    BrandsResponse,
    Brand,
} from './types/api.types';

export class ProductsApi extends BaseApi {

    constructor(request: APIRequestContext) {
        super(request);
    }

    // ==================== PRODUCTS ====================

    /**
     * GET /productsList
     * Returns all products. Only GET is supported.
     */
    async getAllProducts(): Promise<ApiResponse<ProductsResponse>> {
        return this.get<ProductsResponse>('/productsList');
    }

    /**
     * POST /productsList — expects 405 (method not supported)
     */
    async postProductsList(): Promise<ApiResponse> {
        return this.post('/productsList', {});
    }

    // ==================== BRANDS ====================

    /**
     * GET /brandsList
     * Returns all brands. PUT is not supported.
     */
    async getAllBrands(): Promise<ApiResponse<BrandsResponse>> {
        return this.get<BrandsResponse>('/brandsList');
    }

    /**
     * PUT /brandsList — expects 405 (method not supported)
     */
    async putBrandsList(): Promise<ApiResponse> {
        return this.put('/brandsList', {});
    }

    // ==================== SEARCH ====================

    /**
     * POST /searchProduct
     * @param searchTerm  e.g. 'top', 'tshirt', 'jean'
     */
    async searchProduct(searchTerm: string): Promise<ApiResponse<ProductsResponse>> {
        return this.post<ProductsResponse>('/searchProduct', {
            search_product: searchTerm,
        });
    }

    /**
     * POST /searchProduct without parameter — expects 400
     */
    async searchProductWithoutParam(): Promise<ApiResponse> {
        return this.post('/searchProduct', {});
    }

    // ==================== CONVENIENCE HELPERS ====================

    /**
     * Returns a specific product by name (case-insensitive).
     * Throws if not found.
     */
    async getProductByName(name: string): Promise<Product> {
        const response = await this.getAllProducts();
        const product  = response.data.products?.find(
            (p) => p.name.toLowerCase() === name.toLowerCase()
        );
        if (!product) {
            throw new Error(`Product "${name}" not found in products list.`);
        }
        return product;
    }

    /**
     * Returns all products from a specific brand (case-insensitive).
     */
    async getProductsByBrand(brand: string): Promise<Product[]> {
        const response = await this.getAllProducts();
        return response.data.products?.filter(
            (p) => p.brand.toLowerCase() === brand.toLowerCase()
        ) ?? [];
    }

    /**
     * Returns a specific brand by name.
     */
    async getBrandByName(name: string): Promise<Brand> {
        const response = await this.getAllBrands();
        const brand    = response.data.brands?.find(
            (b) => b.brand.toLowerCase() === name.toLowerCase()
        );
        if (!brand) {
            throw new Error(`Brand "${name}" not found in brands list.`);
        }
        return brand;
    }
}
