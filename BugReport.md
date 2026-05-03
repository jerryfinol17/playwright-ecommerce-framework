Bug Report: High Flakiness in E-commerce Website (automationexercise.com)Report ID: FLAK-001
Date: May 02, 2026
Tester: Jerry Finol – QA Automation Engineer
Environment: Playwright + TypeScript Framework
Target Site: https://www.automationexercise.com/
1. Summary:
The website automationexercise.com presents recurrent flakiness during automated E2E testing, especially in critical flows such as Add to Cart and Checkout. These instabilities are not caused by the automation framework, but by implementation issues on the frontend (AJAX handling, mixed content, and race conditions).
2. Issues Identified

|#  |Issue       |Affected Flows     |Frequency       |Root Cause     |
|---|------------|-------------------|----------------|---------------|
| 1 | AJAX Cart Modal not appearing intermittently |Add to Cart, Cart Update |High  | jQuery AJAX response delay or failure. Modal confirmation does not show consistently.|
|2  |Mixed Content blocking jQuery listeners |Cart & Checkout (especially Firefox & WebKit) |Medium-High |Site loads HTTP resources on HTTPS page, breaking event listeners.|
| 3 |Race conditions on navigation |Product pages, Checkout steps |Medium |waitForNavigation deprecated + unpredictable load timing across browsers.|
|4 |ERR_CONNECTION_CLOSED / Network timeouts |Any heavy AJAX flow |Medium |Server-side instability under concurrent requests.|

3. Impact:
Initial test run (April 21, 2026): 220 tests → 5 failed + 8 flaky
Total failure rate before fixes: ~6%
These issues make reliable CI/CD difficult and increase maintenance effort.

4. Solutions :
Implemented in FrameworkTo overcome these site-specific problems, the following anti-flaky strategies were implemented:Smart Retry Logic (addToCartWithRetry()): Up to 3 retries with exponential backoff for cart operations.
Route-level Ad & Mixed Content Blocking: Using page.route() to block HTTP resources.
Replaced waitForNavigation with waitForURL + waitUntil: 'load' for more reliable navigation.
Custom BasePage methods with intelligent waiting and fallback mechanisms (clickElement(), clickAndNavigateTo()).
Increased default retries in GitHub Actions CI.

## Results:
after fixes (April 23, 2026):220 tests → 0 hard failures, only 4 minor flaky (caused by network timeouts from the site).

Significant stability improvement.

5. Recommendations for the Site Owner:
Migrate all resources to HTTPS to eliminate mixed content issues.
Improve AJAX error handling and response consistency on cart operations.
Add proper loading indicators or better event handling for dynamic elements.

6. Evidence:
Full framework with fixes: https://github.com/jerryfinol17/playwright-ecommerce-framework
Before / After comparison screenshots available in repository.
CI/CD pipeline logs showing stability improvements.

Status: Identified & Mitigated at Framework Level (Client-side workaround)