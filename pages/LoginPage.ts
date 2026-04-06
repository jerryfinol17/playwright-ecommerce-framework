import { Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export interface AccountCreationData {
    title: 'Mr.' | 'Mrs.';
    password: string;
    day: string;
    month: string;
    year: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;
    newsletter?: boolean;
    specialOffers?: boolean;
}

export class LoginPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ==================== LOCATORS ====================
    // Login
    private readonly loginEmail    = this.page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
    private readonly loginPassword = this.page.getByRole('textbox', { name: 'Password' });
    private readonly loginButton   = this.page.getByRole('button', { name: 'Login' });

    // Signup inicial
    private readonly signupName   = this.page.getByRole('textbox', { name: 'Name' });
    private readonly signupEmail  = this.page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    private readonly signupButton = this.page.getByRole('button', { name: 'Signup' });

    // Post-creación
    private readonly createAccountButton = this.page.getByRole('button', { name: 'Create Account' });
    private readonly continueButton      = this.page.getByRole('link', { name: 'Continue' });

    // Errores
    private readonly loginErrorMsg  = this.page.getByText('Your email or password is incorrect!');
    private readonly signupErrorMsg = this.page.getByText('Email Address already exist!');

    // ==================== URL ASSERTIONS ====================
    async isOnLoginPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('login');
    }

    async isOnSingUpPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('signup');
    }

    async isOnCreatedPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('account_created');
    }

    // ==================== LOGIN ====================
    async loginWithExistingUser(email: string, password: string): Promise<void> {
        await this.loginEmail.fill(email);
        await this.loginPassword.fill(password);
        await this.loginButton.click();
    }

    async expectLoginError(): Promise<boolean> {
        try {
            await this.loginErrorMsg.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch {
            return false;
        }
    }

    // ==================== SIGNUP INICIAL ====================
    async signupNewUser(name: string, email: string): Promise<void> {
        await this.signupName.fill(name);
        await this.signupEmail.fill(email);
        await this.signupButton.click();
    }

    async expectSignupError(): Promise<boolean> {
        try {
            await this.signupErrorMsg.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch {
            return false;
        }
    }

    // ==================== FORMULARIO DE CUENTA ====================
    async fillAccountCreationForm(data: AccountCreationData): Promise<void> {
        await this.page.getByRole('radio', { name: data.title }).check();

        await this.page.getByRole('textbox', { name: 'Password *' }).fill(data.password);
        await this.page.locator('#days').selectOption(data.day);
        await this.page.locator('#months').selectOption(data.month);
        await this.page.locator('#years').selectOption(data.year);

        if (data.newsletter) {
            await this.page.getByRole('checkbox', { name: /newsletter/i }).check();
        }
        if (data.specialOffers) {
            await this.page.getByRole('checkbox', { name: /special offers/i }).check();
        }

        await this.page.getByRole('textbox', { name: 'First name *' }).fill(data.firstName);
        await this.page.getByRole('textbox', { name: 'Last name *' }).fill(data.lastName);
        if (data.company) {
            await this.page.getByRole('textbox', { name: 'Company', exact: true }).fill(data.company);
        }
        await this.page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(data.address1);
        if (data.address2) {
            await this.page.getByRole('textbox', { name: 'Address 2' }).fill(data.address2);
        }
        await this.page.getByLabel('Country *').selectOption(data.country);
        await this.page.getByRole('textbox', { name: 'State *' }).fill(data.state);
        await this.page.getByRole('textbox', { name: 'City * Zipcode *' }).fill(data.city);
        await this.page.locator('#zipcode').fill(data.zipcode);
        await this.page.getByRole('textbox', { name: 'Mobile Number *' }).fill(data.mobile);
    }

    // ==================== SMOKE TEST — FORM VACÍO ====================
    async expectEmptyFormDoesNotSubmit(): Promise<boolean> {
        await this.createAccountButton.click();
        return (await this.isOnSingUpPage());
    }

    // ==================== CREAR CUENTA ====================
    async clickCreateAccount(): Promise<void> {
        await this.createAccountButton.click();
    }

    async expectAccountCreatedSuccess(): Promise<boolean> {
        try {
            await this.page.getByText('Account Created!').waitFor({ state: 'visible', timeout: 10000 });
            await this.page.getByText('Congratulations!').waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async clickContinueAfterAccountCreated(): Promise<void> {
        await this.continueButton.click();
    }

    // ==================== FLUJO COMPLETO ====================
    async createNewUserFullFlow(name: string, email: string, accountData: AccountCreationData): Promise<void> {
        await this.signupNewUser(name, email);
        expect(await this.isOnSingUpPage()).toBe(true);
        await this.fillAccountCreationForm(accountData);
        await this.clickCreateAccount();
        expect(await this.isOnCreatedPage()).toBe(true);
        expect(await this.expectAccountCreatedSuccess()).toBe(true);
        await this.clickContinueAfterAccountCreated();
    }
}