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
    borderRadius: 'var(--card-radius)',
    background: 'var(--card-bg)',
    color: 'var(--card-text)',
    boxShadow: 'var(--card-shadow)',
    border: 'var(--card-border)',
    fontFamily: 'var(--font-family)',
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
        className="card-content p-8 bg-white dark:bg-[var(--card-bg)] rounded-xl shadow-sm"
        style={{
          background: 'var(--card-bg)',
          borderRadius: 'var(--card-radius)',
          color: 'var(--card-text)',
          fontFamily: 'var(--font-family)',
        }}
        dangerouslySetInnerHTML={{ __html: page }}
      />
      {showPageNumbers && pageNumber && totalPages && (
        <div
          className="absolute bottom-2 right-4 text-xs opacity-70 px-2 py-1 rounded bg-[var(--card-bg)] border border-[var(--card-accent)]"
          style={{
            color: 'var(--card-text)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {pageNumber} / {totalPages}
        </div>
      )}
    </div>
  );
};

export default UniversalCard;