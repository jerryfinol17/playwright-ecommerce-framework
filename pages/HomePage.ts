import { Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";
import { BASE_URL } from "./config";

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ==================== HEADER ====================
    private readonly signupLoginLink   = this.page.getByRole('link', { name: ' Signup / Login' });
    private readonly productsLink      = this.page.getByRole('link', { name: ' Products' });
    private readonly cartLink          = this.page.getByRole('link', { name: ' Cart' });
    private readonly contactUsLink     = this.page.getByRole('link', { name: ' Contact us' });
    private readonly homeLink          = this.page.getByRole('link', { name: ' Home' });


    private readonly womenCategory = this.page.locator('a[href="#Women"][data-toggle="collapse"]');
    private readonly menCategory   = this.page.locator('a[href="#Men"][data-toggle="collapse"]');
    private readonly kidsCategory  = this.page.locator('a[href="#Kids"][data-toggle="collapse"]');

    // ==================== HEADER ACTIONS ====================
    async start() {
        await super.goto(BASE_URL);
    }

    async isOnHomePage(): Promise<boolean> {
        return this.assertCurrentUrlContain(BASE_URL);
    }

    async goToSignUpLogin(): Promise<void> {
        await this.clickElement(this.signupLoginLink);
    }

    async goToProducts(): Promise<void> {
        await this.clickElement(this.productsLink);
    }

    async goToCart(): Promise<void> {
        await this.clickElement(this.cartLink);
    }

    async goToContactUs(): Promise<void> {
        await this.clickElement(this.contactUsLink);
    }


    async gotoHome(): Promise<void> {
        await this.clickElement(this.homeLink);
    }

    // ==================== CATEGORIES ACTIONS ====================

    private async clickCategoryWithRetry(
        categoryLink: import('@playwright/test').Locator,
        panelSelector: string,
        maxAttempts = 4
    ): Promise<void> {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {

            await categoryLink.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);

            await categoryLink.click({ force: true });

            try {
                await this.page.locator(panelSelector).waitFor({ state: 'visible', timeout: 4000 });
                return;
            } catch {
                if (attempt === maxAttempts) {
                    throw new Error(
                        `Category panel "${panelSelector}" no se abrió después de ${maxAttempts} intentos`
                    );
                }
                await this.page.waitForTimeout(500);
            }
        }
    }

    async clickWomenCategory(): Promise<void> {
        await this.clickCategoryWithRetry(this.womenCategory, '#Women .panel-body');
    }

    async clickMenCategory(): Promise<void> {
        await this.clickCategoryWithRetry(this.menCategory, '#Men .panel-body');
    }

    async clickKidsCategory(): Promise<void> {
        await this.clickCategoryWithRetry(this.kidsCategory, '#Kids .panel-body');
    }

    // ==================== CATEGORIES ASSERTIONS ====================
    async isCategoryExpanded(category: 'Women' | 'Men' | 'Kids'): Promise<boolean> {
        let locator = '';
        if (category === 'Women') locator = '#Women .panel-body';
        if (category === 'Men')   locator = '#Men .panel-body';
        if (category === 'Kids')  locator = '#Kids .panel-body';
        return await this.page.locator(locator).isVisible();
    }

    async assertOnlyOneCategoryExpanded(expandedCategory: 'Women' | 'Men' | 'Kids'): Promise<void> {
        const categories = {
            Women: this.page.locator('#Women .panel-body'),
            Men:   this.page.locator('#Men .panel-body'),
            Kids:  this.page.locator('#Kids .panel-body'),
        };
        await expect(categories[expandedCategory]).toBeVisible();
        for (const [cat, locator] of Object.entries(categories)) {
            if (cat !== expandedCategory) {
                await expect(locator).toBeHidden();
            }
        }
    }
}