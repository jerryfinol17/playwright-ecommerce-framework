import { test, expect } from './fixtures';
import path from 'path';

// TC6: Contact Us Form
test('TC6 - Contact Us Form', async ({ homePage }) => {
    await homePage.start();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);

    await homePage.goToContactUs();

    const filePath = path.join(__dirname, '..', 'utils', 'fake-file.txt');
    await homePage.fillContactForm('Juan', 'juan@gmail.com', 'Subject de prueba', 'Mensaje de prueba', filePath);
    await homePage.submitContactForm();

    expect(await homePage.isContactSuccessVisible()).toBe(true);

    await homePage.goHomeFromContact();
    await expect(homePage.isOnHomePage()).resolves.toBe(true);
});