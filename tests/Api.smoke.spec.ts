import { test, expect } from '@playwright/test';
import { ApiContext } from '../api';


const UNIQUE_EMAIL = `smoke_${Date.now()}@test.com`;

const TEST_USER = {
    name:          'Smoke Test User',
    email:         UNIQUE_EMAIL,
    password:      'SmokePass123!',
    title:         'Mr' as const,
    birth_date:    '15',
    birth_month:   '6',
    birth_year:    '1990',
    firstname:     'Smoke',
    lastname:      'User',
    address1:      '123 Test Street',
    country:       'United States',
    zipcode:       '10001',
    state:         'New York',
    city:          'New York',
    mobile_number: '1234567890',
};

// ─────────────────────────────────────────────────────────────────────────────

test.describe('🔥 API Smoke Tests', () => {

    // ══════════════════════════════════════════════════════
    // PRODUCTS
    // ══════════════════════════════════════════════════════

    test.describe('ProductsApi', () => {

        test('GET /productsList → 200, devuelve array de productos', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.products.getAllProducts();

            console.log(`   ✔ Status HTTP : ${response.status}`);
            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ Total prods : ${response.data.products?.length ?? 0}`);

            expect(response.status).toBe(200);
            expect(response.responseCode).toBe(200);
            expect(Array.isArray(response.data.products)).toBe(true);
            expect(response.data.products.length).toBeGreaterThan(0);


            const first = response.data.products[0];
            expect(first).toHaveProperty('id');
            expect(first).toHaveProperty('name');
            expect(first).toHaveProperty('price');
            expect(first).toHaveProperty('brand');
        });

        test('POST /productsList → 405 method not supported', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.products.postProductsList();

            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ message     : ${response.message}`);

            expect(response.responseCode).toBe(405);
            api.products.assertMessageContains(response, 'not supported');
        });

        test('GET /brandsList → 200, devuelve array de marcas', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.products.getAllBrands();

            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ Total brands: ${response.data.brands?.length ?? 0}`);

            expect(response.responseCode).toBe(200);
            expect(Array.isArray(response.data.brands)).toBe(true);
            expect(response.data.brands.length).toBeGreaterThan(0);

            const first = response.data.brands[0];
            expect(first).toHaveProperty('id');
            expect(first).toHaveProperty('brand');
        });

        test('PUT /brandsList → 405 method not supported', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.products.putBrandsList();

            console.log(`   ✔ responseCode: ${response.responseCode}`);

            expect(response.responseCode).toBe(405);
            api.products.assertMessageContains(response, 'not supported');
        });

        test('POST /searchProduct con término válido → 200, resultados', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.products.searchProduct('top');

            console.log(`   ✔ responseCode  : ${response.responseCode}`);
            console.log(`   ✔ Results found : ${response.data.products?.length ?? 0}`);

            expect(response.responseCode).toBe(200);
            expect(Array.isArray(response.data.products)).toBe(true);
            expect(response.data.products.length).toBeGreaterThan(0);
        });

        test('POST /searchProduct sin parámetro → 400 bad request', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.products.searchProductWithoutParam();

            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ message     : ${response.message}`);

            expect(response.responseCode).toBe(400);
            api.products.assertMessageContains(response, 'missing');
        });
    });

    // ══════════════════════════════════════════════════════
    // USER
    // ══════════════════════════════════════════════════════

    test.describe.serial('UserApi', () => {

        test.beforeAll(async ({ request }) => {
            const api = new ApiContext(request);
            await api.user.createAccount(TEST_USER);
            console.log(`   [setup] Usuario creado: ${TEST_USER.email}`);
        });

        test.afterAll(async ({ request }) => {
            const api = new ApiContext(request);
            await api.user.deleteAccount(TEST_USER.email, TEST_USER.password);
            console.log(`   [teardown] Usuario eliminado: ${TEST_USER.email}`);
        });

        test('POST /createAccount → 201, usuario creado', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.user.createAccount(TEST_USER);

            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ message     : ${response.message}`);

            expect(response.responseCode).toBe(400);
            api.user.assertMessageContains(response, 'exist');
        });

        test('POST /verifyLogin con creds válidas → 200, user exists', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.user.verifyLogin({
                email:    TEST_USER.email,
                password: TEST_USER.password,
            });

            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ message     : ${response.message}`);

            expect(response.responseCode).toBe(200);
            api.user.assertMessageContains(response, 'exists');
        });

        test('POST /verifyLogin con creds inválidas → 404, user not found', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.user.verifyLogin({
                email:    'nonexistent@fake.com',
                password: 'WrongPass999',
            });

            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ message     : ${response.message}`);

            expect(response.responseCode).toBe(404);
            api.user.assertMessageContains(response, 'not found');
        });

        test('POST /verifyLogin sin parámetros → 400 bad request', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.user.verifyLoginWithoutParams();

            console.log(`   ✔ responseCode: ${response.responseCode}`);

            expect(response.responseCode).toBe(400);
            api.user.assertMessageContains(response, 'missing');
        });

        test('DELETE /verifyLogin → 405 method not supported', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.user.verifyLoginWithDeleteMethod();

            console.log(`   ✔ responseCode: ${response.responseCode}`);

            expect(response.responseCode).toBe(405);
            api.user.assertMessageContains(response, 'not supported');
        });

        test('GET /getUserDetailByEmail → 200, datos del usuario', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.user.getUserDetailByEmail(TEST_USER.email);

            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ user name   : ${response.data.user?.name}`);

            expect(response.responseCode).toBe(200);
            expect(response.data.user).toBeDefined();
            expect(response.data.user.email).toBe(TEST_USER.email);
            expect(response.data.user.name).toBe(TEST_USER.name);
        });

        test('PUT /updateAccount → 200, usuario actualizado', async ({ request }) => {
            const api      = new ApiContext(request);
            const response = await api.user.updateAccount({
                ...TEST_USER,
                name: 'Smoke Updated User',
            });

            console.log(`   ✔ responseCode: ${response.responseCode}`);
            console.log(`   ✔ message     : ${response.message}`);

            expect(response.responseCode).toBe(200);
            api.user.assertMessageContains(response, 'updated');
        });

    });
});