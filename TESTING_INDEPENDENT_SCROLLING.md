# Independent Scrolling Feature Tests

This document describes the comprehensive testing strategy for the independent scrolling feature implemented in the md2card application.

## Overview

The independent scrolling feature ensures that the Monaco editor (left panel) and the card preview (right panel) scroll completely independently without affecting each other. This is achieved through:

1. **Event Isolation**: Preventing wheel event propagation between panels
2. **CSS Containment**: Using CSS properties to isolate scroll behavior
3. **Manual Scroll Handling**: Custom scroll logic for Monaco editor
4. **Proper DOM Structure**: Split panel layout with isolated containers

## Test Structure

### 1. `IndependentScrolling.test.tsx`
**Main integration tests for the complete feature**

- **Split Panel Structure**: Verifies proper rendering of split container and panels
- **Monaco Editor Scroll Isolation**: Tests wheel event prevention and independent scrolling
- **Card Preview Scroll Isolation**: Tests scroll isolation in the preview panel
- **CSS Containment and Isolation**: Verifies CSS properties for scroll isolation
- **Scroll Event Propagation Prevention**: Tests that events don't bubble between panels
- **Independent Scroll Positions**: Verifies panels maintain separate scroll states
- **Scroll-to-Top Functionality**: Tests the scroll-to-top button and keyboard shortcuts
- **Error Boundaries and Fallbacks**: Tests graceful handling of Monaco editor failures

### 2. `ScrollEventIntegration.test.tsx`
**Component-level tests for scroll event handling**

- **MarkdownEditor Scroll Handling**: Tests wheel event isolation in the editor
- **CardPreview Scroll Handling**: Tests scroll isolation in the preview
- **CSS Scroll Isolation**: Verifies proper styling application
- **Event Propagation Prevention**: Tests event stopping in nested components
- **Monaco Editor Mock Behavior**: Tests the mocked Monaco editor functionality
- **Scroll Sensitivity and Smoothness**: Tests different scroll speeds and smooth behavior

### 3. `CSSScrollIsolation.test.tsx`
**CSS-specific tests for styling and layout**

- **Split Container Styles**: Tests CSS classes and layout properties
- **Overflow and Scroll Styles**: Verifies overflow and scroll-behavior styles
- **CSS Containment Properties**: Tests containment and isolation CSS properties
- **Overscroll Behavior**: Tests scroll chaining prevention
- **Monaco Editor Container Styles**: Tests editor-specific styling
- **Card Preview Container Styles**: Tests preview-specific styling
- **Responsive Scroll Behavior**: Tests behavior across different viewport sizes
- **CSS Variables and Theming**: Ensures theming compatibility
- **Performance Considerations**: Tests for efficient DOM structure

## Test Setup

### Dependencies
- **Vitest**: Modern testing framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Additional DOM matchers
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for testing

### Mocks
- **Monaco Editor**: Mocked with textarea fallback for testing
- **react-split**: Mocked split container component
- **html-to-image**: Mocked image export functionality

## Running Tests

### All Tests
```bash
npm test
```

### Test with UI
```bash
npm run test:ui
```

### Run Tests Once
```bash
npm run test:run
```

### Coverage Report
```bash
npm run test:coverage
```

### Scroll-Specific Tests Only
```bash
npm run test:scroll
```

## Test Coverage Areas

### ✅ Functional Testing
- [x] Split panel rendering
- [x] Wheel event isolation
- [x] Scroll position independence
- [x] Event propagation prevention
- [x] Scroll-to-top functionality
- [x] Keyboard shortcuts

### ✅ CSS Testing
- [x] Overflow properties
- [x] CSS containment
- [x] Isolation properties
- [x] Scroll behavior
- [x] Responsive design

### ✅ Integration Testing
- [x] Component interaction
- [x] Event handling
- [x] State management
- [x] Error boundaries

### ✅ Performance Testing
- [x] DOM efficiency
- [x] Event handling performance
- [x] CSS selector efficiency

## Key Test Scenarios

### 1. **Independent Scrolling Verification**
```typescript
// Test that scrolling in one panel doesn't affect the other
fireEvent.wheel(editorElement, { deltaY: 100 })
expect(previewElement.scrollTop).toBe(initialPreviewScroll)
```

### 2. **Event Propagation Prevention**
```typescript
// Test that wheel events are stopped at component boundaries
const stopPropagationSpy = vi.spyOn(wheelEvent, 'stopPropagation')
fireEvent(editorElement, wheelEvent)
expect(stopPropagationSpy).toHaveBeenCalled()
```

### 3. **CSS Containment Verification**
```typescript
// Test that proper CSS containment is applied
const computedStyle = window.getComputedStyle(element)
expect(computedStyle.contain).toBe('layout style paint')
```

## Expected Behavior

### ✅ **What Should Work**
- Scrolling in Monaco editor only affects the editor
- Scrolling in card preview only affects the preview
- Scroll positions are maintained independently
- Scroll-to-top button works for the editor
- Keyboard shortcuts work properly
- CSS containment prevents scroll conflicts

### ❌ **What Should NOT Happen**
- Scrolling in one panel affecting the other
- Wheel events bubbling to parent elements
- Scroll positions being synchronized
- CSS conflicts between panels
- Performance degradation from scroll handling

## Debugging Tests

### Common Issues
1. **Mock Setup**: Ensure Monaco editor mock is properly configured
2. **Event Handling**: Verify wheel events are properly simulated
3. **CSS Testing**: Check that styles are applied in test environment
4. **Async Behavior**: Use proper async/await for user interactions

### Debug Commands
```bash
# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- IndependentScrolling.test.tsx

# Run with verbose output
npm test -- --verbose
```

## Continuous Integration

These tests should be run in CI/CD pipelines to ensure:
- Feature regression prevention
- Cross-browser compatibility
- Performance consistency
- Code quality maintenance

## Future Enhancements

### Potential Additional Tests
- [ ] Touch/mobile scroll testing
- [ ] Accessibility testing for scroll behavior
- [ ] Performance benchmarking
- [ ] Cross-browser compatibility tests
- [ ] Memory leak detection
- [ ] Stress testing with large content

### Test Automation
- [ ] Visual regression testing
- [ ] Automated screenshot comparison
- [ ] Performance monitoring
- [ ] Real browser testing with Playwright

## Conclusion

This comprehensive testing suite ensures that the independent scrolling feature works reliably across different scenarios and maintains its functionality over time. The tests cover functional behavior, CSS styling, event handling, and performance considerations to provide confidence in the feature's stability and correctness.