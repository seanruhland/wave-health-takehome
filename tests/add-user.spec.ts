import { test, expect } from '@playwright/test';

test.describe('Add User Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/add-user');
  });

  test('should display all form fields', async ({ page }) => {
    // Check that all required fields are present
    await expect(page.locator('label').filter({ hasText: 'Name *' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Username *' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Email *' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Street *' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Suite *' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'City *' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Zipcode *' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Company Name *' }).first()).toBeVisible();
  });

  test('should accept valid website URL', async ({ page }) => {
    // Fill in required fields
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="username"]', 'johndoe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="street"]', '123 Main St');
    await page.fill('input[name="suite"]', 'Apt 1');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="zipcode"]', '10001');
    await page.fill('input[name="companyName"]', 'Test Company');

    // Enter valid website URL
    await page.fill('input[placeholder*="website"]', 'https://example.com');
    await page.click('button:has-text("Add User")');

    // Check that no website validation error appears
    await expect(page.locator('text=Please enter a valid URL')).not.toBeVisible();
  });

  test('should validate minimum length requirements', async ({ page }) => {
    // Try to submit with short values
    await page.fill('input[name="name"]', 'J'); // Too short
    await page.fill('input[name="username"]', 'jo'); // Too short
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="street"]', '123 Main St');
    await page.fill('input[name="suite"]', 'Apt 1');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="zipcode"]', '10001');
    await page.fill('input[name="companyName"]', 'Test Company');

    await page.click('button:has-text("Add User")');

    // Check that length validation errors appear
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
    await expect(page.locator('text=Username must be at least 3 characters')).toBeVisible();
  });

    test('should successfully submit form with valid data', async ({ page }) => {
    // Fill in all required fields with valid data
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="username"]', 'johndoe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '555-123-4567');
    await page.fill('input[placeholder*="website"]', 'https://example.com');
    await page.fill('input[name="street"]', '123 Main St');
    await page.fill('input[name="suite"]', 'Apt 1');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="zipcode"]', '10001');
    await page.fill('input[name="companyName"]', 'Test Company');
    await page.fill('input[placeholder*="catch phrase"]', 'Test catch phrase');
    await page.fill('input[placeholder*="company BS"]', 'Test BS');

    // Submit the form
    await page.click('button:has-text("Add User")');

    // Check that form submission was successful by looking for success indicators
    // or checking that we're redirected back to home
    await expect(page).toHaveURL('/');
  });

  test('should clear form when cancel is clicked', async ({ page }) => {
    // Fill in some fields
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="username"]', 'johndoe');
    await page.fill('input[name="email"]', 'john@example.com');

    // Click cancel and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Cancel")'),
    ]);

    // Check that we're redirected back to home
    await expect(page).toHaveURL('/');
  });

  test('should handle optional fields correctly', async ({ page }) => {
    // Fill in only required fields
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="username"]', 'johndoe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="street"]', '123 Main St');
    await page.fill('input[name="suite"]', 'Apt 1');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="zipcode"]', '10001');
    await page.fill('input[name="companyName"]', 'Test Company');

    // Submit without filling optional fields and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Add User")'),
    ]);

    // Check that form submits successfully (no validation errors)
    await expect(page.locator('text=Name must be at least 2 characters')).not.toBeVisible();
    await expect(page.locator('text=Username must be at least 3 characters')).not.toBeVisible();
    await expect(page.locator('text=Email is required')).not.toBeVisible();
  });
});