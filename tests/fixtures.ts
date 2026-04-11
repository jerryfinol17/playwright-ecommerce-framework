import {test as base} from '@playwright/test'
import {CartPage} from "../pages/CartPage";
import {HomePage} from "../pages/HomePage";
import {LoginPage} from "../pages/LoginPage";
import {ProductsPage} from "../pages/ProductsPage";

export const test = base.extend<{
    homePage : HomePage;
    loginPage : LoginPage;
    productsPage : ProductsPage;
    cartPage : CartPage;
}>({
    homePage : async({page}, use) =>{
        const homePage = new HomePage(page);
        await use(homePage);
    },
    loginPage : async({page}, use)=>{
    const loginPage = new LoginPage(page);
    await use(loginPage);
    },
    productsPage : async({page}, use) =>{
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },
    cartPage : async({page}, use) =>{
        const cartPage = new CartPage(page);
        await use(cartPage);
    }
})
export {expect} from '@playwright/test'