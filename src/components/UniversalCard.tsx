import React from 'react';
import styled from 'styled-components';
import { CardProps, FinalConfig } from '../config/themeConfig';
import { configToCSSVariables } from '../config/configMerger';

// 动态样式容器
const DynamicCardContainer = styled.div<{ $config: FinalConfig }>`
  position: relative;
  box-sizing: border-box;
  
  /* 基础样式 */
  padding: var(--card-padding);
  margin: var(--card-margin);
  border-radius: var(--card-border-radius);
  background: var(--card-background);
  background-size: var(--card-background-size, auto);
  background-position: var(--card-background-position, initial);
  background-repeat: var(--card-background-repeat, initial);
  opacity: var(--card-opacity, 1);
  box-shadow: var(--card-shadow);
  
  /* 确保内容不会被截断 - 通过props动态控制 */
  word-wrap: break-word;
  word-break: break-word;
  
  /* 可读性增强 - 背景模糊 */
  ${props => props.$config.background.blurAmount ? `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: inherit;
      filter: blur(var(--card-blur-amount, 0px));
      z-index: -1;
      border-radius: inherit;
    }
  ` : ''}
  
  /* 可读性增强 - 对比度增强 */
  ${props => props.$config.background.contrastBoost ? `
    filter: contrast(${1 + (props.$config.background.contrastBoost || 0) / 100});
  ` : ''}
  
  /* 字体样式 */
  font-family: var(--card-font-family) !important;
  font-size: var(--card-font-size) !important;
  line-height: var(--card-line-height) !important;
  font-weight: var(--card-font-weight, 400) !important;
  color: var(--card-color-text);

  /* 确保所有子元素继承字体设置 */
  * {
    font-family: inherit !important;
    font-size: inherit !important;
    line-height: inherit !important;
  }

  /* 标题元素保持相对大小 */
  h1, .md-h1 { font-size: 2em !important; font-weight: 600; }
  h2, .md-h2 { font-size: 1.5em !important; font-weight: 600; }
  h3, .md-h3 { font-size: 1.25em !important; font-weight: 600; }
  h4, .md-h4 { font-size: 1.1em !important; font-weight: 600; }
  h5, .md-h5 { font-size: 1em !important; font-weight: 600; }
  h6, .md-h6 { font-size: 0.9em !important; font-weight: 600; }

  /* 代码元素使用等宽字体 */
  .md-code, .md-codespan, pre, code {
    font-family: 'JetBrains Mono', 'Courier New', monospace !important;
  }

  /* 文本覆盖层样式 */
  .card-content {
    position: relative;
    z-index: 1;
    overflow: visible;
    word-wrap: break-word;
    word-break: break-word;
    
    ${props => {
      const { textOverlay } = props.$config.background;
      switch (textOverlay) {
        case 'semi-transparent':
          return `
            background: rgba(255, 255, 255, 0.9) !important;
            padding: 1em;
            border-radius: 8px;
            backdrop-filter: blur(10px);
          `;
        case 'blur':
          return `
            background: rgba(255, 255, 255, 0.8) !important;
            padding: 1em;
            border-radius: 8px;
            backdrop-filter: blur(15px);
          `;
        case 'gradient':
          return `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%) !important;
            padding: 1em;
            border-radius: 8px;
            backdrop-filter: blur(5px);
          `;
        default:
          return '';
      }
    }}
  }

  /* 基础元素样式 */
  .md-listitem {
    margin: 0.5em 0;
  }

  .md-pre {
    background: rgba(0, 0, 0, 0.05);
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }

  .md-code {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }

  .md-codespan {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }

  .md-table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  .md-thead {
    background: rgba(0, 0, 0, 0.05);
  }

  .md-td,
  .md-th {
    border: 1px solid var(--card-color-border);
    padding: 0.5em;
  }

  .md-link {
    color: var(--card-color-primary);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .md-image {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  .md-text {
    line-height: inherit;
    margin: 1em 0;
  }

  .md-del {
    text-decoration: line-through;
    color: #666;
  }

  ol > li {
    list-style: decimal;
  }
  ul > li {
    list-style: disc;
  }

  /* 应用自定义样式 */
  ${props => {
    const { customStyles, background } = props.$config;
    let styles = '';
    
    if (!customStyles) {
      // 如果没有自定义样式但用户设置了背景，仍然需要移除默认背景
      if (background && (background.type === 'gradient' || background.type === 'solid' || background.type === 'image')) {
        styles += `&& .card-content { background: transparent !important; }`;
      }
      return styles;
    }
    
    // 应用容器样式
    if (customStyles.container) {
      Object.entries(customStyles.container).forEach(([key, value]) => {
        if (key.startsWith('&')) {
          // 伪元素或伪类
          styles += `${key} { ${Object.entries(value as any).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`).join(' ')} }`;
        } else {
          styles += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`;
        }
      });
    }
    
    // 应用元素样式
    if (customStyles.elements) {
      Object.entries(customStyles.elements).forEach(([selector, elementStyles]) => {
        // 如果用户设置了自定义背景，跳过.card-content的背景样式
        if (selector === '.card-content' && background && (background.type === 'gradient' || background.type === 'solid' || background.type === 'image')) {
          const filteredStyles = Object.entries(elementStyles).filter(([k]) => k !== 'background');
          if (filteredStyles.length > 0) {
            styles += `&& ${selector} { ${filteredStyles.map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`).join(' ')} background: transparent !important; }`;
          } else {
            styles += `&& ${selector} { background: transparent !important; }`;
          }
        } else {
          styles += `${selector} { ${Object.entries(elementStyles).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`).join(' ')} }`;
        }
      });
    }
    
    return styles;
  }}
`;

interface UniversalCardProps extends CardProps {
  // 直接继承 CardProps，不需要额外的 config 属性
}

const UniversalCard: React.FC<UniversalCardProps> = ({
  page,
  width,
  height,
  config,
  containerRef,
  contentRef,
  pageNumber,
  totalPages,
  showPageNumbers = false,
  hideOverflow = false,
}) => {
  // 生成CSS变量
  const cssVariables = configToCSSVariables(config, config.hasUserCustomizations);
  
  // 合并样式
  const containerStyle = {
    width: width && width > 0 ? `${width}px` : '100%',
    height: height && height > 0 ? `${height}px` : 'auto',
    minHeight: height && height > 0 ? `${height}px` : 'auto',
    // 根据hideOverflow参数控制overflow
    overflow: hideOverflow ? 'hidden' : 'visible',
    ...cssVariables,
  };

  return (
    <DynamicCardContainer
      ref={containerRef}
      $config={config}
      style={containerStyle}
    >
      <div 
        ref={contentRef}
        className="card-content"
        dangerouslySetInnerHTML={{ __html: page }}
      />
      {showPageNumbers && pageNumber && totalPages && (
        <div 
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            fontSize: '12px',
            color: 'var(--card-color-text)',
            opacity: 0.7,
            fontFamily: 'var(--card-font-family)',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '2px 6px',
            borderRadius: '4px',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}
        >
          {pageNumber} / {totalPages}
        </div>
      )}
    </DynamicCardContainer>
  );
};

export default UniversalCard;