import React, { useState } from 'react';
import { devLog, prodLog } from '../utils/logger';
import useStickerStore from '../stores/stickerStore';

interface SideButtonPanelProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onEditMode?: () => void;
}

const SideButtonPanel: React.FC<SideButtonPanelProps> = ({ previewRef, onEditMode }) => {
  const { stickers, clearAllStickers, setPickerOpen, isPickerOpen } = useStickerStore();
  const [showStickerMenu, setShowStickerMenu] = useState(false);
  // Download PNG file
  const handleDownloadPNG = async () => {
    try {
      if (previewRef.current) {
        const htmlToImage = await import("html-to-image");
        
        // Store original styles
        const originalStyles = new Map();
        const elementsToAdjust = [
          previewRef.current,
          ...Array.from(previewRef.current.querySelectorAll('.export-content, .card, .card-content, .card-content-inner'))
        ];
        
        // Temporarily adjust styles to prevent truncation
        elementsToAdjust.forEach(element => {
          if (element instanceof HTMLElement) {
            originalStyles.set(element, {
              overflow: element.style.overflow,
              maxWidth: element.style.maxWidth,
              width: element.style.width,
              whiteSpace: element.style.whiteSpace,
              wordWrap: element.style.wordWrap,
              minWidth: element.style.minWidth,
              flexShrink: element.style.flexShrink,
              flexBasis: element.style.flexBasis
            });
            
            // Apply styles to ensure full content is captured
            element.style.overflow = 'visible';
            element.style.maxWidth = 'none';
            element.style.whiteSpace = 'normal';
            element.style.wordWrap = 'break-word';
            element.style.flexShrink = '0';
            element.style.flexBasis = 'auto';
            
            // For the main container, ensure it's wide enough
            if (element === previewRef.current) {
              element.style.width = 'auto';
              element.style.minWidth = '100%';
            } else if (element.classList.contains('export-content')) {
              // For export-content, remove width constraints completely
              element.style.width = 'auto';
              element.style.minWidth = 'max-content';
            }
          }
        });
        
        // Wait a bit for layout to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const dataUrl = await htmlToImage.toPng(previewRef.current, {
          backgroundColor: 'transparent',
          pixelRatio: 3, // Higher quality for social media
          skipAutoScale: true
        });
        
        // Restore original styles
        elementsToAdjust.forEach(element => {
          if (element instanceof HTMLElement && originalStyles.has(element)) {
            const original = originalStyles.get(element);
            element.style.overflow = original.overflow;
            element.style.maxWidth = original.maxWidth;
            element.style.width = original.width;
            element.style.whiteSpace = original.whiteSpace;
            element.style.wordWrap = original.wordWrap;
            element.style.minWidth = original.minWidth;
            element.style.flexShrink = original.flexShrink;
            element.style.flexBasis = original.flexBasis;
          }
        });
        
        const link = document.createElement("a");
        link.download = "md2card.png";
        link.href = dataUrl;
        link.click();
      } else {
        prodLog.error("Preview element not found");
      }
    } catch (error) {
      prodLog.error("Download failed:", error);
    }
  };

  // Copy as PNG file
  const handleCopyPNG = async () => {
    try {
      if (previewRef.current) {
        const htmlToImage = await import("html-to-image");
        
        // Store original styles
        const originalStyles = new Map();
        const elementsToAdjust = [
          previewRef.current,
          ...Array.from(previewRef.current.querySelectorAll('.export-content, .card, .card-content, .card-content-inner'))
        ];
        
        // Temporarily adjust styles to prevent truncation
        elementsToAdjust.forEach(element => {
          if (element instanceof HTMLElement) {
            originalStyles.set(element, {
              overflow: element.style.overflow,
              maxWidth: element.style.maxWidth,
              width: element.style.width,
              whiteSpace: element.style.whiteSpace,
              wordWrap: element.style.wordWrap,
              minWidth: element.style.minWidth,
              flexShrink: element.style.flexShrink,
              flexBasis: element.style.flexBasis
            });
            
            // Apply styles to ensure full content is captured
            element.style.overflow = 'visible';
            element.style.maxWidth = 'none';
            element.style.whiteSpace = 'normal';
            element.style.wordWrap = 'break-word';
            element.style.flexShrink = '0';
            element.style.flexBasis = 'auto';
            
            // For the main container, ensure it's wide enough
            if (element === previewRef.current) {
              element.style.width = 'auto';
              element.style.minWidth = '100%';
            } else if (element.classList.contains('export-content')) {
              // For export-content, remove width constraints completely
              element.style.width = 'auto';
              element.style.minWidth = 'max-content';
            }
          }
        });
        
        // Wait a bit for layout to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const blob = await htmlToImage.toBlob(previewRef.current, {
          backgroundColor: 'transparent',
          pixelRatio: 3, // Higher quality for social media
          skipAutoScale: true
        });
        
        // Restore original styles
        elementsToAdjust.forEach(element => {
          if (element instanceof HTMLElement && originalStyles.has(element)) {
            const original = originalStyles.get(element);
            element.style.overflow = original.overflow;
            element.style.maxWidth = original.maxWidth;
            element.style.width = original.width;
            element.style.whiteSpace = original.whiteSpace;
            element.style.wordWrap = original.wordWrap;
            element.style.minWidth = original.minWidth;
            element.style.flexShrink = original.flexShrink;
            element.style.flexBasis = original.flexBasis;
          }
        });
        
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          // You could add a toast notification here
          devLog.log('Image copied to clipboard');
        }
      } else {
        prodLog.error("Preview element not found");
      }
    } catch (error) {
      prodLog.error("Copy failed:", error);
    }
  };

  // Export optimized for Xiaohongshu (Little Red Book)
  const handleXiaohongshuExport = async () => {
    try {
      if (previewRef.current) {
        const htmlToImage = await import("html-to-image");
        
        // Store original styles
        const originalStyles = new Map();
        const elementsToAdjust = [
          previewRef.current,
          ...Array.from(previewRef.current.querySelectorAll('.export-content, .card, .card-content, .card-content-inner'))
        ];
        
        // Temporarily adjust styles to prevent truncation
        elementsToAdjust.forEach(element => {
          if (element instanceof HTMLElement) {
            originalStyles.set(element, {
              overflow: element.style.overflow,
              maxWidth: element.style.maxWidth,
              width: element.style.width,
              whiteSpace: element.style.whiteSpace,
              wordWrap: element.style.wordWrap,
              minWidth: element.style.minWidth,
              flexShrink: element.style.flexShrink,
              flexBasis: element.style.flexBasis
            });
            
            // Apply styles to ensure full content is captured
            element.style.overflow = 'visible';
            element.style.maxWidth = 'none';
            element.style.whiteSpace = 'normal';
            element.style.wordWrap = 'break-word';
            element.style.flexShrink = '0';
            element.style.flexBasis = 'auto';
            
            // For the main container, ensure it's wide enough
            if (element === previewRef.current) {
              element.style.width = 'auto';
              element.style.minWidth = '100%';
            } else if (element.classList.contains('export-content')) {
              // For export-content, remove width constraints completely
              element.style.width = 'auto';
              element.style.minWidth = 'max-content';
            }
          }
        });
        
        // Wait a bit for layout to settle
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Ultra-high quality settings for social media
        const dataUrl = await htmlToImage.toJpeg(previewRef.current, {
          backgroundColor: '#ffffff', // White background for better compression
          pixelRatio: 4, // Ultra-high quality for Xiaohongshu
          quality: 0.98, // High quality JPEG
          skipAutoScale: true
        });
        
        // Restore original styles
        elementsToAdjust.forEach(element => {
          if (element instanceof HTMLElement && originalStyles.has(element)) {
            const original = originalStyles.get(element);
            element.style.overflow = original.overflow;
            element.style.maxWidth = original.maxWidth;
            element.style.width = original.width;
            element.style.whiteSpace = original.whiteSpace;
            element.style.wordWrap = original.wordWrap;
            element.style.minWidth = original.minWidth;
            element.style.flexShrink = original.flexShrink;
            element.style.flexBasis = original.flexBasis;
          }
        });
        
        const link = document.createElement("a");
        link.download = "xiaohongshu-card.jpg";
        link.href = dataUrl;
        link.click();
      } else {
        prodLog.error("Preview element not found");
      }
    } catch (error) {
      prodLog.error("Xiaohongshu export failed:", error);
    }
  };

  // Add sticker to preview card
  const handleAddSticker = () => {
    devLog.log('Opening sticker picker...');
    setPickerOpen(true);
  };

  // Toggle sticker menu
  const handleStickerMenu = () => {
    setShowStickerMenu(!showStickerMenu);
  };

  // Clear all stickers
  const handleClearStickers = () => {
    clearAllStickers();
    setShowStickerMenu(false);
  };

  // Change to edit mode
  const handleEditMode = () => {
    if (onEditMode) {
      onEditMode();
    } else {
      // Default behavior: focus on the editor
      devLog.log('Switch to edit mode');
    }
  };

  const buttonClass = `
    w-10 h-10 
    bg-gray-800 hover:bg-gray-700 
    border border-gray-600 
    rounded-lg 
    flex items-center justify-center 
    text-white text-lg
    transition-all duration-200 
    hover:scale-105 
    cursor-pointer
    mb-2
  `;

  return (
    <div 
      className="absolute right-4 top-4 z-50"
      style={{}}
    >
      <div className="flex flex-col space-y-2">
        {/* Download PNG */}
        <button
          onClick={handleDownloadPNG}
          className={buttonClass}
          title="Download PNG"
        >
          ⬇
        </button>

        {/* Copy PNG */}
        <button
          onClick={handleCopyPNG}
          className={buttonClass}
          title="Copy as PNG"
        >
          📋
        </button>

        {/* Xiaohongshu Optimized Export */}
        <button
          onClick={handleXiaohongshuExport}
          className={`${buttonClass} bg-red-600 hover:bg-red-500`}
          title="小红书优化导出 (Ultra HD JPEG)"
        >
          📱
        </button>

        {/* Add Sticker */}
        <div className="relative">
          <button
            onClick={handleAddSticker}
            onContextMenu={(e) => {
              e.preventDefault();
              handleStickerMenu();
            }}
            className={`${buttonClass} ${stickers.length > 0 ? 'bg-pink-600 hover:bg-pink-500' : ''}`}
            title="添加贴纸 (右键查看更多选项)"
          >
            🏷
            {stickers.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {stickers.length}
              </span>
            )}
          </button>
          
          {/* Sticker Menu */}
          {showStickerMenu && (
            <>
              {/* Backdrop to close menu */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowStickerMenu(false)}
              />
              <div className="absolute right-full mr-2 top-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-32 z-50">
                <button
                  onClick={() => {
                    handleAddSticker();
                    setShowStickerMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
                >
                  🏷 添加贴纸
                </button>
                {stickers.length > 0 && (
                  <>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleClearStickers}
                      className="w-full text-left px-3 py-2 hover:bg-red-100 rounded text-sm text-red-600 flex items-center gap-2"
                    >
                      🗑 清除所有 ({stickers.length})
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Edit Mode */}
        <button
          onClick={handleEditMode}
          className={buttonClass}
          title="Edit Mode"
        >
          ✏️
        </button>
      </div>
    </div>
  );
};

export default SideButtonPanel;