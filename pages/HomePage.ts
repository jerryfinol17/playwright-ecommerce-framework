import { Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";
import { BASE_URL } from "./config";

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ==================== HEADER ====================
    private readonly signupLoginLink = this.page.locator('#header a[href="/login"]');
    private readonly productsLink    = this.page.locator('#header a[href="/products"]');
    private readonly cartLink        = this.page.locator('#header a[href="/view_cart"]');
    private readonly contactUsLink   = this.page.locator('#header a[href="/contact_us"]');
    private readonly homeLink        = this.page.locator('#header a[href="/"]').first();
    private readonly testCases       = this.page.locator('#header a[href="/test_cases"]');

    private readonly womenCategory = this.page.locator('a[href="#Women"][data-toggle="collapse"]');
    private readonly menCategory   = this.page.locator('a[href="#Men"][data-toggle="collapse"]');
    private readonly kidsCategory  = this.page.locator('a[href="#Kids"][data-toggle="collapse"]');

    // ================= FOOTER =============================
    private readonly newsletterEmail     = this.page.getByRole('textbox', { name: 'Your email address' });
    private readonly subscribeButton     = this.page.locator('#subscribe');
    private readonly subscribeSuccessMsg = this.page.getByText('You have been successfully');

    // ==================== CONTACT US ====================
    private readonly contactUsGetInTouchTitle = this.page.getByRole('heading', { name: 'Get In Touch' });
    private readonly contactUsName            = this.page.getByRole('textbox', { name: 'Name' });
    private readonly contactUsEmail           = this.page.getByRole('textbox', { name: 'Email', exact: true });
    private readonly contactUsSubject         = this.page.getByRole('textbox', { name: 'Subject' });
    private readonly contactUsMessage         = this.page.getByRole('textbox', { name: 'Your Message Here' });
    private readonly contactUsFileUpload      = this.page.getByRole('button', { name: 'Choose File' });
    private readonly contactUsSubmitBtn       = this.page.getByRole('button', { name: 'Submit' });
    private readonly contactUsSuccessMsg      = this.page.locator('#contact-page').getByText('Success! Your details have');
    private readonly contactUsHomeLink = this.page.locator('#contact-page').getByRole('link', { name: ' Home' });


    // ==================== HEADER ACTIONS ====================
    async start() {
        await super.goto(BASE_URL);
    }

    async isOnHomePage(): Promise<boolean> {
        return this.assertCurrentUrlContain(BASE_URL);
    }

    async goToSignUpLogin(): Promise<void> {
        await this.clickAndNavigateTo(this.signupLoginLink, '**/login**');
    }

    async goToProducts(): Promise<void> {
        await this.clickAndNavigateTo(this.productsLink, '**/products**');
    }

    async goToCart(): Promise<void> {
        await this.clickAndNavigateTo(this.cartLink, '**/view_cart**');
    }

    async goToContactUs(): Promise<void> {
        await this.clickAndNavigateTo(this.contactUsLink, '**/contact_us**');
    }

    async gotoHome(): Promise<void> {
        await this.clickAndNavigateTo(this.homeLink, BASE_URL);
    }

    async gotoTestCases(): Promise<void> {
        await this.clickAndNavigateTo(this.testCases, '**/test_cases**');
    }

    async isOnTestCasesPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('test_cases');
    }

    private readonly loggedInAs = this.page.locator('#header').getByText(/Logged in as/i);

    async isLoggedIn(): Promise<boolean> {
        try {
            await this.loggedInAs.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
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
    // ==================== SUBCATEGORIES ====================
    private getCategoryLink(category: 'Women' | 'Men' | 'Kids') {
        const map = {
            Women: this.womenCategory,
            Men:   this.menCategory,
            Kids:  this.kidsCategory,
        };
        return map[category];
    }

    private getSubCategoryLink(name: string) {
        return this.page.getByRole('link', { name });
    }

    private getCategoryPageHeading(heading: string) {
        return this.page.getByRole('heading', { name: heading });
    }

    async clickSubCategory(
        category: 'Women' | 'Men' | 'Kids',
        subCategory: string
    ): Promise<void> {
        await this.clickCategoryWithRetry(
            this.getCategoryLink(category),
            `#${category} .panel-body`
        );
        await this.clickElement(this.getSubCategoryLink(subCategory));
        await this.waitForPageLoad();
    }

    async isCategoryPageHeadingVisible(heading: string): Promise<boolean> {
        try {
            await this.getCategoryPageHeading(heading)
                .waitFor({ state: 'visible', timeout: 8000 });
            return true;
        } catch {
            return false;
        }
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
    async subscribeToNewsletter(email: string): Promise<void> {
        await this.newsletterEmail.fill(email);
        await this.subscribeButton.click();
    }

    async isSubscribeSuccessVisible(): Promise<boolean> {
        try {
            await this.subscribeSuccessMsg.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
    async fillContactForm(
        name: string,
        email: string,
        subject: string,
        message: string,
        filePath: string
    ): Promise<void> {
        await this.waitForVisible(this.contactUsGetInTouchTitle);
        await this.contactUsName.fill(name);
        await this.contactUsEmail.fill(email);
        await this.contactUsSubject.fill(subject);
        await this.contactUsMessage.fill(message);
        await this.contactUsFileUpload.setInputFiles(filePath);
    }

    async submitContactForm(): Promise<void> {
        this.page.once('dialog', dialog => dialog.accept());
        await this.waitForVisible(this.contactUsSubmitBtn);
        await this.isVisible(this.contactUsSubmitBtn);
        await this.clickElement(this.contactUsSubmitBtn);
    }

    async isContactSuccessVisible(): Promise<boolean> {
        try {
            await this.contactUsSuccessMsg.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async goHomeFromContact(): Promise<void> {
        await this.waitForVisible(this.contactUsLink)
        await this.isVisible(this.contactUsLink)
        await this.clickAndNavigateTo(this.contactUsHomeLink, BASE_URL);
    }
}