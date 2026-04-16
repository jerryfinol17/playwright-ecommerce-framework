import {test, expect} from "./fixtures";
import {NEW_USER} from "../pages/config";
import { createUserData, registerUser } from '../helpers/userHelpers';
import path from 'path';
test('Verify All Products and product detail page', async ({homePage, productsPage}) => {
    await homePage.start();
    await homePage.goToProducts()
    await homePage.takeScreenshot('products');
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    const names = await productsPage.getAllProductNames()
    console.log(`Lista de nombres: ${names}`);
    await productsPage.goToProductByName(names[0]);
    const productNames = await productsPage.getProductTitle()
    const productPrice = await productsPage.getProductPrice();
    const productBrand = await productsPage.getBrand();
    const productAvailability = await productsPage.getAvailability();
    const productCondition = await productsPage.getCondition();
    console.log(`Detalles del producto Titulo: ${productNames}, Precio: ${productPrice}, Brand: ${productBrand}, availability: ${productAvailability}, condition: ${productCondition}`);
    await productsPage.takeScreenshot('first Product');
})
test('Search Product By Name', async ({homePage, productsPage}) => {
    await homePage.start();
    await homePage.goToProducts()
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    await productsPage.searchProduct('Sleeveless Dress');
    const productName = await productsPage.getSearchResultNames();
    console.log(`Search Product By Name: ${productName}`);
    await productsPage.goToProduct()
    const productNames = await productsPage.getProductTitle()
    const productPrice = await productsPage.getProductPrice();
    const productBrand = await productsPage.getBrand();
    const productAvailability = await productsPage.getAvailability();
    const productCondition = await productsPage.getCondition();
    console.log(`Detalles del producto por búsqueda,  Titulo: ${productNames}, Precio: ${productPrice}, Brand: ${productBrand}, availability: ${productAvailability}, condition: ${productCondition}`);
})
test('Add products to Cart', async ({homePage, productsPage, cartPage}) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    const names = await productsPage.getAllProductNames();

    const indicesToAdd = [0, 11, 5];

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
    console.log(cartItems)

})
test('Add review to Product', async ({homePage, productsPage}) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    await productsPage.goToProductByName('Summer White Top')
    await productsPage.submitReview('Juan Carlos Bodoque', `exampleuser_${Date.now()}@test.com`, 'Se ve realmente bien el producto, y tiene un buen precio ')
})
test('Search Products and Verify Cart After Login',async ({homePage, productsPage, cartPage, loginPage}) => {
    const user = createUserData();
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    const names = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 11, 5];
    for(const index of indicesToAdd) {
        await productsPage.searchProduct(names[index]);
        await productsPage.getSearchResultNames()
        await productsPage.addSearchResultToCart();
        await productsPage.continueShopping();
    }
    await homePage.goToCart()
    const cartItems1 = await cartPage.getCartItems();
    const cartNames1 = cartItems1.map(item => item.name);
    for (const index of indicesToAdd) {
        expect(cartNames1).toContain(names[index]);
    }
    console.log(cartItems1)
    await homePage.goToSignUpLogin()
    await registerUser(loginPage, user);
    await homePage.goToCart()
    await expect(homePage.isLoggedIn()).resolves.toBe(true);
    const cartItems2 = await cartPage.getCartItems();
    const cartNames2 = cartItems2.map(item => item.name);
    for (const index of indicesToAdd) {
        expect(cartNames2).toContain(names[index]);
    }
})
test('Place Order: Register while Checkout', async ({homePage, productsPage, loginPage, cartPage}) => {
    const user = createUserData();
    const info = NEW_USER
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    const names = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 11, 5, 7, 8 ];
    for (const index of indicesToAdd) {
        await productsPage.addToCartByName(names[index]);
        await productsPage.continueShopping();
    }
    await homePage.goToCart()
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await cartPage.proceedToCheckout()
    await cartPage.goToSingUpFromCart()
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);
    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);
    await homePage.goToCart()
    await cartPage.proceedToCheckout()
    const deliveryAddress = await cartPage.getDeliveryAddress();
    const billingAddress = await cartPage.getBillingAddress();
    expect(deliveryAddress).toContain(info.new_user_first_name);
    expect(deliveryAddress).toContain(info.new_user_last_name);
    expect(deliveryAddress).toContain(info.new_user_address1);
    expect(deliveryAddress).toContain(info.new_user_city);
    expect(billingAddress).toContain(info.new_user_first_name);
    expect(billingAddress).toContain(info.new_user_last_name);
    expect(billingAddress).toContain(info.new_user_address1);
    expect(billingAddress).toContain(info.new_user_city);
    await cartPage.addOrderComment('Espero sea un gran producto!')
    await cartPage.placeOrder()
    await cartPage.fillPaymentDetails('a','a','a','a','a')
    await cartPage.payAndConfirmOrder()
    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true)
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true)
    await loginPage.clickDeleteAccount()
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true)
})
test('Place Order: Register before Checkout', async ({homePage, productsPage, loginPage, cartPage}) => {
    const user = createUserData();
    const info = NEW_USER;

    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    await homePage.goToSignUpLogin();
    await registerUser(loginPage, user);

    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    await homePage.goToProducts();
    const names = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 11, 5, 7, 8];
    for (const index of indicesToAdd) {
        await productsPage.addToCartByName(names[index]);
        await productsPage.continueShopping();
    }
    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    await cartPage.proceedToCheckout();
    const deliveryAddress = await cartPage.getDeliveryAddress();
    const billingAddress = await cartPage.getBillingAddress();
    expect(deliveryAddress).toContain(info.new_user_first_name);
    expect(deliveryAddress).toContain(info.new_user_last_name);
    expect(deliveryAddress).toContain(info.new_user_address1);
    expect(deliveryAddress).toContain(info.new_user_city);
    expect(billingAddress).toContain(info.new_user_first_name);
    expect(billingAddress).toContain(info.new_user_last_name);
    expect(billingAddress).toContain(info.new_user_address1);
    expect(billingAddress).toContain(info.new_user_city);

    await cartPage.addOrderComment('Espero sea un gran producto!');
    await cartPage.placeOrder();
    await cartPage.fillPaymentDetails('a', 'a', 'a', 'a', 'a');
    await cartPage.payAndConfirmOrder();

    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true);
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true);

    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});
test('Place Order: Login before Checkout', async ({homePage, productsPage, loginPage, cartPage}) => {
    const user = createUserData();
    const info = NEW_USER;

    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    await homePage.goToSignUpLogin();
    await registerUser(loginPage, user);
    await expect(homePage.isLoggedIn()).resolves.toBe(true);
    await loginPage.clickLogout();

    await homePage.goToSignUpLogin();
    await loginPage.loginWithExistingUser(user.new_user_email, user.new_user_password);

    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    await homePage.goToProducts();
    const names = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 11, 5, 7, 8];
    for (const index of indicesToAdd) {
        await productsPage.addToCartByName(names[index]);
        await productsPage.continueShopping();
    }
    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);

    await cartPage.proceedToCheckout();
    const deliveryAddress = await cartPage.getDeliveryAddress();
    const billingAddress = await cartPage.getBillingAddress();
    expect(deliveryAddress).toContain(info.new_user_first_name);
    expect(deliveryAddress).toContain(info.new_user_last_name);
    expect(deliveryAddress).toContain(info.new_user_address1);
    expect(deliveryAddress).toContain(info.new_user_city);
    expect(billingAddress).toContain(info.new_user_first_name);
    expect(billingAddress).toContain(info.new_user_last_name);
    expect(billingAddress).toContain(info.new_user_address1);
    expect(billingAddress).toContain(info.new_user_city);

    await cartPage.addOrderComment('Espero sea un gran producto!');
    await cartPage.placeOrder();
    await cartPage.fillPaymentDetails('a', 'a', 'a', 'a', 'a');
    await cartPage.payAndConfirmOrder();

    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true);
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true);

    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});
test(' Add review on product', async ({homePage, productsPage}) => {
    const user = createUserData();
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    const names = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 11, 5, 7, 8];
    for (const index of indicesToAdd) {
        await productsPage.goToProductByName(names[index]);
        await productsPage.submitReview('Diego', user.new_user_email, 'Es un gran producto, muchas gracias por tenerlo!')
        await expect(productsPage.verifySuccessMsg()).resolves.toBe(true);
        await homePage.goToProducts();
    }
})
test('Verify Product quantity in Cart', async ({homePage, productsPage, cartPage}) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    await productsPage.goToProductByName('Blue top')
    const name = await productsPage.getProductTitle()
    expect(name).toContain('Blue')
    await productsPage.setQuantity(4)
    await productsPage.addToCart()
    await productsPage.continueShopping()
    await homePage.goToCart()
    const cartItems = await cartPage.getCartItems();
    const quantity = parseInt(cartItems[0].quantity);
    expect(quantity).toBe(4);
})
test('Remove Products From Cart', async ({homePage, productsPage, cartPage}) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    const names = await productsPage.getAllProductNames();
    const indicesToAdd = [0, 11, 5, 7, 8];
    for (const index of indicesToAdd) {
        await productsPage.addToCartByName(names[index]);
        await productsPage.continueShopping();
    }
    await homePage.goToCart();
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    for(const index of indicesToAdd) {
        await cartPage.removeItemByName(names[index]);
    }
    await expect(cartPage.expectCartEmpty()).resolves.toBe(true);
})
test('Verify Subscription in home page', async ({homePage}) => {
    const user = createUserData();
    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
    await homePage.subscribeToNewsletter(user.new_user_email)
    await expect(homePage.isSubscribeSuccessVisible()).resolves.toBe(true);
})
test('Verify Subscription in Cart Page', async ({homePage, cartPage}) => {
    const user = createUserData();
    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
    await homePage.goToCart()
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
    await homePage.subscribeToNewsletter(user.new_user_email)
    await expect(homePage.isSubscribeSuccessVisible()).resolves.toBe(true);
})
test('Contact Us Form', async ({homePage}) => {
    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
    await homePage.goToContactUs();
    const filePath = path.join(__dirname, '..', 'utils', 'fake-file.txt');
    await homePage.fillContactForm('Juan', 'juan@gmail.com', 'Subject', 'Message', filePath);
    await homePage.submitContactForm();
    expect(await homePage.isContactSuccessVisible()).toBe(true);
    await homePage.goHomeFromContact();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
})
test(' View Category Products', async ({homePage}) => {
    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
    // Women > Dress
    await homePage.clickSubCategory('Women', 'Dress');
    await expect( homePage.isCategoryPageHeadingVisible('Women - Dress Products')).resolves.toBe(true);

// Men > Tshirts
    await homePage.clickSubCategory('Men', 'Tshirts');
    await expect( homePage.isCategoryPageHeadingVisible('Men - Tshirts Products')).resolves.toBe(true);

// Kids > Tops & Shirts
    await homePage.clickSubCategory('Kids', 'Tops & Shirts');
    await expect(homePage.isCategoryPageHeadingVisible('Kids - Tops & Shirts Products')).resolves.toBe(true);
})
test('View & Cart Brand Products', async ({homePage, productsPage}) => {
    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
    await homePage.goToProducts()
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    await expect( productsPage.isBrandsSidebarVisible()).resolves.toBe(true);

    await productsPage.clickBrand('Polo');
    await expect(productsPage.isBrandPageVisible('Polo')).resolves.toBe(true);

    await productsPage.clickBrand('H&M');
    await expect(await productsPage.isBrandPageVisible('H&M')).resolves.toBe(true);
})