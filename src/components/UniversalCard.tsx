import React from 'react';
import { CardProps } from '../config/themeConfig';
import useSettingsStore from '../stores/settingsStore';

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
  const { selectedTheme } = useSettingsStore();
  
  // Use CSS variables for theme
  const styleVars: React.CSSProperties & Record<string, any> = {
    '--card-width': `${width}px`,
    '--card-height': `${height}px`,
    '--card-border-radius': 'var(--card-border-radius)',
    '--card-background': 'var(--card-color-background)',
    '--card-color': 'var(--card-color-text)',
    '--card-box-shadow': 'var(--card-shadow)',
    '--card-border': 'var(--card-border)',
    '--card-font-family': 'var(--card-font-family)',
    '--card-overflow': hideOverflow ? 'hidden' : 'visible',
    width: `${width}px`,
    height: `${height}px`,
    overflow: hideOverflow ? 'hidden' : 'visible',
  };

  // 检查是否为小红书主题或Apple Notes主题
  const isXiaohongshuTheme = selectedTheme === 'Xiaohongshu' || selectedTheme === 'XiaohongshuDark';
  const isAppleNotesTheme = selectedTheme === 'AppleNotesDark';
  const needsHeaderStructure = isXiaohongshuTheme || isAppleNotesTheme;

  return (
    <div
      ref={containerRef}
      style={styleVars}
      className="relative flex flex-col justify-between"
    >
      {needsHeaderStructure ? (
        // 需要header结构的主题（小红书和Apple Notes）
        <div className="card">
          <div className="card-header">
            {isAppleNotesTheme && (
              <>
                <span className="header-back-button">{"< 备忘录"}</span>
                <div className="header-action-buttons">
                  <span>{"⤴"}</span>
                  <span>{"😊"}</span>
                </div>
              </>
            )}
          </div>
          <div className="card-content">
            <div
              ref={contentRef}
              className="card-content-inner"
              style={{
                background: 'var(--card-color-background)',
                borderRadius: 'var(--card-border-radius)',
                color: 'var(--card-color-text)',
                fontFamily: 'var(--card-font-family)',
                fontSize: 'var(--card-font-size)',
                lineHeight: 'var(--card-line-height)',
                padding: '0', // 让主题样式控制padding
              }}
              dangerouslySetInnerHTML={{ __html: page }}
            />
          </div>
          <div className="card-footer"></div>
          {showPageNumbers && pageNumber && totalPages && (
            <div
              className="page-number absolute bottom-2 right-4 text-xs opacity-70 px-2 py-1 rounded border"
              style={{
                color: 'var(--card-color-text)',
                fontFamily: 'var(--card-font-family)',
                backgroundColor: 'var(--card-color-background)',
                borderColor: 'var(--card-color-accent)',
                zIndex: 10,
              }}
            >
              {pageNumber} / {totalPages}
            </div>
          )}
        </div>
      ) : (
        // 默认卡片结构
        <>
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
              className="page-number absolute bottom-2 right-4 text-xs opacity-70 px-2 py-1 rounded border"
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
        </>
      )}
    </div>
  );
};

export default UniversalCard;