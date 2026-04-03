import {Page, expect} from '@playwright/test'
import {BasePage} from "./BasePage";
import {BASE_URL} from "./config"

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ==================== HEADER ====================
    private readonly signupLoginLink = this.page.getByRole('link', { name: ' Signup / Login' });
    private readonly productsLink    = this.page.getByRole('link', { name: ' Products' });
    private readonly cartLink        = this.page.getByRole('link', { name: ' Cart' });
    private readonly contactUsLink   = this.page.getByRole('link', { name: ' Contact us' });
    private readonly deleteAccountLink = this.page.getByRole('link', { name: ' Delete Account' });


    // ==================== CATEGORIES ====================
    private readonly womenCategory = this.page.getByRole('link', { name: ' Women' });
    private readonly menCategory   = this.page.getByRole('link', { name: ' Men' });
    private readonly kidsCategory  = this.page.getByRole('link', { name: ' Kids' });

    // ==================== MODALS / POPUPS ====================
    private readonly continueShoppingBtn = this.page.getByRole('button', { name: 'Continue Shopping' });

    // =========HEADER ACTIONS====================
   async start(){
       await super.goto(BASE_URL)
   }
   async isOnHomePage(): Promise<boolean>{
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
   async deleteAccount(): Promise<void> {
       await this.clickElement(this.deleteAccountLink);
   }
   //======== CATEGORIES ACTIONS ==================
    async clickWomenCategory(): Promise<void> {
       await this.clickElement(this.womenCategory);
    }
    async clickMenCategory(): Promise<void> {
       await this.clickElement(this.menCategory);
    }
    async clickKidsCategory(): Promise<void> {
       await this.clickElement(this.kidsCategory);
    }
    // =======CATEGORIES ASSERTIONS =======================
    async isCategoryExpanded(category: 'Women' | 'Men' | 'Kids'): Promise<boolean> {
       let locator = '';
       if(category === 'Women') locator = '#Women .panel-body';
       if(category === 'Men') locator = '#Men .panel-body';
       if(category === 'Kids') locator = '#Kids .panel-body';
       return await this.page.locator(locator).isVisible();
       }
    async assertOnlyOneCategoryExpanded(expandedCategory: 'Women' | 'Men' | 'Kids'): Promise<void> {
        const categories ={
            Women: this.page.locator('#Women .panel-body'),
            Men: this.page.locator('#Men .panel-body'),
            Kids: this.page.locator('#Kids .panel-body'),
        }
        await expect(categories[expandedCategory]).toBeVisible();
        for (const [cat, locator] of Object.entries(categories)) {
            if(cat !== expandedCategory) {
                await expect(locator).toBeHidden()
            }
        }
    }


    //========= INVENTORY ACTIONS===============================

    async addToCart(productName: string): Promise<void> {
        const productCard = this.page.locator('.productinfo').filter({ hasText: productName }).first();
        await productCard.hover();
        await productCard.locator('a.add-to-cart').click();
    }
    async isContinueBtnVisible(): Promise<boolean> {
        try {
            await this.continueShoppingBtn.waitFor({ state: 'visible', timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }
    async continueShopping(): Promise<void> {
       await this.clickElement(this.continueShoppingBtn);
    }
}