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
        await this.blockAds()
        await this.page.goto(url, {waitUntil: 'networkidle'});
        await this.waitForPageLoad();
    }
    protected async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(800);
    }

    protected async clickAndNavigateTo(
        locator: string | Locator,
        urlPattern?: string | RegExp,
        options: { force?: boolean; timeout?: number } = {}
    ): Promise<void> {
        const timeout = options.timeout ?? 15000;

        if (urlPattern) {
            await Promise.all([
                this.page.waitForURL(urlPattern, { waitUntil: 'networkidle', timeout }),
                this.clickElement(locator, options),
            ]);
        } else {
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'networkidle', timeout }),
                this.clickElement(locator, options),
            ]);
        }
    }

    // ============== Evidence =========================
    async takeScreenshot(name: string): Promise<void> {
        const timeStamp = new Date().toISOString().replace(/[:.]/g,'-');
        await this.page.screenshot({path: `reports/screenshots/${name}-${timeStamp}.png`});
    }

    // ===== Close adds =====================
    async blockAds(): Promise<void> {
        await this.page.route('**/*', (route) => {
            const url = route.request().url();
            const isAd = [
                'googlesyndication',
                'doubleclick',
                'googleadservices',
                'adservice.google',
                'google_vignette',
                'pagead2',
                'googletagmanager',
                'googletagservices',
                'adnxs',
                'amazon-adsystem',
                'adsafeprotected',
                'moatads',
                'rubiconproject',
                'openx',
                'pubmatic',
                'criteo',
                'taboola',
                'outbrain',
                'scorecardresearch',
                'quantserve',
                '/ads/',
                'popads',
                'popcash',
            ].some(domain => url.includes(domain));

            isAd ? route.abort() : route.continue();
        });}
}