import { marked } from "marked";
import useSettingsStore from "../stores/settingsStore";
import useEditorStore from "../stores/editorStore";
import { useImageStore } from "../stores/imageStore";

import "../styles/themes.css";
import React, { useEffect, useState, forwardRef, useMemo, useRef } from "react";
import { themeManager, UserConfig } from "../config/themeManager";
import { migrateFromOldSettings, configToCSSVariables } from "../config/configMerger";
import PaginatedMarkdownViewer from "../utils/PaginatedMarkdownViewer";
import LongMarkdownViewer from "../utils/LongMarkdownViewer";
import UniversalCard from "./UniversalCard";
import StickerOverlay from "./StickerOverlay";
import { FinalConfig } from '../config/themeConfig';
import { devLog } from '../utils/logger';
import { LayoutMode } from '../stores/settingsStore';
import useStickerStore from '../stores/stickerStore';

// Component to handle individual card sections
const CardSection = ({ 
  section, 
  renderer, 
  viewMode, 
  width, 
  height, 
  showPageNumbers, 
  layoutMode, 
  finalConfig,
  sectionIndex,
  totalSections
}: {
  section: string;
  renderer: any;
  viewMode: string;
  width: number;
  height: number;
  showPageNumbers: boolean;
  layoutMode: LayoutMode;
  finalConfig: FinalConfig;
  sectionIndex: number;
  totalSections: number;
}) => {
  const [sectionHtml, setSectionHtml] = useState('');
  
  useEffect(() => {
    const processSectionHtml = async () => {
      let result;
      if (!renderer) {
        result = await marked.parse(section);
      } else {
        result = await marked.parse(section, { renderer });
      }
      // 不需要为横线拆分模式添加特殊包装，因为每个CardSection都是独立处理的
      setSectionHtml(result);
    };
    processSectionHtml();
  }, [section, renderer, layoutMode, sectionIndex, totalSections]);
  
  return (
    <>
      {
        viewMode === "长卡片" ? (
          <LongMarkdownViewer
            html={sectionHtml}
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
            html={sectionHtml}
            showPageNumbers={showPageNumbers}
            layoutMode={layoutMode}
            config={finalConfig}
          />
        )
      }
    </>
  );
};

// Component to handle multiple card sections or single card
const CardSections = ({ 
  markdown, 
  renderer, 
  viewMode, 
  width, 
  height, 
  showPageNumbers, 
  layoutMode, 
  finalConfig, 
  html 
}: {
  markdown: string;
  renderer: any;
  viewMode: string;
  width: number;
  height: number;
  showPageNumbers: boolean;
  layoutMode: LayoutMode;
  finalConfig: FinalConfig;
  html: string;
}) => {
  // 只有在横线拆分模式下且不是长卡片模式且包含卡片分隔符 ---- 时才进行拆分
  if (layoutMode === "横线拆分" && viewMode !== "长卡片" && markdown.includes('----')) {
    // 按照 ---- 分割内容
    const sections = markdown.split(/^----$/gm).map(section => section.trim()).filter(section => section.length > 0);
    devLog.log('Found card separator in 横线拆分 mode, splitting into sections:', sections.length);
    
    return (
      <div className="card-sections-container">
        {sections.map((section, index) => (
          <div key={index} className="card-section card-section-wrapper" style={{ marginBottom: '2rem' }}>
            <CardSection
              section={section}
              renderer={renderer}
              viewMode={viewMode}
              width={width}
              height={height}
              showPageNumbers={showPageNumbers}
              layoutMode={layoutMode}
              finalConfig={finalConfig}
              sectionIndex={index}
              totalSections={sections.length}
            />
          </div>
        ))}
      </div>
    );
  } else {
    // 正常的单卡片渲染（包括自动拆分模式或横线拆分模式但没有----的情况）
    return (
      <>
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
      </>
    );
  }
};
  
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
    
    // 正常处理，不在这里分割
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

  // 卡片预览操作按钮区
  const CardPreviewActions: React.FC<{ previewRef: React.RefObject<HTMLDivElement> }> = ({ previewRef }) => {
    const { stickers, clearAllStickers, setPickerOpen } = useStickerStore();
    const [showStickerMenu, setShowStickerMenu] = useState(false);

    // 下载PNG
    const handleDownloadPNG = async () => {
      try {
        if (previewRef.current) {
          const htmlToImage = await import('html-to-image');
          const dataUrl = await htmlToImage.toPng(previewRef.current, {
            backgroundColor: 'transparent',
            pixelRatio: 3,
            skipAutoScale: true
          });
          const link = document.createElement('a');
          link.download = 'md2card.png';
          link.href = dataUrl;
          link.click();
        }
      } catch (e) { /* 错误处理略 */ }
    };

    // 复制PNG
    const handleCopyPNG = async () => {
      try {
        if (previewRef.current) {
          const htmlToImage = await import('html-to-image');
          const blob = await htmlToImage.toBlob(previewRef.current, {
            backgroundColor: 'transparent',
            pixelRatio: 3,
            skipAutoScale: true
          });
          if (blob) {
            await navigator.clipboard.write([
              new window.ClipboardItem({ 'image/png': blob })
            ]);
          }
        }
      } catch (e) { /* 错误处理略 */ }
    };

    // 小红书超清导出
    const handleXiaohongshuExport = async () => {
      // 可复用 SideButtonPanel 的逻辑
      setPickerOpen(true); // 示例：弹出贴纸选择器
    };

    // 添加贴纸
    const handleAddSticker = () => setPickerOpen(true);

    return (
      <div className="flex gap-2 p-2 rounded-lg shadow bg-white/90 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-10 mb-2 items-center">
        <button className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition" onClick={handleDownloadPNG} title="下载PNG">
          <span role="img" aria-label="下载">⬇️</span> 下载PNG
        </button>
        <button className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition" onClick={handleCopyPNG} title="复制为PNG">
          <span role="img" aria-label="复制">📋</span> 复制PNG
        </button>
        <button className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-sm hover:bg-red-100 dark:hover:bg-gray-700 font-medium transition" onClick={handleXiaohongshuExport} title="小红书超清导出">
          <span role="img" aria-label="小红书">📱</span> 小红书导出
        </button>
        <button className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 shadow-sm hover:bg-pink-100 dark:hover:bg-gray-700 font-medium transition relative" onClick={handleAddSticker} title="添加贴纸">
          <span role="img" aria-label="贴纸">🏷️</span> 添加贴纸
          {stickers.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{stickers.length}</span>
          )}
        </button>
      </div>
    );
  };

  return (
    <div
      className="rounded-lg shadow-sm pt-2 pb-8 px-8 flex flex-col items-start justify-center"
      style={{
        minWidth: '100%',
        minHeight: 0,
        fontFamily: cssVariables['--card-font-family'] || 'var(--font-family)',
        color: cssVariables['--card-color-text'] || 'var(--text-primary)',
        overflow: 'visible',
        scrollBehavior: 'smooth',
        isolation: 'isolate',
        ...cssVariables,
        background: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <CardPreviewActions previewRef={ref as React.RefObject<HTMLDivElement>} />
      <div ref={ref} className="export-content" style={{ width: '100%', maxWidth: `${width}px` }}>
        <div ref={stickerContainerRef} style={{ position: 'relative', width: '100%' }}>
          <CardSections 
            markdown={markdown}
            renderer={renderer}
            viewMode={viewMode}
            width={width}
            height={height}
            showPageNumbers={showPageNumbers}
            layoutMode={layoutMode}
            finalConfig={finalConfig}
            html={html}
          />
          <StickerOverlay containerRef={stickerContainerRef} />
        </div>
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;
