import { Page, Locator, expect } from '@playwright/test';

/**
 * Monaco Editor Test Helpers
 * 
 * This module provides reusable helper functions for testing Monaco Editor
 * functionality in Playwright tests.
 */

/**
 * Helper function to get the Monaco Editor container
 * @param page - Playwright page instance
 * @returns Monaco Editor container element
 */
export async function getMonacoEditor(page: Page): Promise<Locator> {
  // Wait for Monaco Editor to be loaded and mounted
  await page.waitForSelector('.monaco-editor', { timeout: 10000 });
  
  // Get the Monaco Editor container
  const monacoEditor = page.locator('.monaco-editor').first();
  await expect(monacoEditor).toBeVisible();
  
  return monacoEditor;
}

/**
 * Helper function to get the Monaco Editor scrollable viewport
 * @param page - Playwright page instance
 * @returns Monaco Editor scrollable viewport element
 */
export async function getMonacoScrollableElement(page: Page): Promise<Locator> {
  // The scrollable element is typically the .monaco-scrollable-element
  const scrollableElement = page.locator('.monaco-editor .monaco-scrollable-element').first();
  await expect(scrollableElement).toBeVisible();
  
  return scrollableElement;
}

/**
 * Helper function to add content to Monaco Editor using the exposed API
 * @param page - Playwright page instance
 * @param content - Content to add to the editor
 * @param clearFirst - Whether to clear existing content first
 */
export async function addContentToMonaco(page: Page, content: string, clearFirst: boolean = false): Promise<void> {
  const monacoEditor = await getMonacoEditor(page);
  
  // Use the exposed monacoSetValue method if available
  const hasSetValueMethod = await monacoEditor.evaluate((el) => {
    return !!(el as any).monacoSetValue;
  });
  
  if (hasSetValueMethod) {
    // Use the direct API method for better performance
    await monacoEditor.evaluate((el, contentToSet) => {
      (el as any).monacoSetValue(contentToSet);
    }, content);
    
    // Wait for content to be processed and layout to update
    await page.waitForTimeout(500);
    return;
  }
  
  // Fallback to keyboard input method
  // Focus on the editor
  await monacoEditor.click();
  
  if (clearFirst) {
    // Select all and delete
    await page.keyboard.press('Meta+a'); // Cmd+A on Mac, Ctrl+A on Windows/Linux
    await page.keyboard.press('Delete');
  }
  
  // Type the content in smaller chunks to avoid timeout
  const chunkSize = 100;
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.slice(i, i + chunkSize));
  }
  
  for (const chunk of chunks) {
    await page.keyboard.type(chunk);
    // Small delay between chunks to prevent overwhelming the editor
    await page.waitForTimeout(50);
  }
  
  // Wait for content to be processed
  await page.waitForTimeout(500);
}

/**
 * Helper function to generate long content for testing scrolling
 * @param lineCount - Number of lines to generate
 * @param prefix - Prefix for each line
 * @returns Generated content string
 */
export function generateLongContent(lineCount: number = 50, prefix: string = 'Test line'): string {
  return Array(lineCount)
    .fill(prefix)
    .map((line, index) => `${line} ${index + 1}`)
    .join('\n');
}

/**
 * Helper function to wait for Monaco Editor to be ready
 * @param page - Playwright page instance
 */
export async function waitForMonacoReady(page: Page): Promise<void> {
  // Wait for Monaco Editor to be loaded
  await page.waitForSelector('.monaco-editor', { timeout: 10000 });
  
  // Wait for the editor to be interactive
  await page.waitForFunction(() => {
    const editor = document.querySelector('.monaco-editor');
    return editor && !editor.classList.contains('loading');
  }, { timeout: 5000 });
  
  // Additional wait for any async initialization
  await page.waitForTimeout(1000);
}

/**
 * Helper function to get scroll information from Monaco Editor
 * @param page - Playwright page instance
 * @returns Object containing scroll information
 */
export async function getScrollInfo(page: Page): Promise<{
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  isScrollable: boolean;
}> {
  const monacoEditor = await getMonacoEditor(page);
  
  const scrollInfo = await monacoEditor.evaluate((el) => {
    // Use Monaco's API methods if available
    if ((el as any).monacoGetScrollTop && (el as any).monacoGetScrollHeight && (el as any).monacoGetClientHeight) {
      const scrollTop = (el as any).monacoGetScrollTop();
      const scrollHeight = (el as any).monacoGetScrollHeight();
      const clientHeight = (el as any).monacoGetClientHeight();
      
      return {
        scrollTop,
        scrollHeight,
        clientHeight,
        isScrollable: scrollHeight > clientHeight
      };
    }
    
    // Fallback to DOM-based approach
    const scrollableElement = el.querySelector('.monaco-scrollable-element') as HTMLElement;
    if (scrollableElement) {
      return {
        scrollTop: scrollableElement.scrollTop,
        scrollHeight: scrollableElement.scrollHeight,
        clientHeight: scrollableElement.clientHeight,
        isScrollable: scrollableElement.scrollHeight > scrollableElement.clientHeight
      };
    }
    
    return {
      scrollTop: 0,
      scrollHeight: 0,
      clientHeight: 0,
      isScrollable: false
    };
  });
  
  return scrollInfo;
}

/**
 * Helper function to scroll Monaco Editor to a specific position
 * @param page - Playwright page instance
 * @param scrollTop - Scroll position to set
 */
export async function scrollMonacoTo(page: Page, scrollTop: number): Promise<void> {
  const monacoEditor = await getMonacoEditor(page);
  
  await monacoEditor.evaluate((el, position) => {
    // Use Monaco's API method if available
    if ((el as any).monacoScrollTo) {
      (el as any).monacoScrollTo(position);
      return;
    }
    
    // Fallback to DOM-based approach
    const scrollableElement = el.querySelector('.monaco-scrollable-element') as HTMLElement;
    if (scrollableElement) {
      scrollableElement.scrollTop = position;
    }
  }, scrollTop);
  
  // Wait for scroll to complete and layout to update
  await page.waitForTimeout(300);
}

/**
 * Helper function to scroll Monaco Editor by a delta amount
 * @param page - Playwright page instance
 * @param deltaY - Amount to scroll (positive = down, negative = up)
 */
export async function scrollMonacoBy(page: Page, deltaY: number): Promise<void> {
  const monacoEditor = await getMonacoEditor(page);
  
  // Hover over the editor first
  await monacoEditor.hover();
  
  // Perform mouse wheel scroll
  await page.mouse.wheel(0, deltaY);
  
  // Wait for scroll to complete
  await page.waitForTimeout(500);
}

/**
 * Helper function to get the visible scrollbar element
 * @param page - Playwright page instance
 * @returns Visible scrollbar element
 */
export async function getVisibleScrollbar(page: Page): Promise<Locator> {
  // Look for the visible scrollbar specifically
  const visibleScrollbar = page.locator('.monaco-editor .monaco-scrollable-element .scrollbar.vertical.visible').first();
  await expect(visibleScrollbar).toBeVisible();
  
  return visibleScrollbar;
}