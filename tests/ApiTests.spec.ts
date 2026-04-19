import { test, expect } from './fixtures';
import { ApiContext } from '../api';



// ==================== HELPERS ====================

function buildTestUser() {
    const id = `${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    return {
        name:          'Test User',
        email:         `testapi_${id}@mailtest.com`,
        password:      `Pass_${id}`,
        title:         'Mr' as const,
        birth_date:    '15',
        birth_month:   '7',
        birth_year:    '1995',
        firstname:     'Test',
        lastname:      'User',
        company:       'QA Corp',
        address1:      '123 Test Street',
        address2:      'Suite 1',
        country:       'United States',
        zipcode:       '10001',
        state:         'New York',
        city:          'New York',
        mobile_number: '1234567890',
    };
}

// ==================== PRODUCTS ====================

test.describe('Products API', () => {

    test('API 1 - GET All Products List → 200 + products array', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.products.getAllProducts();

        api.products.assertResponseCode(response, 200);
        expect(Array.isArray(response.data.products)).toBe(true);
        expect(response.data.products.length).toBeGreaterThan(0);
    });

    test('API 2 - POST All Products List → 405 + method not supported', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.products.postProductsList();

        api.products.assertResponseCode(response, 405);
        api.products.assertMessageContains(response, 'This request method is not supported');
    });

});

// ==================== BRANDS ====================

test.describe('Brands API', () => {

    test('API 3 - GET All Brands List → 200 + brands array', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.products.getAllBrands();

        api.products.assertResponseCode(response, 200);
        expect(Array.isArray(response.data.brands)).toBe(true);
        expect(response.data.brands.length).toBeGreaterThan(0);
    });

    test('API 4 - PUT All Brands List → 405 + method not supported', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.products.putBrandsList();

        api.products.assertResponseCode(response, 405);
        api.products.assertMessageContains(response, 'This request method is not supported');
    });

});

// ==================== SEARCH ====================

test.describe('Search Product API', () => {

    test('API 5 - POST Search Product with valid param → 200 + results', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.products.searchProduct('top');

        api.products.assertResponseCode(response, 200);
        expect(Array.isArray(response.data.products)).toBe(true);
        expect(response.data.products.length).toBeGreaterThan(0);
    });

    test('API 6 - POST Search Product without param → 400 + bad request message', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.products.searchProductWithoutParam();

        api.products.assertResponseCode(response, 400);
        api.products.assertMessageContains(response, 'Bad request, search_product parameter is missing in POST request');
    });

});

// ==================== VERIFY LOGIN ====================

test.describe('Verify Login API', () => {

    test('API 7 - POST Verify Login with valid credentials → 200 + User exists!', async ({ request }) => {
        const api  = new ApiContext(request);
        const user = buildTestUser();

        // Setup: crear usuario para que el login sea válido
        await api.user.createAccount(user);

        const response = await api.user.verifyLogin({
            email:    user.email,
            password: user.password,
        });

        api.user.assertResponseCode(response, 200);
        api.user.assertMessageContains(response, 'User exists!');

        // Teardown
        await api.user.deleteAccount(user.email, user.password);
    });

    test('API 8 - POST Verify Login without email param → 400 + bad request message', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.user.verifyLoginWithoutParams();

        api.user.assertResponseCode(response, 400);
        api.user.assertMessageContains(response, 'Bad request, email or password parameter is missing in POST request');
    });

    test('API 9 - DELETE Verify Login → 405 + method not supported', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.user.verifyLoginWithDeleteMethod();

        api.user.assertResponseCode(response, 405);
        api.user.assertMessageContains(response, 'This request method is not supported');
    });

    test('API 10 - POST Verify Login with invalid credentials → 404 + User not found!', async ({ request }) => {
        const api      = new ApiContext(request);
        const response = await api.user.verifyLogin({
            email:    'nonexistent_user_xyz@fake.com',
            password: 'WrongPass123',
        });

        api.user.assertResponseCode(response, 404);
        api.user.assertMessageContains(response, 'User not found!');
    });

});

// ==================== USER ACCOUNT CRUD ====================

test.describe('User Account API', () => {

    test('API 11 - POST Create User Account → 201 + User created!', async ({ request }) => {
        const api      = new ApiContext(request);
        const user     = buildTestUser();
        const response = await api.user.createAccount(user);

        api.user.assertResponseCode(response, 201);
        api.user.assertMessageContains(response, 'User created!');

        // Teardown
        await api.user.deleteAccount(user.email, user.password);
    });

    test('API 12 - DELETE User Account → 200 + Account deleted!', async ({ request }) => {
        const api  = new ApiContext(request);
        const user = buildTestUser();

        // Setup
        await api.user.createAccount(user);

        const response = await api.user.deleteAccount(user.email, user.password);

        api.user.assertResponseCode(response, 200);
        api.user.assertMessageContains(response, 'Account deleted!');
    });

    test('API 13 - PUT Update User Account → 200 + User updated!', async ({ request }) => {
        const api  = new ApiContext(request);
        const user = buildTestUser();

        // Setup
        await api.user.createAccount(user);

        const updatedUser = { ...user, name: 'Updated Name', city: 'Los Angeles' };
        const response    = await api.user.updateAccount(updatedUser);

        api.user.assertResponseCode(response, 200);
        api.user.assertMessageContains(response, 'User updated!');

        // Teardown
        await api.user.deleteAccount(user.email, user.password);
    });

    test('API 14 - GET User Detail by Email → 200 + user object', async ({ request }) => {
        const api  = new ApiContext(request);
        const user = buildTestUser();

        // Setup
        await api.user.createAccount(user);

        const response = await api.user.getUserDetailByEmail(user.email);

        api.user.assertResponseCode(response, 200);
        expect(response.data.user).toBeDefined();
        expect(response.data.user.email).toBe(user.email);
        expect(response.data.user.first_name).toBe(user.firstname);

        // Teardown
        await api.user.deleteAccount(user.email, user.password);
    });

});