import {test,expect} from "@playwright/test";
import {HomePage} from "../pages/HomePage";

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
    await home.closeAnyAds()
    await  expect(home.isCategoryExpanded('Women')).resolves.toBe(true)
    console.log('intentando categoria hombres')
    await home.closeAnyAds()
    await home.clickMenCategory()
    await home.closeAnyAds()
    await expect(home.isCategoryExpanded('Men')).resolves.toBe(true)
    console.log('intentando categoria kids')
    await home.closeAnyAds()
    await home.clickKidsCategory()
    await home.closeAnyAds()
    await expect(home.isCategoryExpanded('Kids')).resolves.toBe(true)
    await home.assertOnlyOneCategoryExpanded('Kids')
})
test('add a product', async ({page}) => {
    const home = new HomePage(page)
    await home.start()
    await home.closeAnyAds()
    await home.addToCart('Blue Top')
    await home.closeAnyAds()
    await expect(home.isContinueBtnVisible()).resolves.toBe(true)
    await home.continueShopping()
    await expect(home.isContinueBtnVisible()).resolves.toBe(false)
})
//VAMOOOOO  CARAJOOOOOOOOOO
