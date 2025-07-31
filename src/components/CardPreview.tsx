import { marked } from "marked";
import useSettingsStore from "../stores/settingsStore";
import useEditorStore from "../stores/editorStore";
import { useImageStore } from "../stores/imageStore";

import "../styles/themes.css";
import { useEffect, useState, forwardRef, useMemo, useRef } from "react";
import { themeManager, UserConfig } from "../config/themeManager";
import { migrateFromOldSettings, configToCSSVariables } from "../config/configMerger";
import PaginatedMarkdownViewer from "../utils/PaginatedMarkdownViewer";
import LongMarkdownViewer from "../utils/LongMarkdownViewer";
import UniversalCard from "./UniversalCard";
import StickerOverlay from "./StickerOverlay";
import { FinalConfig } from '../config/themeConfig';
import { devLog } from '../utils/logger';

const CardPreview = forwardRef<HTMLDivElement, object>((props, ref) => {
  const { content: markdown } = useEditorStore();
  const { getImageUrl } = useImageStore();
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
  
  // Create a separate ref for the sticker overlay container
  const stickerContainerRef = useRef<HTMLDivElement>(null);

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

  // 获取主题渲染器并扩展它以处理图片引用
  const renderer = useMemo(() => {
    const baseRenderer = themeManager.getThemeRenderer(selectedTheme);
    
    if (!baseRenderer) {
      // Create a new renderer if no base renderer exists
      const customRenderer = new marked.Renderer();
      
      // Override image rendering to handle img: references
      customRenderer.image = function(token: any) {
        const { href, title, text } = token;
        
        if (href.startsWith('img:')) {
          const imageId = href.substring(4); // Remove 'img:' prefix
          const blobUrl = getImageUrl(imageId);
          
          if (blobUrl) {
            return `<img class="md-image" src="${blobUrl}" alt="${text}" ${title ? `title="${title}"` : ''} />`;
          } else {
            // Fallback for missing images - show a more helpful message
            return `<div class="missing-image" style="
              color: #666; 
              font-style: italic; 
              padding: 20px; 
              border: 2px dashed #ccc; 
              border-radius: 8px; 
              text-align: center;
              background: #f9f9f9;
              margin: 10px 0;
            ">
              <div style="font-size: 24px; margin-bottom: 8px;">📷</div>
              <div>Image not found: ${text}</div>
              <div style="font-size: 12px; color: #999; margin-top: 4px;">
                The image may have been removed or the page was refreshed.<br>
                Please re-upload the image.
              </div>
            </div>`;
          }
        }
        
        // Handle regular image URLs
        return `<img class="md-image" src="${href}" alt="${text}" ${title ? `title="${title}"` : ''} />`;
      };
      
      return customRenderer;
    } else {
      // Extend existing renderer
      const originalImage = baseRenderer.image;
      
      baseRenderer.image = function(token: any) {
        const { href, title, text } = token;
        
        if (href.startsWith('img:')) {
          const imageId = href.substring(4); // Remove 'img:' prefix
          const blobUrl = getImageUrl(imageId);
          
          if (blobUrl) {
            // Create a new token with the resolved blob URL
            const newToken = { ...token, href: blobUrl };
            return originalImage ? originalImage.call(this, newToken) : 
                   `<img class="md-image" src="${blobUrl}" alt="${text}" ${title ? `title="${title}"` : ''} />`;
          } else {
            // Fallback for missing images - show a more helpful message
            return `<div class="missing-image" style="
              color: #666; 
              font-style: italic; 
              padding: 20px; 
              border: 2px dashed #ccc; 
              border-radius: 8px; 
              text-align: center;
              background: #f9f9f9;
              margin: 10px 0;
            ">
              <div style="font-size: 24px; margin-bottom: 8px;">📷</div>
              <div>Image not found: ${text}</div>
              <div style="font-size: 12px; color: #999; margin-top: 4px;">
                The image may have been removed or the page was refreshed.<br>
                Please re-upload the image.
              </div>
            </div>`;
          }
        }
        
        // Use original renderer for regular URLs
        return originalImage ? originalImage.call(this, token) : 
               `<img class="md-image" src="${href}" alt="${text}" ${title ? `title="${title}"` : ''} />`;
      };
      
      return baseRenderer;
    }
  }, [selectedTheme, getImageUrl]);
  
  devLog.log(`Getting renderer for theme ${selectedTheme}:`, renderer);

  async function markdownToHtml(markdown: string) {
    devLog.log('Converting markdown to HTML with renderer:', renderer);
    devLog.log('Input markdown:', markdown);
    
    // Configure marked to handle task lists
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: false,
    });
    
    let result;
    if (!renderer) {
      result = await marked.parse(markdown);
    } else {
      result = await marked.parse(markdown, { renderer });
    }
    
    devLog.log('Generated HTML:', result);
    return result;
  }

  useEffect(() => {
    markdownToHtml(markdown).then(parsed => {
      devLog.log('Setting HTML:', parsed);
      setHtml(parsed);
    });
  }, [markdown, renderer, selectedTheme]);

  // 获取最终配置
  useEffect(() => {
    const config = themeManager.getFinalConfig(selectedTheme, userConfig, hasUserCustomizations);
    if (config) {
      devLog.log('Background config:', userConfig.background);
      devLog.log('Final config background:', config.background);
      setFinalConfig(config);
      
      // 生成CSS变量
      const cssVars = configToCSSVariables(config, hasUserCustomizations);
      devLog.log('Generated CSS variables:', cssVars);
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
      className="rounded-lg shadow-sm p-8 h-full flex items-start justify-center"
      style={{
        minWidth: '100%',
        minHeight: '100%',
        fontFamily: cssVariables['--card-font-family'] || 'var(--font-family)',
        backgroundColor: cssVariables['--card-color-background'] || 'var(--bg-tertiary)',
        color: cssVariables['--card-color-text'] || 'var(--text-primary)',
        ...cssVariables, // Apply all CSS variables to this container
      }}
    >
      <div ref={ref} className="export-content" style={{ width: '100%', maxWidth: `${width}px`, position: 'relative' }}>
        <div ref={stickerContainerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
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
          
          {/* Sticker Overlay */}
          <StickerOverlay containerRef={stickerContainerRef} />
        </div>
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;
