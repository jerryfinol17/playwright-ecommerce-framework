import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.spec.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : 4,
    outputDir: 'test-results',
    timeout: 90_000,
    expect: {
        timeout: 15_000,
    },

    reporter: [
        ['html'],
        ['monocart-reporter', {
            name: "Coverage Report",
            outputFile: './coverage-report/index.html',
            coverage: {
                outputDir: './coverage-report'
            }
        }]
    ],

    use: {
        trace:      'on-first-retry',
        screenshot: 'only-on-failure',
        video:      'retain-on-failure',
        headless:   true,
        baseURL:    'https://www.automationexercise.com/',
        launchOptions: { slowMo: 80 }
    },

    projects: [
         // Desktop Browsers
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 },
                headless: true
            },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'],
            headless:  true,},

        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'],
            headless:  true,},
        },
        {
            name: 'edge',
            use: { ...devices['Desktop Edge'],
            headless:  true,},
        },

         //Mobile Devices
        {
            name: 'iPhone 13',
            use: { ...devices['iPhone 13'],
            headless:  true,},
        },
        {
            name: 'Pixel 8',
            use: { ...devices['Pixel 8'],
            headless:  true,},
        },
    ],
});