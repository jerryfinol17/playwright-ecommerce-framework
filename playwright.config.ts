import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.spec.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : 4,
    outputDir: 'test-results',
    timeout: 90_000,        // 90s para todos los tests
    expect: {
        timeout: 15_000,    // 15s para cada assertion
    },

    reporter: [
        ['html'],
        ['monocart-reporter', {
            name: "Coverage Report",
            outputFile: './coverage-report/index.html',
            coverage: {
                reports: ['v8', 'console-details'],
                outputDir: './coverage-report'
            }
        }]
    ],

    use: {
        trace:      'on-first-retry',
        screenshot: 'only-on-failure',
        video:      'retain-on-failure',
        headless:   true,
        baseURL:    'https://www.saucedemo.com',
        launchOptions: { slowMo: 80 }
    },

    projects: [
        // Desktop Browsers
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 }
            },
        },

        {
            name: 'e2e-recorded',
            testMatch: '**/E2ETest.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
                viewport:  { width: 1280, height: 720 },
                headless:  false,
                video:     'on',
                launchOptions: { slowMo: 300 },
            },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'edge',
            use: { ...devices['Desktop Edge'] },
        },

         //Mobile Devices
        {
            name: 'iPhone 13',
            use: { ...devices['iPhone 13'] },
        },
        {
            name: 'Pixel 8',
            use: { ...devices['Pixel 8'] },
        },
    ],
});