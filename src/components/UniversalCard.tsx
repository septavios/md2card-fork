import React, { useEffect } from 'react';
import { CardProps } from '../config/themeConfig';
import useSettingsStore from '../stores/settingsStore';
import appleNotesTasksCSS from '../styles/apple-notes-tasks.css?raw';

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
  config,
}) => {
  const { selectedTheme } = useSettingsStore();
  
  // 处理任务列表样式
  useEffect(() => {
    if (selectedTheme === 'AppleNotesDark' && contentRef?.current) {
      const container = contentRef.current;
      
      // 查找所有包含checkbox的li元素
      const listItems = container.querySelectorAll('li');
      
      listItems.forEach((li) => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        if (checkbox) {
          // 移除之前的类名
          li.classList.remove('task-item-checked', 'task-item-unchecked');
          
          // 根据checkbox状态添加相应的类名
          if ((checkbox as HTMLInputElement).checked) {
            li.classList.add('task-item-checked');
          } else {
            li.classList.add('task-item-unchecked');
          }
        }
      });
    }
  }, [page, selectedTheme, contentRef]);
  
  // Use CSS variables for theme
  const styleVars: React.CSSProperties & Record<string, any> = {
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
  };

  // 检查是否为小红书主题或Apple Notes主题
  const isXiaohongshuTheme = selectedTheme === 'Xiaohongshu' || selectedTheme === 'XiaohongshuDark';
  const isAppleNotesTheme = selectedTheme === 'AppleNotesDark';
  const needsHeaderStructure = isXiaohongshuTheme || isAppleNotesTheme;

  // 将camelCase转换为kebab-case
  const camelToKebab = (str: string) => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  };

  // 生成自定义样式CSS
  const generateCustomStylesCSS = () => {
    if (!config.customStyles) return '';
    
    console.log('Generating custom styles from config:', config.customStyles);
    
    let cssString = '';
    
    // 处理 elements 样式
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
    
    // 处理其他顶层样式（如果有的话）
    Object.entries(config.customStyles).forEach(([key, value]) => {
      if (key !== 'elements' && key !== 'container' && typeof value === 'object' && value !== null) {
        const cssProperties = Object.entries(value as Record<string, any>)
          .map(([property, val]) => `${camelToKebab(property)}: ${val}`)
          .join('; ');
        cssString += `${key} { ${cssProperties} } `;
      }
    });
    
    console.log('Custom styles CSS:', cssString);
    return cssString;
  };

  const customStylesCSS = generateCustomStylesCSS();

  return (
    <div
      ref={containerRef}
      style={styleVars}
      className="relative flex flex-col justify-between"
    >
      {/* 注入自定义样式 */}
      {customStylesCSS && (
        <style dangerouslySetInnerHTML={{ __html: customStylesCSS }} />
      )}
      
      {/* 注入Apple Notes任务列表样式 */}
      {isAppleNotesTheme && (
        <style dangerouslySetInnerHTML={{ __html: appleNotesTasksCSS }} />
      )}
      
      {needsHeaderStructure ? (
        // 需要header结构的主题（小红书和Apple Notes）
        <div className={`card ${isAppleNotesTheme ? 'card-apple-notes' : ''}`}>
          <div className="card-header">
            {isAppleNotesTheme && (
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
              style={{
                background: 'var(--card-background)',
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
                backgroundColor: 'var(--card-background)',
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
              background: 'var(--card-background)',
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
                backgroundColor: 'var(--card-background)',
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