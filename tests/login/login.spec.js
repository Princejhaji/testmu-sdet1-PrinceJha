const { test, expect } = require('@playwright/test');
const { explainFailure } = require('../../ai/failureExplainer');
const { LoginPage } = require('../../page/login.page');

// I selected option A (failure explainer) over option B (flaky classifier) since it
// offers feedback on each failure within the report rather than having to wait
// for the entire process to be completed before getting feedback.

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log('Test failed — asking AI to explain what went wrong...');

    const errorMessage = testInfo.error?.message || 'No error message captured';
    const stackTrace = testInfo.error?.stack || '';

    const explanation = await explainFailure({
      testTitle: testInfo.title,
      errorMessage,
      stackTrace,
    });

    console.log('AI Explanation:\n', explanation);

    await testInfo.attach('AI Failure Explanation', {
      body: explanation,
      contentType: 'text/plain',
    });

    if (page && !page.isClosed()) {
      const screenshot = await page.screenshot();
      await testInfo.attach('Failure Screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  }
});

test('TC_LOGIN_001: Successful login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);
});

test('TC_LOGIN_002: Login fails with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'wrong_password');

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Username and password do not match'
  );
});

test('TC_LOGIN_003 (INTENTIONAL FAIL): demo the AI failure explainer', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // Intentionally false statement so this WILL NOT work, leading to the above-mentioned AI explanation 
  await expect(page).toHaveURL(/Wrong_Path/);
});