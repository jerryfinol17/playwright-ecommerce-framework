import { test, expect } from './fixtures';
import { createUserData, registerUser } from '../helpers/userHelpers';

// TC10: Verify Subscription in home page
test('TC10 - Verify Subscription in home page', async ({ homePage }) => {
    const user = createUserData();

    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    await homePage.subscribeToNewsletter(user.new_user_email);
    await expect(homePage.isSubscribeSuccessVisible()).resolves.toBe(true);
});

// TC11: Verify Subscription in Cart page
test('TC11 - Verify Subscription in Cart page', async ({ homePage, cartPage }) => {
    const user = createUserData();

    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    await homePage.subscribeToNewsletter(user.new_user_email);
    await expect(homePage.isSubscribeSuccessVisible()).resolves.toBe(true);
});

// TC12: Add Products in Cart
test('TC12 - Add Products in Cart', async ({ homePage, productsPage, cartPage }) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    const names        = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 1];

    for (const index of indicesToAdd) {
        await productsPage.addToCartByName(names[index]);
        await productsPage.continueShopping();
    }

    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    const cartItems = await cartPage.getCartItems();
    const cartNames = cartItems.map(item => item.name);

    for (const index of indicesToAdd) {
        expect(cartNames).toContain(names[index]);
    }

    cartItems.forEach(item => {
        expect(item.price).toBeTruthy();
        expect(item.quantity).toBeTruthy();
        expect(item.total).toBeTruthy();
    });
});

// TC13: Verify Product quantity in Cart
test('TC13 - Verify Product quantity in Cart', async ({ homePage, productsPage, cartPage }) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    await productsPage.goToProductByName('Blue top');
    await productsPage.setQuantity(4);
    await productsPage.addToCart();
    await productsPage.continueShopping();

    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    const cartItems = await cartPage.getCartItems();
    const quantity  = parseInt(cartItems[0].quantity);
    expect(quantity).toBe(4);
});

// TC17: Remove Products From Cart
test('TC17 - Remove Products From Cart', async ({ homePage, productsPage, cartPage }) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    const names        = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 5, 11];

    for (const index of indicesToAdd) {
        await productsPage.addToCartByName(names[index]);
        await productsPage.continueShopping();
    }

    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    for (const index of indicesToAdd) {
        await cartPage.removeItemByName(names[index]);
    }

    await expect(cartPage.expectCartEmpty()).resolves.toBe(true);
});

// TC20: Search Products and Verify Cart After Login
test('TC20 - Search Products and Verify Cart After Login', async ({ homePage, productsPage, cartPage, loginPage }) => {
    const user         = createUserData();
    const searchTerms  = ['Blue Top', 'Men Tshirt'];

    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    // Agregar desde búsqueda sin estar logueado
    for (const term of searchTerms) {
        await productsPage.searchProduct(term);
        await productsPage.addSearchResultToCart();
        await productsPage.continueShopping();
    }

    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    const itemsBefore = await cartPage.getItemCount();
    expect(itemsBefore).toBeGreaterThan(0);

    // Login
    await homePage.goToSignUpLogin();
    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    // Verificar carrito persiste
    await homePage.goToCart();
    const itemsAfter = await cartPage.getItemCount();
    expect(itemsAfter).toBeGreaterThan(0);
});