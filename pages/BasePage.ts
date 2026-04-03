import {Page, Locator, expect} from'@playwright/test';

export abstract class BasePage {
    protected readonly page: Page;
    private timeout = 15000;
    constructor(page: Page) {
        this.page = page;
    }
    //==============Interaction===========================================
    async fillInput(locator: string | Locator, value: string, clearFirst: boolean = true): Promise<void> {
        const loc = this.#getLocator(locator);
        if(clearFirst){
            await loc.clear();
        }
        await loc.fill(value);
    }
    async clickElement(
        locator: string | Locator,
        options: { force?: boolean; timeout?: number; } = {}
    ): Promise<void> {

        const loc = this.#getLocator(locator);

        const clickOptions = {
            timeout: options.timeout ?? 10000,
            force: options.force ?? false,
            ...options
        };

        try {
            await loc.waitFor({
                state: 'visible',
                timeout: clickOptions.timeout
            });

            await loc.click(clickOptions);

        } catch (error) {
            console.log(`Click normal falló para ${locator}, intentando con force: true`);
            await loc.click({
                force: true,
                timeout: clickOptions.timeout,
            });
        }
    }
    async waitForVisible(locator: string | Locator, timeout: number = this.timeout): Promise<Locator> {
        const loc = this.#getLocator(locator);
        await loc.waitFor({state: 'visible', timeout});
        return loc
    }

    // ================ Getters Info ============================
    async getText(locator: string | Locator): Promise<string> {
        const loc = this.#getLocator(locator);
        return await loc.innerText();
    }
    getCurrentURL(): string{
        return this.page.url()
    }
    //=================== Assert ==================================
    async assertCurrentUrlContain(expectedSubstring: string, message: string | null = null): Promise<boolean> {
        const current = this.getCurrentURL();
        if(!current.includes(expectedSubstring)) {
            throw new Error(message || `URL "${current}" does not contain "${expectedSubstring}"`);
        }
        return current.includes(expectedSubstring);
    }
    async assertTextEquals(locator: string | Locator, expectedText: string): Promise<void> {
        const loc = this.#getLocator(locator);
        await expect(loc).toHaveText(expectedText);
    }

    async isVisible(locator: string | Locator): Promise<boolean> {
        const loc = this.#getLocator(locator);
        return await loc.isVisible();
    }
    // ==================== Private Helper ==========================
    #getLocator(locator: string | Locator): Locator{
        if (typeof locator === 'string') {
            return this.page.locator(locator);
        }
        return locator;
    }

    // ============= Navigate and waits ==========================

    protected async goto(url: string): Promise<void> {
        await this.page.goto(url, {waitUntil: 'networkidle'});
        await this.waitForPageLoad();
    }
    protected async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(800);
    }

    // ============== Evidence =========================
    async takeScreenshot(name: string): Promise<void> {
        const timeStamp = new Date().toISOString().replace(/[:.]/g,'-');
        await this.page.screenshot({path: `reports/screenshots/${name}-${timeStamp}.png`});
    }

    // ===== Close adds =====================
    async closeAnyAds(): Promise<void> {
        try {
            console.log('🔍 Buscando anuncios...');

            const strategies = [
                () => this.page
                    .locator('iframe[name*="aswift"]')
                    .contentFrame()
                    .getByRole('button', { name: 'Close ad' })
                    .first(),

                () => this.page
                    .locator('iframe[name*="aswift"]')
                    .contentFrame()
                    .getByRole('button', { name: 'Close' })
                    .first(),

                () => this.page
                    .locator('iframe[name*="aswift"]')
                    .contentFrame()
                    .locator('iframe[name="ad_iframe"]')
                    .contentFrame()
                    .getByRole('button', { name: /Close|Dismiss/i })
                    .first(),

                () => this.page.locator('button[aria-label*="Close ad"], button[aria-label*="close"]').first(),

                () => this.page.getByRole('button', { name: /Close|Dismiss|×|✕/i }).first(),
            ];

            for (const getLocator of strategies) {
                const closeBtn = getLocator();

                const isVisible = await closeBtn.isVisible({ timeout: 2500 }).catch(() => false);

                if (isVisible) {
                    console.log('🛡️  Anuncio detectado → cerrándolo...');
                    await closeBtn.click({ force: true, timeout: 6000 });
                    await this.page.waitForTimeout(1200);
                    return;
                }
            }

            console.log('ℹ️  No se encontró ningún anuncio');

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('⚠️  Error al intentar cerrar anuncio (no crítico):', message);
        }
    }
}