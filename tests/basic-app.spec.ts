import { test, expect } from '@playwright/test';

test.describe('Basic Application Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('Application loads successfully', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
    
    // Check that the main application container is visible
    const appContainer = page.locator('#root');
    await expect(appContainer).toBeVisible();
  });

  test('Application layout is correct', async ({ page }) => {
    // Check for main layout components
    const leftPanel = page.locator('.monaco-editor').first();
    const rightPanel = page.locator('[class*="preview"], [class*="card"]').first();
    
    await expect(leftPanel).toBeVisible();
    await expect(rightPanel).toBeVisible();
  });
});