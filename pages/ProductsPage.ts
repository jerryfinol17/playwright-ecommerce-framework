import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ==================== LOCATORS FIJOS ====================
    private readonly quantityInput       = this.page.locator('#quantity');
    private readonly addToCartButton     = this.page.getByRole('button', { name: ' Add to cart' })
    private readonly continueShoppingBtn = this.page.getByRole('button', { name: 'Continue Shopping' });

    // Review section
    private readonly reviewNameInput    = this.page.getByRole('textbox', { name: 'Your Name' });
    private readonly reviewEmailInput   = this.page.getByRole('textbox', { name: 'Email Address', exact: true });
    private readonly reviewTextArea     = this.page.getByRole('textbox', { name: 'Add Review Here!' });
    private readonly submitReviewButton = this.page.getByRole('button', { name: 'Submit' });

    // ==================== PRODUCT DETAIL LOCATORS ====================
    private readonly productTitle     = this.page.locator('.product-information h2');
    private readonly productPrice     = this.page.locator('.product-information span span'); // ✅ corregido

    private readonly brandText        = this.page.locator('.product-information p').filter({ hasText: 'Brand' });
    private readonly availabilityText = this.page.locator('.product-information p').filter({ hasText: 'Availability' });
    private readonly conditionText    = this.page.locator('.product-information p').filter({ hasText: 'Condition' });

    // ==================== SEARCH LOCATORS ====================
    private readonly searchInput  = this.page.locator('#search_product');
    private readonly searchButton = this.page.locator('#submit_search');

    // ==================== NAVEGACIÓN ====================

    async isOnProductPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('products');
    }

    async goToProductByName(productName: string): Promise<void> {
        const viewProductLink = this.page.locator('.product-image-wrapper')
            .filter({hasText: productName})
            .locator('a[href*="product_details"]')
            .first();

        await viewProductLink.waitFor({state: 'visible', timeout: 10000});
        await viewProductLink.click();
    }
    // ==================== LISTA DE PRODUCTOS ====================

    async getAllProductNames(): Promise<string[]> {
        const names = await this.page.locator('.productinfo p').allInnerTexts(); // ✅ corregido
        return names.map(name => name.trim()).filter(Boolean);
    }

    async getAllProductPrices(): Promise<string[]> {
        const prices = await this.page.locator('.productinfo h2').allInnerTexts(); // ✅ h2 son los precios
        return prices.map(price => price.trim()).filter(Boolean);
    }

    async addToCartByName(productName: string): Promise<void> {
        const productCard = this.page.locator('.productinfo')
            .filter({ hasText: productName })
            .first();

        await productCard.hover();
        await productCard.locator('a.add-to-cart').click();
    }

    // ==================== BÚSQUEDA ====================

    async searchProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    async getSearchResultNames(): Promise<string[]> {
        const names = await this.page.locator('.productinfo p').allInnerTexts(); // ✅ corregido
        return names.map(n => n.trim()).filter(Boolean);
    }

    // ==================== DETALLE DE PRODUCTO ====================

    async getProductTitle(): Promise<string> {
        return await this.productTitle.innerText();
    }

    async getProductPrice(): Promise<string> {
        return await this.productPrice.innerText();
    }

    async getBrand(): Promise<string> {
        const text = await this.brandText.innerText();
        return text.replace('Brand:', '').trim();
    }

    async getAvailability(): Promise<string> {
        const text = await this.availabilityText.innerText();
        return text.replace('Availability:', '').trim();
    }

    async getCondition(): Promise<string> {
        const text = await this.conditionText.innerText();
        return text.replace('Condition:', '').trim();
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.quantityInput.fill(quantity.toString());
    }

    async addToCart(): Promise<void> {
        await this.clickElement(this.addToCartButton);
    }

    async continueShopping(): Promise<void> {
        await this.clickElement(this.continueShoppingBtn);
    }

    // ==================== REVIEWS ====================

    async submitReview(name: string, email: string, reviewText: string): Promise<void> {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextArea.fill(reviewText);
        await this.clickElement(this.submitReviewButton);
    }
}