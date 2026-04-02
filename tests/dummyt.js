const {chromium} = require('playwright');

(async () => {
    const browser = await chromium.launch({headless: false, slowMo: 80});
    const context  = await browser.newContext();
    const page = await context.newPage();
    try{
        await page.goto('https://www.automationexercise.com/');
        const cartLink = await page.getByRole('class', {name: 'fa fa-shopping-cart'})
        await cartLink.click();
    }catch(e){}
    finally {
        await browser.close();
    }
})();