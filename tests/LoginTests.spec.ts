import { test, expect } from './fixtures';
import { CREDENTIALS, NEW_USER } from '../pages/config';

function generateUniqueUser() {
    const id = `${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    return {
        ...NEW_USER,
        new_user_email:    `testuser_${id}@mailtest.com`,
        new_user_password: `Pass_${id}`,
    };
}

// TC1: Register User
test('TC1 - Register User', async ({ homePage, loginPage }) => {
    const user = generateUniqueUser();

    await homePage.start();
    await homePage.goToSignUpLogin();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);

    await loginPage.createNewUserFullFlow(user.new_user_name, user.new_user_email, {
        title:         'Mr.',
        password:      user.new_user_password,
        day:           user.new_user_day,
        month:         user.new_user_month,
        year:          user.new_user_year,
        firstName:     user.new_user_first_name,
        lastName:      user.new_user_last_name,
        address1:      user.new_user_address1,
        country:       user.new_user_country,
        state:         user.new_user_state,
        city:          user.new_user_city,
        zipcode:       user.new_user_zipcode,
        mobile:        user.new_user_mobile,
        newsletter:    true,
        specialOffers: true,
    });

    await expect(homePage.isLoggedIn()).resolves.toBe(true);
    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});

// TC2: Login User with correct email and password
test('TC2 - Login User with correct credentials', async ({ homePage, loginPage }) => {
    const user = generateUniqueUser();

    await homePage.start();
    await homePage.goToSignUpLogin();

    await loginPage.createNewUserFullFlow(user.new_user_name, user.new_user_email, {
        title:         'Mr.',
        password:      user.new_user_password,
        day:           user.new_user_day,
        month:         user.new_user_month,
        year:          user.new_user_year,
        firstName:     user.new_user_first_name,
        lastName:      user.new_user_last_name,
        address1:      user.new_user_address1,
        country:       user.new_user_country,
        state:         user.new_user_state,
        city:          user.new_user_city,
        zipcode:       user.new_user_zipcode,
        mobile:        user.new_user_mobile,
        newsletter:    true,
        specialOffers: true,
    });

    await loginPage.clickLogout();
    await homePage.goToSignUpLogin();
    await loginPage.loginWithExistingUser(user.new_user_email, user.new_user_password);

    await expect(homePage.isLoggedIn()).resolves.toBe(true);

    await loginPage.clickDeleteAccount();
    await expect(loginPage.expectAccountDeleted()).resolves.toBe(true);
});

// TC3: Login User with incorrect email and password
test('TC3 - Login with wrong credentials', async ({ homePage, loginPage }) => {
    await homePage.start();
    await homePage.goToSignUpLogin();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);

    await loginPage.loginWithExistingUser(
        CREDENTIALS.incorrect_user.email,
        CREDENTIALS.incorrect_user.password
    );

    await expect(loginPage.expectLoginError()).resolves.toBe(true);
});

// TC4: Logout User
test('TC4 - Logout User', async ({ homePage, loginPage }) => {
    const user = generateUniqueUser();

    await homePage.start();
    await homePage.goToSignUpLogin();

    await loginPage.createNewUserFullFlow(user.new_user_name, user.new_user_email, {
        title:         'Mr.',
        password:      user.new_user_password,
        day:           user.new_user_day,
        month:         user.new_user_month,
        year:          user.new_user_year,
        firstName:     user.new_user_first_name,
        lastName:      user.new_user_last_name,
        address1:      user.new_user_address1,
        country:       user.new_user_country,
        state:         user.new_user_state,
        city:          user.new_user_city,
        zipcode:       user.new_user_zipcode,
        mobile:        user.new_user_mobile,
        newsletter:    true,
        specialOffers: true,
    });

    await expect(homePage.isLoggedIn()).resolves.toBe(true);
    await loginPage.clickLogout();
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);
});

// TC5: Register User with existing email
test('TC5 - Register User with existing email', async ({ homePage, loginPage }) => {
    const user = generateUniqueUser();

    await homePage.start();
    await homePage.goToSignUpLogin();

    await loginPage.createNewUserFullFlow(user.new_user_name, user.new_user_email, {
        title:         'Mr.',
        password:      user.new_user_password,
        day:           user.new_user_day,
        month:         user.new_user_month,
        year:          user.new_user_year,
        firstName:     user.new_user_first_name,
        lastName:      user.new_user_last_name,
        address1:      user.new_user_address1,
        country:       user.new_user_country,
        state:         user.new_user_state,
        city:          user.new_user_city,
        zipcode:       user.new_user_zipcode,
        mobile:        user.new_user_mobile,
        newsletter:    true,
        specialOffers: true,
    });

    await loginPage.clickLogout();
    await homePage.goToSignUpLogin();
    await loginPage.signupNewUser(user.new_user_name, user.new_user_email);
    await expect(loginPage.expectSignupError()).resolves.toBe(true);
});

// TC7: Verify Test Cases Page
test('TC7 - Verify Test Cases Page', async ({ homePage }) => {
    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
    await homePage.gotoTestCases();
    await expect(homePage.isOnTestCasesPage()).resolves.toBe(true);
});