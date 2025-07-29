import React, { useEffect, useMemo, useCallback } from 'react';
import { CardProps } from '../config/themeConfig';
import useSettingsStore from '../stores/settingsStore';
import appleNotesTasksCSS from '../styles/apple-notes-tasks.css?raw';
import { createSafeHtml, sanitizeHtml } from '../utils/htmlSanitizer';

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
  
  // Handle task list styling
  useEffect(() => {
    handleTaskListStyling();
  }, [page, handleTaskListStyling]);
  
  // Memoize style variables
  const styleVars = useMemo((): React.CSSProperties & Record<string, any> => ({
    '--card-width': `${width}px`,
    '--card-height': `${height}px`,
    '--card-border-radius': 'var(--card-border-radius)',
    '--card-background': 'var(--card-background)',
    '--card-color': 'var(--card-color-text)',
    '--card-box-shadow': 'var(--card-shadow)',
    '--card-border': 'var(--card-border)',
    '--card-font-family': 'var(--card-font-family)',
    '--card-overflow': hideOverflow ? 'hidden' : 'visible',
    width: `${width}px`,
    height: `${height}px`,
    overflow: hideOverflow ? 'hidden' : 'visible',
  }), [width, height, hideOverflow]);

  // Memoize custom styles CSS generation
  const customStylesCSS = useMemo(() => {
    if (!config.customStyles) return '';
    
    let cssString = '';
    
    // Process elements styles
    if (config.customStyles.elements) {
      cssString += Object.entries(config.customStyles.elements)
        .map(([selector, styles]) => {
          if (typeof styles === 'object' && styles !== null) {
            const cssProperties = Object.entries(styles as Record<string, any>)
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
        const cssProperties = Object.entries(value as Record<string, any>)
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