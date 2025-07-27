import React from 'react';
import { CardProps } from '../config/themeConfig';

const UniversalCard: React.FC<CardProps> = ({
  page,
  width,
  height,
  containerRef,
  contentRef,
  pageNumber,
  totalPages,
  showPageNumbers = false,
  hideOverflow = false,
}) => {
  // Use CSS variables for theme
  const styleVars: React.CSSProperties = {
    width: width && width > 0 ? `${width}px` : '100%',
    height: height && height > 0 ? `${height}px` : 'auto',
    minHeight: height && height > 0 ? `${height}px` : 'auto',
    borderRadius: 'var(--card-border-radius)',
    background: 'var(--card-color-background)',
    color: 'var(--card-color-text)',
    boxShadow: 'var(--card-shadow)',
    border: `1px solid var(--card-color-border)`,
    fontFamily: 'var(--card-font-family)',
    overflow: hideOverflow ? 'hidden' : 'visible',
  };

  return (
    <div
      ref={containerRef}
      style={styleVars}
      className="relative flex flex-col justify-between"
    >
      <div
        ref={contentRef}
        className="card-content p-8 rounded-xl shadow-sm"
        style={{
          background: 'var(--card-color-background)',
          borderRadius: 'var(--card-border-radius)',
          color: 'var(--card-color-text)',
          fontFamily: 'var(--card-font-family)',
          fontSize: 'var(--card-font-size)',
          lineHeight: 'var(--card-line-height)',
        }}
        dangerouslySetInnerHTML={{ __html: page }}
      />
      {showPageNumbers && pageNumber && totalPages && (
        <div
          className="absolute bottom-2 right-4 text-xs opacity-70 px-2 py-1 rounded border"
          style={{
            color: 'var(--card-color-text)',
            fontFamily: 'var(--card-font-family)',
            backgroundColor: 'var(--card-color-background)',
            borderColor: 'var(--card-color-accent)',
          }}
        >
          {pageNumber} / {totalPages}
        </div>
      )}
    </div>
  );
};

export default UniversalCard;