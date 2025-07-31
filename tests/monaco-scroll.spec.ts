import { test, expect } from '@playwright/test';
import { 
  getMonacoEditor, 
  addContentToMonaco,
  generateLongContent,
  waitForMonacoReady,
  getScrollInfo,
  scrollMonacoTo,
  scrollMonacoBy,
  getVisibleScrollbar
} from './helpers/monaco-helpers';

test.describe('Monaco Editor Scroll Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application (uses baseURL from config)
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Wait for React to render and Monaco Editor to be ready
    await page.waitForSelector('[data-testid="app"], .App, #root > div', { timeout: 10000 });
    await waitForMonacoReady(page);
  });

  test('Monaco Editor loads and is visible', async ({ page }) => {
    const monacoEditor = await getMonacoEditor(page);
    
    // Assert that Monaco Editor is visible
    await expect(monacoEditor).toBeVisible();
    
    // Assert that it has the expected classes
    await expect(monacoEditor).toHaveClass(/monaco-editor/);
  });

  test('Monaco Editor has scrollable content when text is long', async ({ page }) => {
    // Add long content to trigger scrolling
    const longContent = generateLongContent(50, 'This is a long line of text that will create scrollable content in the Monaco Editor.');
    await addContentToMonaco(page, longContent);
    
    // Get scroll information
    const scrollInfo = await getScrollInfo(page);
    
    // Assert that scrollHeight is greater than clientHeight (indicating scrollable content)
    expect(scrollInfo.scrollHeight).toBeGreaterThan(scrollInfo.clientHeight);
    expect(scrollInfo.isScrollable).toBe(true);
  });

  test('Monaco Editor vertical scrollbar is present when content overflows', async ({ page }) => {
    // Add content that will definitely overflow
    const longContent = generateLongContent(100, 'Line');
    await addContentToMonaco(page, longContent);
    
    // Check for visible vertical scrollbar using the new helper
    const visibleScrollbar = await getVisibleScrollbar(page);
    await expect(visibleScrollbar).toBeVisible();
  });

  test('Monaco Editor scrolling works with mouse wheel', async ({ page }) => {
    // Add long content to make scrolling possible
    const longContent = generateLongContent(50, 'This is line');
    await addContentToMonaco(page, longContent);
    
    // Get initial scroll position
    const initialScrollInfo = await getScrollInfo(page);
    
    // Perform mouse wheel scroll down
    await scrollMonacoBy(page, 500);
    
    // Get new scroll position
    const newScrollInfo = await getScrollInfo(page);
    
    // Assert that scroll position changed
    expect(newScrollInfo.scrollTop).toBeGreaterThan(initialScrollInfo.scrollTop);
  });

  test('Monaco Editor scrolling works with programmatic scrollTop', async ({ page }) => {
    // Add long content
    const longContent = generateLongContent(50, 'Content line');
    await addContentToMonaco(page, longContent);
    
    // Get initial scroll position
    const initialScrollInfo = await getScrollInfo(page);
    
    // Programmatically set scroll position
    await scrollMonacoTo(page, 200);
    
    // Get new scroll position
    const newScrollInfo = await getScrollInfo(page);
    
    // Assert that scroll position changed to approximately 200
    expect(newScrollInfo.scrollTop).toBeGreaterThan(initialScrollInfo.scrollTop);
    expect(newScrollInfo.scrollTop).toBeGreaterThanOrEqual(150); // Allow some tolerance
  });

  test('Monaco Editor can scroll to top and bottom', async ({ page }) => {
    // Add substantial content
    const longContent = generateLongContent(100, 'Test line');
    await addContentToMonaco(page, longContent);
    
    const scrollInfo = await getScrollInfo(page);
    
    // Scroll to bottom
    await scrollMonacoTo(page, scrollInfo.scrollHeight);
    
    // Get scroll position at bottom
    const bottomScrollInfo = await getScrollInfo(page);
    
    // Assert we're at or near the bottom
    expect(bottomScrollInfo.scrollTop).toBeGreaterThanOrEqual(
      bottomScrollInfo.scrollHeight - bottomScrollInfo.clientHeight - 10
    ); // Allow 10px tolerance
    
    // Scroll to top
    await scrollMonacoTo(page, 0);
    
    // Get scroll position at top
    const topScrollInfo = await getScrollInfo(page);
    
    // Assert we're at the top
    expect(topScrollInfo.scrollTop).toBe(0);
  });

  test('Monaco Editor maintains scroll position during content changes', async ({ page }) => {
    // Add initial content
    const initialContent = generateLongContent(30, 'Initial line');
    await addContentToMonaco(page, initialContent);
    
    const scrollInfo = await getScrollInfo(page);
    
    // Scroll to middle
    await scrollMonacoTo(page, scrollInfo.scrollHeight / 2);
    
    // Get scroll position
    const middleScrollInfo = await getScrollInfo(page);
    
    // Add more content at the end using the direct API
    const monacoEditor = await getMonacoEditor(page);
    await monacoEditor.evaluate((el) => {
      const element = el as HTMLElement & {
        monacoSetValue?: (value: string) => void;
        monacoEditor?: { getValue: () => string };
      };
      
      if (element.monacoSetValue) {
        const currentValue = element.monacoEditor?.getValue() || '';
        const additionalContent = '\nAdditional content line\n';
        element.monacoSetValue(currentValue + additionalContent);
      }
    });
    
    await page.waitForTimeout(500);
    
    // Check that scroll position is maintained (approximately)
    const newScrollInfo = await getScrollInfo(page);
    
    // The scroll position should be close to what it was before
    // (allowing some tolerance for content changes)
    expect(Math.abs(newScrollInfo.scrollTop - middleScrollInfo.scrollTop)).toBeLessThan(50);
  });

  test('Monaco Editor scroll sensitivity is appropriate', async ({ page }) => {
    // Add content for scrolling
    const longContent = generateLongContent(80, 'Scroll test line');
    await addContentToMonaco(page, longContent);
    
    // Get initial scroll position
    const initialScrollInfo = await getScrollInfo(page);
    
    // Perform small scroll
    await scrollMonacoBy(page, 100);
    
    const smallScrollInfo = await getScrollInfo(page);
    const smallScrollDelta = smallScrollInfo.scrollTop - initialScrollInfo.scrollTop;
    
    // Perform larger scroll
    await scrollMonacoBy(page, 500);
    
    const largeScrollInfo = await getScrollInfo(page);
    const largeScrollDelta = largeScrollInfo.scrollTop - smallScrollInfo.scrollTop;
    
    // Assert that larger scroll input results in larger scroll movement
    expect(largeScrollDelta).toBeGreaterThan(smallScrollDelta);
    
    // Assert that scroll movements are reasonable (not too sensitive or insensitive)
    expect(smallScrollDelta).toBeGreaterThan(10); // Not too insensitive
    expect(smallScrollDelta).toBeLessThan(200); // Not too sensitive
  });
});