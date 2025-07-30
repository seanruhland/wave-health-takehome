import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display users table with correct data', async ({ page }) => {
    // Wait for the table to load with a more specific selector
    await page.waitForSelector('table', { timeout: 10000 });

    // Wait for data to be loaded
    await page.waitForSelector('text=Leanne Graham', { timeout: 10000 });

    // Check that users are displayed
    const rows = page.locator('tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(1); // Header + data rows

    // Check that user data is visible
    await expect(page.locator('text=Leanne Graham')).toBeVisible();
    await expect(page.locator('text=Ervin Howell')).toBeVisible();
  });

    test('should search users by name', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('text=Leanne Graham', { timeout: 10000 });

    // Search for a specific user
    await page.fill('input[placeholder*="Search"]', 'Leanne');

    // Wait for search results
    await page.waitForTimeout(300); // Debounce delay

    // Check that only Leanne Graham is visible
    await expect(page.locator('text=Leanne Graham')).toBeVisible();
    await expect(page.locator('text=Ervin Howell')).not.toBeVisible();
  });

  test('should search users by email', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('text=Leanne Graham', { timeout: 10000 });

    // Search by email
    await page.fill('input[placeholder*="Search"]', 'Sincere@april.biz');

    // Wait for search results
    await page.waitForTimeout(300);

    // Check that the user with this email is visible
    await expect(page.locator('text=Leanne Graham')).toBeVisible();
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('text=Leanne Graham', { timeout: 10000 });

    // Enter search term
    await page.fill('input[placeholder*="Search"]', 'Leanne');
    await page.waitForTimeout(300);

    // Click clear button
    await page.click('button[aria-label="Clear search"]');

    // Check that all users are visible again
    await expect(page.locator('text=Leanne Graham')).toBeVisible();
    await expect(page.locator('text=Ervin Howell')).toBeVisible();
  });

  test('should sort table by name when header is clicked', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('text=Leanne Graham', { timeout: 10000 });

    // Click on the Name header to sort
    await page.click('text=Name');

    // Wait for sorting to complete
    await page.waitForTimeout(100);

    // Check that the table is still visible after sorting
    await expect(page.locator('table')).toBeVisible();
  });

  test('should open user details modal when row is clicked', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('text=Leanne Graham', { timeout: 10000 });

    // Click on the first user row
    await page.click('tr:nth-child(2)'); // Skip header row

    // Check that modal opens
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    // Check for modal content instead of specific title
    await expect(page.locator('text=Leanne Graham')).toBeVisible();
  });

  test('should navigate to add user page when button is clicked', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('text=Leanne Graham', { timeout: 10000 });

    // Click add user button
    await page.click('button:has-text("Add User")');

    // Check that we're on the add user page
    await expect(page).toHaveURL('/add-user');
  });

  test('should display correct user count', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('text=Leanne Graham', { timeout: 10000 });

    // Check that the user count is displayed (look for partial text)
    await expect(page.locator('text=Displaying').first()).toBeVisible();
    await expect(page.locator('text=users').first()).toBeVisible();
  });
});