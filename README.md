# 🎭 Playwright E-Commerce Framework

### Production-Ready End-to-End Automation for Modern E-Commerce Applications

![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2CA5E0?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/jerryfinol17/playwright-ecommerce-framework/main.yml?style=for-the-badge&label=CI&logo=github-actions&logoColor=white)

---

## About the Project

This repository showcases how I approach automation engineering when testing modern e-commerce applications.

Rather than building a simple collection of automated test cases, the objective was to create a framework capable of handling the kinds of challenges engineers encounter in real projects.

Unstable AJAX requests.

Cross-browser inconsistencies.

Race conditions.

Mixed-content issues.

Flaky user interactions.

The framework automates the complete customer journey—from account registration to checkout—while prioritizing maintainability, reliability, and long-term scalability.

---

## Why I Built It

Modern web applications rarely behave perfectly.

Network latency changes.

Browsers behave differently.

Third-party scripts fail.

AJAX requests become intermittent.

Building automated tests is relatively straightforward.

Building tests that teams can consistently trust is considerably more challenging.

This project focuses on solving those engineering problems instead of hiding them behind longer timeouts.

---

## Highlights

- Complete E-Commerce User Journey
- UI + REST API Testing
- Production-ready Page Object Model
- Cross-browser execution
- Custom Playwright Fixtures
- Retry strategies for unstable AJAX operations
- Environment-based configuration
- Automatic screenshots, videos and traces
- Monocart HTML Reports
- GitHub Actions CI/CD
- Scheduled workflow execution
- Flakiness mitigation strategies

---

## What This Framework Covers

The automation validates complete business-critical workflows including:

- User Registration
- Authentication
- Product Discovery
- Search
- Categories
- Shopping Cart
- Checkout
- Order Confirmation
- User Account Management
- REST API validation

Rather than validating isolated pages, the framework reproduces realistic customer journeys from beginning to end.

---

## Engineering Challenges

One aspect I particularly enjoyed while building this project was investigating instability that originated outside the framework itself.

Instead of simply increasing timeouts whenever a test became unreliable, I spent time understanding why those failures occurred.

That process led to several engineering improvements, including:

- Smarter waiting strategies
- Retry mechanisms for intermittent AJAX failures
- Route-level blocking for problematic third-party resources
- Cross-browser navigation improvements
- Environment-aware configuration

The result wasn't simply a greener test suite.

It was a framework that became more reliable because its problems were understood rather than ignored.

---

## Repository Structure

```text
.
├── .github/
├── pages/
├── tests/
├── fixtures/
├── helpers/
├── api/
├── utils/
└── playwright.config.ts
```

A complete explanation of the framework architecture, design decisions, flakiness mitigation strategies, and engineering decisions is available in **ARCHITECTURE.md**.

---

## Running the Project

Clone the repository:

```bash
git clone https://github.com/jerryfinol17/playwright-ecommerce-framework.git

cd playwright-ecommerce-framework
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

Run the complete test suite:

```bash
npm test
```

---

## Continuous Validation

Quality shouldn't only be verified when new code is written.

This repository includes **GitHub Actions** workflows that automatically execute the test suite on pushes, pull requests, and scheduled runs to ensure the framework remains healthy as browsers, dependencies, and the surrounding ecosystem continue to evolve.

Software changes.

Browsers change.

GitHub runners change.

A reliable automation framework should evolve with them.

---

## Why This Repository Matters

This repository demonstrates more than Playwright knowledge.

It reflects how I approach automation engineering:

- Understanding failures before fixing them.
- Building maintainable architectures.
- Writing resilient automation.
- Designing tests around real user behavior.
- Treating automation as an engineering discipline rather than simply writing scripts.

Because successful automation isn't measured by how many tests pass today.

It's measured by how confidently teams can rely on those tests tomorrow.

---

## Technical Documentation

This repository includes a dedicated engineering document covering the framework in depth.

Topics include:

- Architecture decisions
- Design patterns
- Test organization
- Flakiness mitigation
- Cross-browser strategy
- CI/CD implementation
- API testing approach
- Lessons learned

📖 **Read the full documentation:** `ARCHITECTURE.md`

---

## Looking for a Custom Automation Framework?

I help startups and software teams build reliable automation solutions through:

- Playwright (TypeScript & Python)
- Selenium
- REST API Testing
- CI/CD Integration
- Automation Framework Design
- Analytical Testing
- UX-Oriented QA Reviews

---
## Let's Connect

<p align="center">

<a href="mailto:jerrytest124@gmail.com">📧 Email</a> •
<a href="https://linkedin.com/in/jerry-finol">💼 LinkedIn</a> •
<a href="https://jerryfinol17.github.io/JerryFinolQA/">🌐 Portfolio</a>

<br><br>

<a href="https://x.com/JerryFinolQA">𝕏 X</a> •
<a href="https://www.reddit.com/user/Jerry_Finol17/">👽 Reddit</a> •
<a href="https://www.instagram.com/jerryfinolqa/">📷 Instagram</a>
<a href="https://www.facebook.com/JerryFinolQA">📘 Facebook</a>
---

> **Understand first. Test second. Explain always.**
