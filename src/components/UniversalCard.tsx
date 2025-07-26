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
}) => {
  // 生成CSS变量
  const cssVariables = configToCSSVariables(config);
  
  // 合并样式
  const containerStyle = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
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
    </DynamicCardContainer>
  );
};

export default UniversalCard;