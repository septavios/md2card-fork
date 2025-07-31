import { test, expect } from '@playwright/test';

test.describe('Monaco Editor Debug Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Debug Monaco Editor structure and scrolling', async ({ page }) => {
    // Wait for Monaco Editor to be ready
    const monacoEditor = page.locator('.monaco-editor');
    await expect(monacoEditor).toBeVisible();
    
    // Add a lot of content to make it scrollable
    const longContent = Array(50).fill('This is a very long line of text that should make the editor scrollable.\n').join('');
    await page.evaluate((content) => {
      const editor = (window as any).monacoEditorInstance;
      if (editor) {
        editor.setValue(content);
      }
    }, longContent);
    
    // Wait a bit for the content to be processed
    await page.waitForTimeout(1000);
    
    // Debug: Print the DOM structure
    const editorHTML = await monacoEditor.innerHTML();
    console.log('Monaco Editor HTML structure:', editorHTML.substring(0, 500));
    
    // Check scrollable element
    const scrollableElement = page.locator('.monaco-editor .monaco-scrollable-element');
    await expect(scrollableElement).toBeVisible();
    
    // Get scroll information
    const scrollInfo = await scrollableElement.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      scrollTop: el.scrollTop,
      hasVerticalScroll: el.scrollHeight > el.clientHeight
    }));
    
    console.log('Scroll info:', scrollInfo);
    
    // Check if content is scrollable
    expect(scrollInfo.hasVerticalScroll).toBe(true);
    
    // Try scrolling
    await scrollableElement.evaluate((el) => {
      el.scrollTop = 100;
    });
    
    // Check if scroll position changed
    const newScrollTop = await scrollableElement.evaluate((el) => el.scrollTop);
    console.log('New scroll top:', newScrollTop);
    expect(newScrollTop).toBeGreaterThan(0);
  });
});