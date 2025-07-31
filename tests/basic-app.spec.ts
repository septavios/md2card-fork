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

  test('Monaco Editor is present in the application', async ({ page }) => {
    // Wait for Monaco Editor to load
    await page.waitForSelector('.monaco-editor', { timeout: 10000 });
    
    // Check that Monaco Editor is visible
    const monacoEditor = page.locator('.monaco-editor').first();
    await expect(monacoEditor).toBeVisible();
    
    // Check that we can interact with the editor
    await monacoEditor.click();
    await page.keyboard.type('Hello, Monaco!');
    
    // Verify the content was typed
    const editorContent = await page.locator('.monaco-editor .view-lines').textContent();
    expect(editorContent).toContain('Hello, Monaco!');
  });

  test('Application layout is correct', async ({ page }) => {
    // Check for main layout components
    const leftPanel = page.locator('.monaco-editor').first();
    const rightPanel = page.locator('[class*="preview"], [class*="card"]').first();
    
    await expect(leftPanel).toBeVisible();
    await expect(rightPanel).toBeVisible();
  });
});