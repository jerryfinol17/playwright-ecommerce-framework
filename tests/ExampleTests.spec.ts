import {test, expect} from "../fixtures/fixtures";
import {NEW_USER} from "../pages/config";

test('HomePage', async ({homePage}) => {
    await homePage.start();
    await homePage.goToSignUpLogin();
    await homePage.goToProducts();
    await homePage.goToCart();
    await homePage.gotoTestCases()
    await expect(homePage.isOnTestCasesPage()).resolves.toBe(true);
    await homePage.goToContactUs();
    await homePage.gotoHome();
    await homePage.clickWomenCategory();
    await  expect(homePage.isCategoryExpanded('Women')).resolves.toBe(true);
    await homePage.clickMenCategory();
    await expect(homePage.isCategoryExpanded('Men')).resolves.toBe(true);
    await homePage.clickKidsCategory();
    await expect(homePage.isCategoryExpanded('Kids')).resolves.toBe(true);
    await homePage.assertOnlyOneCategoryExpanded('Kids');
});
test('ProductsPage', async ({homePage, productsPage, page}) => {
    await homePage.start()
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    const names = await productsPage.getAllProductNames()
    await expect(names.length).toBeGreaterThan(5);
    const prices = await productsPage.getAllProductPrices()
    await expect(prices.length).toBeGreaterThan(5);
    await productsPage.addToCartByName('Blue Top');
    await expect(productsPage.isContinueBtnVisible()).resolves.toBe(true);
    await productsPage.continueShopping()
    await productsPage.searchProduct('Blue Top');
    await expect(productsPage.getSearchResultNames()).resolves.toContain('Blue Top');
    await page.goBack()
    await productsPage.goToProductByName('Blue Top');
    const productTitle = await productsPage.getProductTitle();
    const productPrice = await productsPage.getProductPrice();
    const productBrand = await productsPage.getBrand();
    const productAvailability = await productsPage.getAvailability();
    const productCondition = await productsPage.getCondition();
    console.log(productTitle, productPrice, productBrand, productAvailability,productCondition);
    await productsPage.addToCart();
    await expect(productsPage.isContinueBtnVisible()).resolves.toBe(true);
    await productsPage.continueShopping();
    await productsPage.submitReview('exampleUser','Examplemail@gmail.com','se ve como un buen producto!');
    await productsPage.takeScreenshot('review')
})
test('LoginPage', async ({homePage,loginPage}) => {
    const UNIQUE_EMAIL = `example_${Date.now()}@test.com`;
    await homePage.start()
    await homePage.goToSignUpLogin()
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true)
    await loginPage.signupNewUser('Example', UNIQUE_EMAIL )
    await expect(loginPage.isOnSingUpPage()).resolves.toBe(true)
    await loginPage.fillAccountCreationForm({title:'Mr.',
        password: 'AJ1234',
        day: '24',
        month: '9',
        year: '2000',
        firstName: 'AJ',
        lastName: 'AJJA',
        address1: '123 example plc',
        country: 'United States',
        state: 'Oklahoma ',
        city: 'Konoha',
        zipcode: '1235',
        mobile: '13245643144',
        newsletter: true})
    await loginPage.clickCreateAccount()
    await expect(loginPage.isOnCreatedPage()).resolves.toBe(true)
    await expect(loginPage.expectAccountCreatedSuccess()).resolves.toBe(true)
    await loginPage.clickContinueAfterAccountCreated()
    await expect(homePage.isOnHomePage()).resolves.toBe(true)
    await loginPage.clickLogout()
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);
    await loginPage.loginWithExistingUser('ja@gmail.com','ajajsja1132312');
    await expect(loginPage.expectLoginError()).resolves.toBe(true);
    await loginPage.loginWithExistingUser(UNIQUE_EMAIL,'AJ1234')
    await expect(homePage.isOnHomePage()).resolves.toBe(true)
    await loginPage.clickLogout()
    await loginPage.signupNewUser( 'JA', UNIQUE_EMAIL)
    await expect(loginPage.expectSignupError()).resolves.toBe(true)
    await loginPage.cleanSignupFields()
    await loginPage.signupNewUser('XD',    `example_${Date.now()}@test.com`);
    await expect(loginPage.expectEmptyFormDoesNotSubmit()).resolves.toBe(true);
})
test('cart page', async ({homePage, loginPage, productsPage, cartPage}) => {
    const UNIQUE_EMAIL = `example_${Date.now()}@test.com`;
    await homePage.start()
    await homePage.goToSignUpLogin()
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true)
    await loginPage.createNewUserFullFlow('Juan Carlos', UNIQUE_EMAIL,{title:'Mr.',
        password: 'Viva 31 minutos!',
        day: NEW_USER.new_user_day,
        month: NEW_USER.new_user_month,
        year: NEW_USER.new_user_year,
        firstName: NEW_USER.new_user_first_name,
        lastName: NEW_USER.new_user_last_name,
        address1: NEW_USER.new_user_address1,
        country: NEW_USER.new_user_country,
        state: NEW_USER.new_user_state,
        city: NEW_USER.new_user_city,
        zipcode: NEW_USER.new_user_zipcode,
        mobile: NEW_USER.new_user_mobile,
        newsletter: true,
        specialOffers: true,})
    await expect(homePage.isOnHomePage()).resolves.toBe(true)
    await homePage.goToProducts()
    await productsPage.addToCartByName('Blue Top')
    await productsPage.continueShopping()
    await homePage.goToCart()
    await expect(cartPage.isOnCartPage()).resolves.toBe(true)
    await expect(cartPage.expectCartEmpty()).resolves.toBe(false)
    const items =  await cartPage.getCartItems()
    const total = await cartPage.getTotalAmount()
    const itemCount = await  cartPage.getItemCount()
    const price = await cartPage.getItemPrice('Blue Top')
    console.log(itemCount, total, items, price)
    await cartPage.proceedToCheckout()
    await expect(cartPage.isOnCheckoutPage()).resolves.toBe(true)
    const delivery = await cartPage.getDeliveryAddress()
    const billing = await cartPage.getBillingAddress()
    console.log(delivery, billing)
    await cartPage.addOrderComment('Hola, y gracias')
    await cartPage.placeOrder()
    await expect(cartPage.isOnPaymentPage()).resolves.toBe(true)
    await cartPage.fillPaymentDetails('a','a','a','a','a')
    await cartPage.payAndConfirmOrder()
    await expect(cartPage.isOnOrderConfirmedPage()).resolves.toBe(true)
    await expect(cartPage.expectOrderPlacedSuccess()).resolves.toBe(true)
    await cartPage.downloadInvoice()
    await cartPage.clickContinueAfterOrder()
    await expect(homePage.isOnHomePage()).resolves.toBe(true)
    await productsPage.addToCartByName('Blue Top')
    await expect(productsPage.isContinueBtnVisible()).resolves.toBe(true)
    await productsPage.continueShopping()
    await homePage.goToCart()
    await expect(cartPage.isOnCartPage()).resolves.toBe(true)
    await cartPage.removeItemByName('Blue Top')
    await expect(cartPage.expectCartEmpty()).resolves.toBe(true)
})