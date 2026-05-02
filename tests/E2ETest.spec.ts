import { test, expect } from '../fixtures/fixtures';
import { createUserData, registerUser } from '../helpers/userHelpers';
import { NEW_USER } from '../pages/config';

const PAYMENT = {
    name:  'Test User',
    card:  '4111111111111111',
    cvc:   '123',
    month: '12',
    year:  '2026',
};

function pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

test('E2E - Full Shopping Flow', async ({ homePage, loginPage, productsPage, cartPage }) => {
    test.setTimeout(180_000);
    // ==================== 1. SETUP: Crear usuario ====================
    const user = createUserData();

    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    await homePage.goToSignUpLogin();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);

    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    console.log(`✅ Usuario creado: ${user.new_user_email}`);

    // ==================== 2. Ir a productos y escoger al azar ====================
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    const allNames    = await productsPage.getAllProductNames();
    const firstBatch  = pickRandom(allNames, 4);

    console.log(`🛍️  Primera tanda de productos: ${firstBatch.join(', ')}`);

    // ==================== 3. Ver detalle y dejar review en 2 productos ====================
    const productsToReview = firstBatch.slice(0, 2);

    for (const productName of productsToReview) {
        await productsPage.goToProductByName(productName);

        const title        = await productsPage.getProductTitle();
        const price        = await productsPage.getProductPrice();
        const availability = await productsPage.getAvailability();
        console.log(`👀 Viendo: ${title} | ${price} | ${availability}`);

        await productsPage.submitReview(
            user.new_user_name,
            user.new_user_email,
            `Qué buen producto este ${title}, se ve increíble y el precio está genial. Lo recomiendo!`
        );
        await expect(productsPage.verifySuccessMsg()).resolves.toBe(true);
        console.log(`💬 Review dejada en: ${title}`);

        await homePage.goToProducts();
    }

    // ==================== 4. Agregar la primera tanda al carrito ====================
    for (const productName of firstBatch) {
        await productsPage.addToCartByName(productName);
        console.log(`🛒 Agregado al carrito: ${productName}`);
    }

    // ==================== 5. Ir al carrito y revisar ====================
    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    const cartItemsBeforeRemoval = await cartPage.getCartItems();
    expect(cartItemsBeforeRemoval.length).toBe(firstBatch.length);

    console.log('📋 Carrito antes de eliminar:');
    cartItemsBeforeRemoval.forEach(item => {
        console.log(`   - ${item.name} | Precio: ${item.price} | Cantidad: ${item.quantity} | Total: ${item.total}`);
    });

    // ==================== 6. Eliminar 2 productos del carrito ====================
    const toRemove = firstBatch.slice(0, 2);

    for (const productName of toRemove) {
        await cartPage.removeItemByName(productName);
        console.log(`🗑️  Eliminado del carrito: ${productName}`);
    }

    const cartItemsAfterRemoval = await cartPage.getCartItems();
    expect(cartItemsAfterRemoval.length).toBe(firstBatch.length - toRemove.length);

    // ==================== 7. Volver a productos ====================
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    const remaining     = allNames.filter(n => !firstBatch.includes(n));
    const secondBatch   = pickRandom(remaining, 3);

    console.log(`🔥 Segunda tanda : ${secondBatch.join(', ')}`);

    for (const productName of secondBatch) {
        await productsPage.addToCartByName(productName);
        console.log(`🛒 Agregado al carrito: ${productName}`);
    }

    // ==================== 8. Ir al carrito y verificar  ====================
    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    const finalCart     = await cartPage.getCartItems();
    const expectedCount = (firstBatch.length - toRemove.length) + secondBatch.length;
    expect(finalCart.length).toBe(expectedCount);

    const totalAmount = await cartPage.getTotalAmount();
    console.log(`💰 Total del carrito: ${totalAmount} (${finalCart.length} productos)`);

    // ==================== 9. Checkout ====================
    await cartPage.proceedToCheckout();
    await expect(cartPage.isOnCheckoutPage()).resolves.toBe(true);

    const delivery = await cartPage.getDeliveryAddress();
    const billing  = await cartPage.getBillingAddress();

    expect(delivery).toContain(NEW_USER.new_user_first_name);
    expect(delivery).toContain(NEW_USER.new_user_address1);
    expect(billing).toContain(NEW_USER.new_user_first_name);
    expect(billing).toContain(NEW_USER.new_user_address1);

    console.log(`📦 Dirección de entrega verificada`);

    await cartPage.addOrderComment('Todo se ve genial, espero el envío rápido!');
    await cartPage.placeOrder();
    await expect(cartPage.isOnPaymentPage()).resolves.toBe(true);

    await cartPage.fillPaymentDetails(PAYMENT.name, PAYMENT.card, PAYMENT.cvc, PAYMENT.month, PAYMENT.year);
    await cartPage.payAndConfirmOrder();

    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true);
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true);

    console.log(`✅ Orden completada exitosamente`);

    await cartPage.downloadInvoice();
    await cartPage.clickContinueAfterOrder();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    // ==================== 10. Teardown: Eliminar usuario ====================
    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);

    console.log(`🧹 Usuario eliminado: ${user.new_user_email}`);
});