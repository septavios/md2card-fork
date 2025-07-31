import React, { useEffect, useMemo, useCallback } from 'react';
import { CardProps } from '../config/themeConfig';
import useSettingsStore from '../stores/settingsStore';
import appleNotesTasksCSS from '../styles/apple-notes-tasks.css?raw';
import { createSafeHtml } from '../utils/htmlSanitizer';

// Utility function moved outside component to prevent recreation
const camelToKebab = (str: string) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

const UniversalCard: React.FC<CardProps> = React.memo(({
  page,
  width,
  height,
  containerRef,
  contentRef,
  pageNumber,
  totalPages,
  showPageNumbers = false,
  hideOverflow = false,
  config,
}) => {
  const { selectedTheme } = useSettingsStore();
  
  // Memoize theme checks
  const themeChecks = useMemo(() => ({
    isXiaohongshuTheme: selectedTheme === 'Xiaohongshu' || selectedTheme === 'XiaohongshuDark',
    isAppleNotesTheme: selectedTheme === 'AppleNotesDark',
  }), [selectedTheme]);
  
  const needsHeaderStructure = themeChecks.isXiaohongshuTheme || themeChecks.isAppleNotesTheme;
  
  // Memoize task list handler
  const handleTaskListStyling = useCallback(() => {
    if (!themeChecks.isAppleNotesTheme || !contentRef?.current) return;
    
    const container = contentRef.current;
    const listItems = container.querySelectorAll('li');
    
    listItems.forEach((li) => {
      const checkbox = li.querySelector('input[type="checkbox"]');
      if (checkbox) {
        // Remove previous classes
        li.classList.remove('task-item-checked', 'task-item-unchecked');
        
        // Add appropriate class based on checkbox state
        if ((checkbox as HTMLInputElement).checked) {
          li.classList.add('task-item-checked');
        } else {
          li.classList.add('task-item-unchecked');
        }
      }
    });
  }, [themeChecks.isAppleNotesTheme, contentRef]);
  
  // Handle Apple Notes bold text styling with direct inline styles
  const handleAppleNotesBoldStyling = useCallback(() => {
    if (!themeChecks.isAppleNotesTheme || !contentRef?.current) return;
    
    const applyBoldStyles = () => {
      if (!contentRef?.current) return;
      
      const container = contentRef.current;
      
      // Get all bold elements using multiple approaches
      const strongElements = container.getElementsByTagName('strong');
      const mdStrongElements = container.getElementsByClassName('md-strong');
      const bElements = container.getElementsByTagName('b');
      
      // Also use querySelectorAll for comprehensive selection
      const querySelectorElements = container.querySelectorAll('strong, .md-strong, b, li strong, li .md-strong, li b, ul strong, ul .md-strong, ul b, ol strong, ol .md-strong, ol b');
      
      // Create a Set to avoid duplicates
      const uniqueElements = new Set([
        ...Array.from(strongElements),
        ...Array.from(mdStrongElements),
        ...Array.from(bElements),
        ...Array.from(querySelectorElements)
      ]);
      
      // Force apply styles to all bold elements regardless of previous state
      uniqueElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Apply inline styles with maximum priority
        htmlElement.style.setProperty('color', '#ff9f0a', 'important');
        htmlElement.style.setProperty('font-weight', '700', 'important');
        htmlElement.style.setProperty('background', 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%)', 'important');
        htmlElement.style.setProperty('padding', '2px 6px', 'important');
        htmlElement.style.setProperty('border-radius', '4px', 'important');
        htmlElement.style.setProperty('font-size', '16px', 'important');
        htmlElement.style.setProperty('display', 'inline', 'important');
        
        // Add a visual indicator for debugging
        htmlElement.style.setProperty('border', '1px solid #ff9f0a', 'important');
      });
    };
    
    // Apply styles multiple times with increasing delays
    applyBoldStyles();
    setTimeout(applyBoldStyles, 50);
    setTimeout(applyBoldStyles, 100);
    setTimeout(applyBoldStyles, 200);
    setTimeout(applyBoldStyles, 500);
    requestAnimationFrame(applyBoldStyles);
  }, [themeChecks.isAppleNotesTheme, contentRef]);

  useEffect(() => {
    handleTaskListStyling();
    handleAppleNotesBoldStyling();
    
    if (themeChecks.isAppleNotesTheme && contentRef?.current) {
      const observer = new MutationObserver((mutations) => {
        let needsUpdate = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || 
              (mutation.type === 'attributes' && 
               (mutation.attributeName === 'class' || mutation.attributeName === 'style'))) {
            needsUpdate = true;
          }
        });
        
        if (needsUpdate) {
          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            handleTaskListStyling();
            handleAppleNotesBoldStyling();
          });
        }
      });
      
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
      
      return () => observer.disconnect();
    }
  }, [page, handleTaskListStyling, handleAppleNotesBoldStyling, themeChecks.isAppleNotesTheme]);
  
  // Memoize style variables
  const styleVars = useMemo((): React.CSSProperties & Record<string, string> => {
    const vars: React.CSSProperties & Record<string, string> = {
      '--card-width': `${width}px`,
      '--card-border-radius': 'var(--card-border-radius)',
      '--card-background': 'var(--card-background)',
      '--card-color': 'var(--card-color-text)',
      '--card-box-shadow': 'var(--card-shadow)',
      '--card-border': 'var(--card-border)',
      '--card-font-family': 'var(--card-font-family)',
      '--card-overflow': hideOverflow ? 'hidden' : 'visible',
      width: `${width}px`,
    };
    if (height > 0) {
      vars.height = `${height}px`;
      vars.overflow = hideOverflow ? 'hidden' : 'visible';
    } else {
      // 长卡片模式不设置 height，让内容自适应
      vars.overflow = 'visible';
    }
    return vars;
  }, [width, height, hideOverflow]);

  // Memoize custom styles CSS generation
  const customStylesCSS = useMemo(() => {
    if (!config.customStyles) {
      return '';
    }
    
    let cssString = '';
    
    // Process elements styles
    if (config.customStyles.elements) {
      cssString += Object.entries(config.customStyles.elements)
        .map(([selector, styles]) => {
          if (typeof styles === 'object' && styles !== null) {
            const cssProperties = Object.entries(styles as Record<string, string>)
              .map(([property, value]) => `${camelToKebab(property)}: ${value}`)
              .join('; ');
            return `${selector} { ${cssProperties} }`;
          }
          return '';
        })
        .filter(Boolean)
        .join(' ');
    }
    
    // Process other top-level styles
    Object.entries(config.customStyles).forEach(([key, value]) => {
      if (key !== 'elements' && key !== 'container' && typeof value === 'object' && value !== null) {
        const cssProperties = Object.entries(value as Record<string, string>)
          .map(([property, val]) => `${camelToKebab(property)}: ${val}`)
          .join('; ');
        cssString += `${key} { ${cssProperties} } `;
      }
    });
    
    return cssString;
  }, [config.customStyles]);

  // Memoize page number component
  const pageNumberComponent = useMemo(() => {
    if (!showPageNumbers || !pageNumber || !totalPages) return null;
    
    return (
      <div
        className="page-number absolute bottom-2 right-4 text-xs opacity-70 px-2 py-1 rounded border"
        style={{
          color: 'var(--card-color-text)',
          fontFamily: 'var(--card-font-family)',
          backgroundColor: 'var(--card-background)',
          borderColor: 'var(--card-color-accent)',
          zIndex: needsHeaderStructure ? 10 : undefined,
        }}
      >
        {pageNumber} / {totalPages}
      </div>
    );
  }, [showPageNumbers, pageNumber, totalPages, needsHeaderStructure]);

  // Memoize content styles
  const contentStyles = useMemo(() => ({
    background: 'var(--card-background)',
    borderRadius: 'var(--card-border-radius)',
    color: 'var(--card-color-text)',
    fontFamily: 'var(--card-font-family)',
    fontSize: 'var(--card-font-size)',
    lineHeight: 'var(--card-line-height)',
    padding: needsHeaderStructure ? '0' : undefined, // Let theme styles control padding for special themes
  }), [needsHeaderStructure]);

  return (
    <div
      ref={containerRef}
      style={styleVars}
      className="relative flex flex-col justify-between"
    >
      {/* Inject custom styles */}
      {customStylesCSS && (
        <style dangerouslySetInnerHTML={createSafeHtml(customStylesCSS)} />
      )}
      
      {/* Inject Apple Notes task list styles */}
      {themeChecks.isAppleNotesTheme && (
        <style dangerouslySetInnerHTML={createSafeHtml(appleNotesTasksCSS)} />
      )}
      
      {/* Inject Apple Notes bold text override styles with maximum priority */}
      {themeChecks.isAppleNotesTheme && (
        <style dangerouslySetInnerHTML={createSafeHtml(`
          /* Reset any conflicting styles first */
          .card-apple-notes li strong,
          .card-apple-notes li .md-strong,
          .card-apple-notes li b {
            all: unset;
            font-weight: 700 !important;
            display: inline !important;
          }
          
          /* Ultra-high priority Apple Notes bold text styles */
          div.card.card-apple-notes .card-content .card-content-inner .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner strong,
          div.card.card-apple-notes .card-content .card-content-inner b,
          div.card.card-apple-notes .card-content .card-content-inner ul .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner ul strong,
          div.card.card-apple-notes .card-content .card-content-inner ul b,
          div.card.card-apple-notes .card-content .card-content-inner ol .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner ol strong,
          div.card.card-apple-notes .card-content .card-content-inner ol b,
          div.card.card-apple-notes .card-content .card-content-inner li .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner li strong,
          div.card.card-apple-notes .card-content .card-content-inner li b,
          div.card.card-apple-notes .card-content .card-content-inner ul li .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner ul li strong,
          div.card.card-apple-notes .card-content .card-content-inner ul li b,
          div.card.card-apple-notes .card-content .card-content-inner ol li .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner ol li strong,
          div.card.card-apple-notes .card-content .card-content-inner ol li b,
          div.card.card-apple-notes .card-content .card-content-inner li.md-listitem .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner li.md-listitem strong,
          div.card.card-apple-notes .card-content .card-content-inner li.md-listitem b,
          div.card.card-apple-notes .card-content .card-content-inner .md-listitem .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner .md-listitem strong,
          div.card.card-apple-notes .card-content .card-content-inner .md-listitem b,
          div.card.card-apple-notes .card-content .card-content-inner *[class*="md-"] .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner *[class*="md-"] strong,
          div.card.card-apple-notes .card-content .card-content-inner *[class*="md-"] b,
          div.card.card-apple-notes .card-content .card-content-inner p .md-strong,
          div.card.card-apple-notes .card-content .card-content-inner p strong,
          div.card.card-apple-notes .card-content .card-content-inner p b {
            color: #ff9f0a !important;
            font-weight: 700 !important;
            background: linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 16px !important;
            display: inline !important;
          }
          
          /* Specific rule for list items to ensure they get styled */
          .card-apple-notes li strong,
          .card-apple-notes li .md-strong,
          .card-apple-notes li b,
          .card-apple-notes ul li strong,
          .card-apple-notes ul li .md-strong,
          .card-apple-notes ul li b,
          .card-apple-notes ol li strong,
          .card-apple-notes ol li .md-strong,
          .card-apple-notes ol li b {
            color: #ff9f0a !important;
            font-weight: 700 !important;
            background: linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 16px !important;
            display: inline !important;
          }
          
          /* Additional fallback selectors for any missed cases */
          .card-apple-notes strong[data-apple-notes-styled="true"],
          .card-apple-notes .md-strong[data-apple-notes-styled="true"],
          .card-apple-notes b[data-apple-notes-styled="true"] {
            color: #ff9f0a !important;
            font-weight: 700 !important;
            background: linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 16px !important;
            display: inline !important;
          }
        `)} />
      )}
      
      {needsHeaderStructure ? (
        // Themes that need header structure (Xiaohongshu and Apple Notes)
        <div className={`card ${themeChecks.isAppleNotesTheme ? 'card-apple-notes' : ''}`}>
          <div className="card-header">
            {themeChecks.isAppleNotesTheme && (
              <>
                <span className="header-back-button">备忘录</span>
                <div className="header-action-buttons">
                  <span className="header-action-button share"></span>
                  <span className="header-action-button more"></span>
                </div>
              </>
            )}
          </div>
          <div className="card-content">
            <div
              ref={contentRef}
              className="card-content-inner"
              style={contentStyles}
              dangerouslySetInnerHTML={createSafeHtml(page)}
            />
          </div>
          <div className="card-footer"></div>
          {pageNumberComponent}
        </div>
      ) : (
        // Default card structure
        <>
          <div
            ref={contentRef}
            className="card-content p-8 rounded-xl shadow-sm"
            style={contentStyles}
            dangerouslySetInnerHTML={createSafeHtml(page)}
          />
          {pageNumberComponent}
        </>
      )}
    </div>
  );
});

UniversalCard.displayName = 'UniversalCard';

export default UniversalCard;