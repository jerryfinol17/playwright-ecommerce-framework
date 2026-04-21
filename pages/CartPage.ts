import { Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export interface CartItem {
    name: string;
    price: string;
    quantity: string;
    total: string;
}

export class CartPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ==================== LOCATORS ====================
    private readonly proceedToCheckoutButton = this.page.getByText('Proceed To Checkout').first();
    private readonly placeOrderButton        = this.page.getByRole('link', { name: 'Place Order' });
    private readonly emptyCartMessage        = this.page.getByText('Cart is empty! Click here to buy products.');
    private readonly orderComment            = this.page.locator('textarea[name="message"]');

    // Tabla del carrito
    private readonly cartTable  = this.page.locator('#cart_info_table');
    private readonly cartRows   = this.cartTable.locator('tbody tr');
    private readonly goToSingup = this.page.getByRole('link', { name: 'Register / Login' });

    // Payment
    private readonly nameOnCard       = this.page.locator('input[name="name_on_card"]');
    private readonly cardNumber       = this.page.locator('input[name="card_number"]');
    private readonly cvc              = this.page.getByRole('textbox', { name: 'ex.' });
    private readonly expiryMonth      = this.page.getByRole('textbox', { name: 'MM' });
    private readonly expiryYear       = this.page.getByRole('textbox', { name: 'YYYY' });
    private readonly payAndConfirmBtn = this.page.getByRole('button', { name: 'Pay and Confirm Order' });
    private readonly continueBtn      = this.page.getByRole('link', { name: 'Continue', exact: true });

    // ==================== URL ASSERTIONS ====================
    async isOnCartPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('view_cart');
    }

    async isOnCheckoutPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('checkout');
    }

    async isOnPaymentPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('payment');
    }

    async isOnOrderConfirmedPage(): Promise<boolean> {
        return this.assertCurrentUrlContain('payment_done');
    }

    // ==================== INFORMACIÓN DEL CARRITO ====================
    async getCartItems(): Promise<CartItem[]> {
        const items: CartItem[] = [];
        const rows = await this.cartRows.all();

        for (const row of rows) {
            const name     = await row.locator('td:nth-child(2) a').textContent() || '';
            const price    = await row.locator('td:nth-child(3)').textContent() || '';
            const quantity = await row.locator('td:nth-child(4) button').textContent() || '';
            const total    = await row.locator('td:nth-child(5)').textContent() || '';

            if (name.trim()) {
                items.push({
                    name:     name.trim(),
                    price:    price.trim(),
                    quantity: quantity.trim(),
                    total:    total.trim()
                });
            }
        }
        return items;
    }

    async getTotalAmount(): Promise<string> {
        const cells = this.page.getByRole('cell', { name: /Rs\./ });
        const count = await cells.count();
        return await cells.nth(count - 1).innerText();
    }

    async getItemCount(): Promise<number> {
        return await this.cartRows.count();
    }

    async getItemPrice(productName: string): Promise<string> {
        const row = this.cartRows.filter({ hasText: productName });
        return await row.locator('td:nth-child(3)').innerText();
    }

    // ==================== ACCIONES EN EL CARRITO ====================
    async removeItemByName(productName: string): Promise<void> {
        const row = this.cartRows.filter({ hasText: productName });
        await row.locator('.cart_quantity_delete').click();
        await row.waitFor({ state: 'detached', timeout: 8000 });
    }

    async expectCartEmpty(): Promise<boolean> {
        try {
            await this.emptyCartMessage.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    // ==================== CHECKOUT FLOW ====================
    async goToSingUpFromCart(): Promise<void> {
        await this.clickElement(this.goToSingup);
    }

    async proceedToCheckout(): Promise<void> {
        await this.clickAndNavigateTo(this.proceedToCheckoutButton, '**/checkout**');
        await this.waitForLoad()
    }

    async addOrderComment(comment: string): Promise<void> {
        await this.orderComment.fill(comment);
    }

    async placeOrder(): Promise<void> {
        // navigates to /payment
        await this.clickAndNavigateTo(this.placeOrderButton, '**/payment**');
    }

    // ==================== PAYMENT ====================
    async fillPaymentDetails(
        name: string,
        cardNumber: string,
        cvc: string,
        month: string,
        year: string
    ): Promise<void> {
        await this.nameOnCard.fill(name);
        await this.cardNumber.fill(cardNumber);
        await this.cvc.fill(cvc);
        await this.expiryMonth.fill(month);
        await this.expiryYear.fill(year);
    }

    async payAndConfirmOrder(): Promise<void> {
        // navigates to /payment_done (partial match via glob)
        await this.clickAndNavigateTo(this.payAndConfirmBtn, '**/payment_done**', { timeout: 20000 });
    }

    async clickContinueAfterOrder(): Promise<void> {
        await this.continueBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.continueBtn.click();
    }

    // ==================== ASSERTS ====================
    async expectOrderPlacedSuccess(): Promise<boolean> {
        try {
            await this.page.getByText('Order Placed!').waitFor({ state: 'visible', timeout: 10000 });
            await this.page.getByText('Congratulations! Your order has been confirmed!').waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async downloadInvoice(): Promise<void> {
        const downloadPromise = this.page.waitForEvent('download');
        await this.page.getByRole('link', { name: 'Download Invoice' }).click();
        const download = await downloadPromise;
        console.log('Invoice downloaded:', download.suggestedFilename());
    }

    // ==================== FLUJO COMPLETO ====================
    async checkoutFullFlow(
        name: string,
        cardNumber: string,
        cvc: string,
        month: string,
        year: string,
        comment?: string
    ): Promise<void> {
        await this.proceedToCheckout();
        if (comment) await this.addOrderComment(comment);
        await this.placeOrder();
        await this.fillPaymentDetails(name, cardNumber, cvc, month, year);
        await this.payAndConfirmOrder();
        expect(await this.expectOrderPlacedSuccess()).toBe(true);
        await this.downloadInvoice();
        await this.clickContinueAfterOrder();
    }

    async getDeliveryAddress(): Promise<string> {
        return await this.page.locator('#address_delivery').innerText();
    }

    async getBillingAddress(): Promise<string> {
        return await this.page.locator('#address_invoice').innerText();
    }
}