import { test, expect } from './fixtures';
import { NEW_USER } from '../pages/config';
import { createUserData, registerUser } from '../helpers/userHelpers';

// ==================== HELPERS LOCALES ====================

const PAYMENT = { name: 'Test User', card: '4111111111111111', cvc: '123', month: '12', year: '2026' };

async function addProductsToCart(productsPage: any, homePage: any) {
    await homePage.goToProducts();
    const names        = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 5, 11];
    for (const index of indicesToAdd) {
        await productsPage.addToCartByName(names[index]);
        await productsPage.continueShopping();
    }
}

function verifyAddressContainsUserData(address: string) {
    const info = NEW_USER;
    expect(address).toContain(info.new_user_first_name);
    expect(address).toContain(info.new_user_last_name);
    expect(address).toContain(info.new_user_address1);
    expect(address).toContain(info.new_user_city);
}

// TC14: Place Order - Register while Checkout
test('TC14 - Place Order: Register while Checkout', async ({ homePage, productsPage, loginPage, cartPage }) => {
    const user = createUserData();

    await homePage.start();
    await addProductsToCart(productsPage, homePage);

    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    await cartPage.proceedToCheckout();
    await cartPage.goToSingUpFromCart();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);

    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(cartPage.isOnCheckoutPage()).resolves.toBe(true);

    await cartPage.addOrderComment('Espero sea un gran producto!');
    await cartPage.placeOrder();
    await expect(cartPage.isOnPaymentPage()).resolves.toBe(true);

    await cartPage.fillPaymentDetails(PAYMENT.name, PAYMENT.card, PAYMENT.cvc, PAYMENT.month, PAYMENT.year);
    await cartPage.payAndConfirmOrder();

    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true);
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true);

    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});

// TC15: Place Order - Register before Checkout
test('TC15 - Place Order: Register before Checkout', async ({ homePage, productsPage, loginPage, cartPage }) => {
    const user = createUserData();

    await homePage.start();
    await homePage.goToSignUpLogin();
    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    await addProductsToCart(productsPage, homePage);
    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    await cartPage.proceedToCheckout();
    await expect(cartPage.isOnCheckoutPage()).resolves.toBe(true);

    const delivery = await cartPage.getDeliveryAddress();
    const billing  = await cartPage.getBillingAddress();
    verifyAddressContainsUserData(delivery);
    verifyAddressContainsUserData(billing);

    await cartPage.addOrderComment('Espero sea un gran producto!');
    await cartPage.placeOrder();
    await expect(cartPage.isOnPaymentPage()).resolves.toBe(true);

    await cartPage.fillPaymentDetails(PAYMENT.name, PAYMENT.card, PAYMENT.cvc, PAYMENT.month, PAYMENT.year);
    await cartPage.payAndConfirmOrder();

    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true);
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true);

    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});

// TC16: Place Order - Login before Checkout
test('TC16 - Place Order: Login before Checkout', async ({ homePage, productsPage, loginPage, cartPage }) => {
    const user = createUserData();

    await homePage.start();
    await homePage.goToSignUpLogin();

    // Crear y luego volver a loguear
    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);
    await loginPage.clickLogout();

    await homePage.goToSignUpLogin();
    await loginPage.loginWithExistingUser(user.new_user_email, user.new_user_password);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    await addProductsToCart(productsPage, homePage);
    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    await cartPage.proceedToCheckout();
    await expect(cartPage.isOnCheckoutPage()).resolves.toBe(true);

    const delivery = await cartPage.getDeliveryAddress();
    const billing  = await cartPage.getBillingAddress();
    verifyAddressContainsUserData(delivery);
    verifyAddressContainsUserData(billing);

    await cartPage.addOrderComment('Espero sea un gran producto!');
    await cartPage.placeOrder();
    await expect(cartPage.isOnPaymentPage()).resolves.toBe(true);

    await cartPage.fillPaymentDetails(PAYMENT.name, PAYMENT.card, PAYMENT.cvc, PAYMENT.month, PAYMENT.year);
    await cartPage.payAndConfirmOrder();

    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true);
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true);

    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});

// TC23: Verify address details in checkout page
test('TC23 - Verify address details in checkout page', async ({ homePage, productsPage, loginPage, cartPage }) => {
    const user = createUserData();

    await homePage.start();
    await homePage.goToSignUpLogin();
    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    await addProductsToCart(productsPage, homePage);
    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    await cartPage.proceedToCheckout();
    await expect(cartPage.isOnCheckoutPage()).resolves.toBe(true);

    const delivery = await cartPage.getDeliveryAddress();
    const billing  = await cartPage.getBillingAddress();
    verifyAddressContainsUserData(delivery);
    verifyAddressContainsUserData(billing);

    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});

// TC24: Download Invoice after purchase order
test('TC24 - Download Invoice after purchase order', async ({ homePage, productsPage, loginPage, cartPage }) => {
    const user = createUserData();

    await homePage.start();
    await addProductsToCart(productsPage, homePage);

    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    await cartPage.proceedToCheckout();
    await cartPage.goToSingUpFromCart();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);

    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(cartPage.isOnCheckoutPage()).resolves.toBe(true);

    await cartPage.addOrderComment('Test order with invoice');
    await cartPage.placeOrder();
    await expect(cartPage.isOnPaymentPage()).resolves.toBe(true);

    await cartPage.fillPaymentDetails(PAYMENT.name, PAYMENT.card, PAYMENT.cvc, PAYMENT.month, PAYMENT.year);
    await cartPage.payAndConfirmOrder();

    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true);
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true);

    await cartPage.downloadInvoice();
    await cartPage.clickContinueAfterOrder();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});