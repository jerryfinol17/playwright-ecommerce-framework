import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ==================== LOCATORS FIJOS ====================
    private readonly quantityInput       = this.page.locator('#quantity');
    private readonly addToCartButton     = this.page.getByRole('button', { name: ' Add to cart' });
    private readonly continueShoppingBtn = this.page.getByRole('button', { name: 'Continue Shopping' });

    // Review section
    private readonly reviewNameInput    = this.page.getByRole('textbox', { name: 'Your Name' });
    private readonly reviewEmailInput   = this.page.getByRole('textbox', { name: 'Email Address', exact: true });
    private readonly reviewTextArea     = this.page.getByRole('textbox', { name: 'Add Review Here!' });
    private readonly submitReviewButton = this.page.getByRole('button', { name: 'Submit' });
    private readonly successMsg = this.page.getByText('Thank you for your review.')

    // ==================== PRODUCT DETAIL LOCATORS ====================
    private readonly productTitle     = this.page.locator('.product-information h2');
    private readonly productPrice     = this.page.locator('.product-information span span');

    private readonly brandText        = this.page.locator('.product-information p').filter({ hasText: 'Brand' });
    private readonly availabilityText = this.page.locator('.product-information p').filter({ hasText: 'Availability' });
    private readonly conditionText    = this.page.locator('.product-information p').filter({ hasText: 'Condition' });

    // ==================== SEARCH LOCATORS ====================
    private readonly searchInput  = this.page.locator('#search_product');
    private readonly viewProduct = this.page.getByRole('link', { name: ' View Product' })
    private readonly searchButton = this.page.locator('#submit_search')
    // ==================== NAVEGACIÓN ====================

    async isOnProductPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('products');
    }

    async goToProductByName(productName: string): Promise<void> {
        const viewProductLink = this.page.locator('.product-image-wrapper')
            .filter({ hasText: productName })
            .locator('a[href*="product_details"]')
            .first();

        await viewProductLink.waitFor({ state: 'visible', timeout: 10000 });
        await viewProductLink.click();
    }

    // ==================== LISTA DE PRODUCTOS ====================

    async getAllProductNames(): Promise<string[]> {
        const names = await this.page.locator('.productinfo p').allInnerTexts();
        return names.map(name => name.trim()).filter(Boolean);
    }

    async getAllProductPrices(): Promise<string[]> {
        const prices = await this.page.locator('.productinfo h2').allInnerTexts();
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
        await this.fillInput(this.searchInput, productName);
        await this.page.waitForTimeout(300);
        await this.clickAndWaitForNavigation(this.searchButton)
        await this.page.locator('h2.title.text-center', { hasText: 'Searched Products' })
            .waitFor({ state: 'visible', timeout: 15000 });
    }
    async getSearchResultNames(): Promise<string[]> {

        const names = await this.page.locator('.productinfo p').allInnerTexts();
        return names.map(n => n.trim()).filter(Boolean);
    }

    async goToProduct(): Promise<void>{
        await this.clickElement(this.viewProduct);
    }
    async addSearchResultToCart(): Promise<void> {
        const productCard = this.page.locator('.features_items .productinfo').first();
        await productCard.hover();
        await productCard.locator('a.add-to-cart').click();
        await this.continueShoppingBtn.waitFor({ state: 'visible', timeout: 15000 });
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
        await this.clickElement(this.addToCartButton, {force: true, timeout: 15000});
        await this.continueShoppingBtn.waitFor({ state: 'visible', timeout: 15000 });
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.continueShoppingBtn.click({ force: true, timeout: 15000 });
        await this.continueShoppingBtn.waitFor({ state: 'hidden', timeout: 8000 });
    }

    async isContinueBtnVisible(): Promise<boolean> {
        try {
            await this.continueShoppingBtn.waitFor({ state: 'visible', timeout: 15000 });
            return true;
        } catch {
            return false;
        }
    }

    // ==================== REVIEWS ====================

    async submitReview(name: string, email: string, reviewText: string): Promise<void> {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextArea.fill(reviewText);
        await this.clickElement(this.submitReviewButton);
    }
    async verifySuccessMsg():Promise<boolean>{
        try {
            await this.successMsg.waitFor({ state: 'visible', timeout: 15000 });
            return true;
        } catch {
            return false;
        }
    }
    // ==================== BRANDS ====================
    private readonly brandsHeading = this.page.getByRole('heading', { name: 'Brands' });

    private getBrandLink(brandName: string) {
        return this.page.getByRole('link', { name: new RegExp(brandName, 'i') });
    }

    private getBrandPageHeading(brandName: string) {
        return this.page.getByRole('heading', { name: new RegExp(`Brand - ${brandName}`, 'i') });
    }

    async isBrandsSidebarVisible(): Promise<boolean> {
        try {
            await this.brandsHeading.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async clickBrand(brandName: string): Promise<void> {
        await this.clickElement(this.getBrandLink(brandName));
        await this.waitForPageLoad();
    }

    async isBrandPageVisible(brandName: string): Promise<boolean> {
        try {
            await this.getBrandPageHeading(brandName)
                .waitFor({ state: 'visible', timeout: 8000 });
            return true;
        } catch {
            return false;
        }
    }
}