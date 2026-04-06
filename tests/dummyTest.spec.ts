import {test,expect} from "@playwright/test";
import {HomePage} from "../pages/HomePage";
import {ProductPage} from "../pages/ProductsPage";
import {LoginPage} from "../pages/LoginPage";

test('gotoSingup', async ({page}) => {
    const home = new HomePage(page)
    await home.start()
    await home.goToSignUpLogin()
    await home.goToProducts()
    await home.goToCart()
    await home.goToContactUs()
})
test('click Categories', async ({page}) => {
    const home = new HomePage(page)
    await home.start()
    await home.clickWomenCategory();
    console.log('intentando con la categoria mujeres')
    await  expect(home.isCategoryExpanded('Women')).resolves.toBe(true)
    console.log('intentando categoria hombres')
    await home.clickMenCategory()
    await expect(home.isCategoryExpanded('Men')).resolves.toBe(true)
    console.log('intentando categoria kids')
    await home.clickKidsCategory()
    await expect(home.isCategoryExpanded('Kids')).resolves.toBe(true)
    await home.assertOnlyOneCategoryExpanded('Kids')
})
test('add a product', async ({page}) => {
    const home = new HomePage(page)
    await home.start()
    await home.addToCart('Blue Top')
    await expect(home.isContinueBtnVisible()).resolves.toBe(true)
    await home.continueShopping()
    await expect(home.isContinueBtnVisible()).resolves.toBe(false)
})
//VAMOOOOO  CARAJOOOOOOOOOO

test('products page', async ({page}) => {
    const home = new HomePage(page)
    const products = new ProductPage(page)
    await home.start()
    await home.goToProducts()
    await expect(products.isOnProductPage()).resolves.toBe(true)
    await products.searchProduct('Blue Top')
    const name = await products.getSearchResultNames()
    console.log(name)

})
test('login page', async ({page}) => {
    const home = new HomePage(page)
    const login = new LoginPage(page)
    await home.start()
    await home.goToSignUpLogin()
    await expect(login.isOnLoginPage()).resolves.toBe(true)
    await login.signupNewUser('laufeyFan', 'LaufeyFan@gmail.com')
    await expect(login.isOnSingUpPage()).resolves.toBe(true)
    await login.fillAccountCreationForm({title:'Mr.',
        password: 'LaufeyIsTheBest',
        day: '24',
        month: '9',
        year: '2000',
        firstName: 'laufeyFan',
        lastName: 'JuniaFan',
        address1: '123 example plc',
        country: 'United States',
        state: 'oklahoma ',
        city: 'Laufeyland',
        zipcode: '1235',
        mobile: '13245643144',
        newsletter: true})
    await login.clickCreateAccount()
    await expect(login.isOnCreatedPage()).resolves.toBe(true)
    await expect(login.expectAccountCreatedSuccess()).resolves.toBe(true)
    await login.clickContinueAfterAccountCreated()
    await expect(home.isOnHomePage()).resolves.toBe(true)
})
test('login', async ({page}) => {
    const home = new HomePage(page)
    const login = new LoginPage(page)
    await home.start()
    await home.goToSignUpLogin()
    await expect(login.isOnLoginPage()).resolves.toBe(true)
    await login.createNewUserFullFlow('beautiful Stranger', 'Laufey@gmail.com', {title:'Mr.',
        password: 'LaufeyIsTheBest',
        day: '24',
        month: '9',
        year: '2000',
        firstName: 'laufeyFan',
        lastName: 'JuniaFan',
        address1: '123 example plc',
        country: 'United States',
        state: 'oklahoma ',
        city: 'Laufeyland',
        zipcode: '1235',
        mobile: '13245643144',
        newsletter: true})
    await expect(home.isOnHomePage()).resolves.toBe(true)
})