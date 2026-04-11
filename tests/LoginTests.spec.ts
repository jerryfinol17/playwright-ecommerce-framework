import { CREDENTIALS, NEW_USER } from "../pages/config";
import { test, expect } from "./fixtures";

function generateUniqueUser() {
    const id = `${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    return {
        ...NEW_USER,
        new_user_email: `testuser_${id}@mailtest.com`,
        new_user_password: `Pass_${id}`,
    };
}

test('Register User', async ({ homePage, loginPage }) => {
    const user = generateUniqueUser();

    await homePage.start();
    await homePage.goToSignUpLogin();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);
    await loginPage.createNewUserFullFlow(
        user.new_user_name,
        user.new_user_email,
        {
            title: "Mr.",
            password: user.new_user_password,
            day: user.new_user_day,
            month: user.new_user_month,
            year: user.new_user_year,
            firstName: user.new_user_first_name,
            lastName: user.new_user_last_name,
            address1: user.new_user_address1,
            country: user.new_user_country,
            state: user.new_user_state,
            city: user.new_user_city,
            zipcode: user.new_user_zipcode,
            mobile: user.new_user_mobile,
            newsletter: true,
            specialOffers: true,
        }
    );
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
});

test('Login with Regular Email and Logout', async ({ homePage, loginPage }) => {
    const user = generateUniqueUser();

    await homePage.start();
    await homePage.goToSignUpLogin();
    await loginPage.createNewUserFullFlow(
        user.new_user_name,
        user.new_user_email,
        {
            title: "Mr.",
            password: user.new_user_password,
            day: user.new_user_day,
            month: user.new_user_month,
            year: user.new_user_year,
            firstName: user.new_user_first_name,
            lastName: user.new_user_last_name,
            address1: user.new_user_address1,
            country: user.new_user_country,
            state: user.new_user_state,
            city: user.new_user_city,
            zipcode: user.new_user_zipcode,
            mobile: user.new_user_mobile,
            newsletter: true,
            specialOffers: true,
        }
    );
    await loginPage.clickLogout()
    await homePage.goToSignUpLogin();
    await loginPage.loginWithExistingUser(user.new_user_email, user.new_user_password);
    await expect(loginPage.expectLoginError()).resolves.toBe(false);
    await loginPage.clickLogout();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);
});

test('Register User with Existing Mail', async ({ homePage, loginPage }) => {
    const user = generateUniqueUser();

    await homePage.start();
    await homePage.goToSignUpLogin();
    await loginPage.createNewUserFullFlow(
        user.new_user_name,
        user.new_user_email,
        {
            title: "Mr.",
            password: user.new_user_password,
            day: user.new_user_day,
            month: user.new_user_month,
            year: user.new_user_year,
            firstName: user.new_user_first_name,
            lastName: user.new_user_last_name,
            address1: user.new_user_address1,
            country: user.new_user_country,
            state: user.new_user_state,
            city: user.new_user_city,
            zipcode: user.new_user_zipcode,
            mobile: user.new_user_mobile,
            newsletter: true,
            specialOffers: true,
        }
    );
    await loginPage.clickLogout();
    await homePage.goToSignUpLogin();
    await loginPage.signupNewUser(user.new_user_name, user.new_user_email);
    await expect(loginPage.expectSignupError()).resolves.toBe(true);
});

test('Delete Account', async ({ homePage, loginPage }) => {
    const user = generateUniqueUser();

    await homePage.start();
    await homePage.goToSignUpLogin();
    await loginPage.createNewUserFullFlow(
        user.new_user_name,
        user.new_user_email,
        {
            title: "Mr.",
            password: user.new_user_password,
            day: user.new_user_day,
            month: user.new_user_month,
            year: user.new_user_year,
            firstName: user.new_user_first_name,
            lastName: user.new_user_last_name,
            address1: user.new_user_address1,
            country: user.new_user_country,
            state: user.new_user_state,
            city: user.new_user_city,
            zipcode: user.new_user_zipcode,
            mobile: user.new_user_mobile,
            newsletter: true,
            specialOffers: true,
        }
    );
    await homePage.isOnHomePage();
    await loginPage.clickDeleteAccount();
    await loginPage.takeScreenshot('DeleteAccount');
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});

test('Login with wrong Credentials', async ({ homePage, loginPage }) => {
    await homePage.start();
    await homePage.goToSignUpLogin();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);
    await loginPage.loginWithExistingUser(
        CREDENTIALS.incorrect_user.email,
        CREDENTIALS.incorrect_user.password
    );
    await expect(loginPage.expectLoginError()).resolves.toBe(true);
});