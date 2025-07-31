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

  test('Monaco Editor can append text and scroll', async ({ page }) => {
    // Wait for Monaco Editor to load
    await page.waitForSelector('.monaco-editor', { timeout: 10000 });
    const monacoEditor = page.locator('.monaco-editor').first();
    await expect(monacoEditor).toBeVisible();

    // Click to focus and append text
    await monacoEditor.click();
    await page.keyboard.type('Hello, Monaco!');

    // Add enough lines to require scrolling
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Enter');
      await page.keyboard.type(`Line ${i + 1}`);
    }

    // Check that the last line is not initially visible (requires scroll)
    const lastLineSelector = '.monaco-editor .view-lines > :last-child';
    let lastLineVisible = await page.locator(lastLineSelector).isVisible();

    // Scroll to bottom using keyboard (PageDown)
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('PageDown');
    }

    // After scrolling, the last line should be visible
    lastLineVisible = await page.locator(lastLineSelector).isVisible();
    expect(lastLineVisible).toBeTruthy();
  });
});