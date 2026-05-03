import { test, expect } from '../fixtures/fixtures';
import { createUserData } from '../helpers/userHelpers';

// TC8: Verify All Products and product detail page
test('TC8 - Verify All Products and product detail page', async ({ homePage, productsPage }) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    const names = await productsPage.getAllProductNames();
    expect(names.length).toBeGreaterThan(0);

    await productsPage.goToFirstProduct();

    const title        = await productsPage.getProductTitle();
    const price        = await productsPage.getProductPrice();
    const brand        = await productsPage.getBrand();
    const availability = await productsPage.getAvailability();
    const condition    = await productsPage.getCondition();

    expect(title).toBeTruthy();
    expect(price).toBeTruthy();
    expect(brand).toBeTruthy();
    expect(availability).toBeTruthy();
    expect(condition).toBeTruthy();
});

// TC9: Search Product
test('TC9 - Search Product', async ({ homePage, productsPage }) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    await productsPage.searchProduct('Sleeveless Dress');
    const results = await productsPage.getSearchResultNames();

    expect(results.length).toBeGreaterThan(0);
    results.forEach(name => {
        expect(name.toLowerCase()).toContain('dress');
    });
});

// TC18: View Category Products
test('TC18 - View Category Products', async ({ homePage }) => {
    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    await homePage.clickSubCategory('Women', 'Dress');
    await expect(homePage.isCategoryPageHeadingVisible('Women - Dress Products')).resolves.toBe(true);

    await homePage.clickSubCategory('Men', 'Tshirts');
    await expect(homePage.isCategoryPageHeadingVisible('Men - Tshirts Products')).resolves.toBe(true);

    await homePage.clickSubCategory('Kids', 'Tops & Shirts');
    await expect(homePage.isCategoryPageHeadingVisible('Kids - Tops & Shirts Products')).resolves.toBe(true);
});

// TC19: View & Cart Brand Products
test('TC19 - View & Cart Brand Products', async ({ homePage, productsPage }) => {
    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);
    await expect(productsPage.isBrandsSidebarVisible()).resolves.toBe(true);

    await productsPage.clickBrand('Polo');
    await expect(productsPage.isBrandPageVisible('Polo')).resolves.toBe(true);

    await productsPage.clickBrand('H&M');
    await expect(productsPage.isBrandPageVisible('H&M')).resolves.toBe(true);
});

// TC21: Add review on product
test('TC21 - Add review on product', async ({ homePage, productsPage }) => {
    const user = createUserData();

    await homePage.start();
    await homePage.goToProducts();
    await expect(productsPage.isOnProductPage()).resolves.toBe(true);

    await productsPage.goToFirstProduct();
    await productsPage.submitReview(user.new_user_name, user.new_user_email, 'Es un gran producto, muchas gracias!');
    await expect(productsPage.verifySuccessMsg()).resolves.toBe(true);
});