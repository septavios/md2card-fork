# Playwright Tests

This directory contains end-to-end tests for the md2card application using Playwright.

## Test Structure

- `basic-app.spec.ts` - Basic application functionality tests
- `monaco-scroll.spec.ts` - Comprehensive Monaco Editor scroll functionality tests
- `helpers/monaco-helpers.ts` - Reusable helper functions for Monaco Editor testing

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

### Running Tests

#### Quick Commands

```bash
# Run all tests (auto-exits after completion)
npm run test

# Run specific test file
npm run test -- monaco-scroll.spec.ts

# Run with specific browser
npm run test -- --project=chromium

# Run in headed mode (see browser, auto-exits)
npm run test:e2e:headed

# Run with UI mode (interactive, doesn't auto-exit)
npm run test:ui
```

#### Alternative Commands

- **Run all tests**: `npm test` or `npm run test:e2e`
- **Run tests with UI**: `npm run test:ui` or `npm run test:e2e:ui`
- **Run tests in headed mode**: `npm run test:e2e:headed`
- **Run specific test file**: `npx playwright test monaco-scroll.spec.ts`

### Test Configuration

The tests are configured in `playwright.config.ts` with the following features:

- **Automatic server startup**: Tests automatically start the Vite preview server
- **Multiple browsers**: Tests run on Chromium, Firefox, and WebKit
- **Screenshots on failure**: Automatic screenshots when tests fail
- **Video recording**: Videos recorded for failed tests
- **Trace collection**: Detailed traces for debugging

## Monaco Editor Tests

The Monaco Editor tests (`monaco-scroll.spec.ts`) verify:

1. **Editor Loading**: Monaco Editor loads and is visible
2. **Scrollable Content**: Editor becomes scrollable with long content
3. **Scrollbar Visibility**: Vertical scrollbar appears when needed
4. **Mouse Wheel Scrolling**: Scroll wheel functionality works correctly
5. **Programmatic Scrolling**: Setting scrollTop programmatically works
6. **Top/Bottom Scrolling**: Can scroll to top and bottom positions
7. **Scroll Persistence**: Scroll position maintained during content changes
8. **Scroll Sensitivity**: Appropriate scroll sensitivity and responsiveness

## Helper Functions

The `helpers/monaco-helpers.ts` module provides reusable functions:

- `getMonacoEditor(page)` - Get Monaco Editor container
- `getMonacoScrollableElement(page)` - Get scrollable viewport
- `addContentToMonaco(page, content)` - Add content to editor
- `generateLongContent(lineCount, prefix)` - Generate test content
- `waitForMonacoReady(page)` - Wait for editor to be ready
- `getScrollInfo(page)` - Get scroll position information
- `scrollMonacoTo(page, position)` - Scroll to specific position
- `scrollMonacoBy(page, delta)` - Scroll by delta amount

## Best Practices

1. **Use helper functions** for common operations
2. **Wait for elements** to be ready before interacting
3. **Use stable selectors** that won't change frequently
4. **Add appropriate timeouts** for async operations
5. **Clean up state** between tests using `beforeEach`
6. **Use descriptive test names** that explain what is being tested

## Debugging

- Use `--headed` flag to see tests running in browser
- Use `--debug` flag to pause execution and inspect
- Check screenshots and videos in `test-results/` directory
- Use trace viewer for detailed debugging: `npx playwright show-trace trace.zip`

## CI/CD Integration

The tests are configured to work in CI environments:

- Retries failed tests automatically
- Runs in parallel for faster execution
- Generates HTML reports
- Captures artifacts for debugging