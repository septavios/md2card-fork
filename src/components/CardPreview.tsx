import { marked } from "marked";
import useSettingsStore from "../stores/settingsStore";
import useEditorStore from "../stores/editorStore";

import "../styles/themes.css";
import { useEffect, useState, forwardRef, useMemo } from "react";
import { themeManager, UserConfig } from "../config/themeManager";
import { migrateFromOldSettings, configToCSSVariables } from "../config/configMerger";
import PaginatedMarkdownViewer from "../utils/PaginatedMarkdownViewer";
import LongMarkdownViewer from "../utils/LongMarkdownViewer";
import UniversalCard from "./UniversalCard";
import { FinalConfig } from '../config/themeConfig';

const CardPreview = forwardRef<HTMLDivElement, object>((props, ref) => {
  const { content: markdown } = useEditorStore();
  const {
    selectedTheme,
    cardWidth: width,
    cardHeight: height,
    viewMode,
    showPageNumbers,
    layoutMode,
    selectedFont,
    fontSize,
    lineHeight,
    background,
    hasUserCustomizations,
  } = useSettingsStore();

  const [html, setHtml] = useState('');
  const [finalConfig, setFinalConfig] = useState<FinalConfig | null>(null);
  const [cssVariables, setCssVariables] = useState<Record<string, any>>({});

  // 从旧设置迁移到新的用户配置，使用 useMemo 避免无限循环
  const userConfig: UserConfig = useMemo(() => {
    const base = {
      selectedFont,
      fontSize,
      lineHeight,
    };
    // Only include background if user customized it
    if (hasUserCustomizations.background) {
      return migrateFromOldSettings({
        ...base,
        background,
      });
    } else {
      return migrateFromOldSettings(base);
    }
  }, [selectedFont, fontSize, lineHeight, background, hasUserCustomizations.background]);

  // 获取主题渲染器
  const renderer = themeManager.getThemeRenderer(selectedTheme);

  async function markdownToHtml(markdown: string) {
    if (!renderer) {
      return await marked.parse(markdown);
    }
    return await marked.parse(markdown, { renderer });
  }

  useEffect(() => {
    markdownToHtml(markdown).then(parsed => setHtml(parsed));
  }, [markdown, renderer, selectedTheme]);

  // 获取最终配置
  useEffect(() => {
    const config = themeManager.getFinalConfig(selectedTheme, userConfig, hasUserCustomizations);
    if (config) {
      console.log('Background config:', userConfig.background);
      console.log('Final config background:', config.background);
      setFinalConfig(config);
      
      // 生成CSS变量
      const cssVars = configToCSSVariables(config, hasUserCustomizations);
      console.log('Generated CSS variables:', cssVars);
      setCssVariables(cssVars);
    }
  }, [selectedTheme, userConfig, hasUserCustomizations]);

  // 如果配置还没有加载完成，显示加载状态
  if (!finalConfig) {
    return (
      <div 
        className="rounded-lg shadow-sm p-8 overflow-auto h-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      >
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg shadow-sm p-8 h-full"
      style={{
        minWidth: '100%',
        minHeight: '100%',
        fontFamily: cssVariables['--card-font-family'] || 'var(--font-family)',
        backgroundColor: cssVariables['--card-color-background'] || 'var(--bg-tertiary)',
        color: cssVariables['--card-color-text'] || 'var(--text-primary)',
        ...cssVariables, // Apply all CSS variables to this container
      }}
    >
      <div ref={ref} className="export-content" style={{ display: 'inline-block' }}>
        {
          viewMode === "长卡片" ? (
            <LongMarkdownViewer
              html={html}
              CardComponent={UniversalCard}
              pageWidth={width}
              showPageNumbers={showPageNumbers}
              layoutMode={layoutMode}
              config={finalConfig}
            />
          ) : (
            <PaginatedMarkdownViewer
              CardComponent={UniversalCard}
              pageWidth={width}
              pageHeight={height}
              html={html}
              showPageNumbers={showPageNumbers}
              layoutMode={layoutMode}
              config={finalConfig}
            />
          )
        }
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;
