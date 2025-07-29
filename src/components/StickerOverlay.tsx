import React, { useState, useRef, useEffect, useCallback } from 'react';
import useStickerStore, { Sticker } from '../stores/stickerStore';

interface StickerOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const StickerOverlay: React.FC<StickerOverlayProps> = ({ containerRef }) => {
  const { 
    stickers, 
    selectedStickerId, 
    selectSticker, 
    updateSticker, 
    removeSticker,
    duplicateSticker,
    bringToFront,
    sendToBack
  } = useStickerStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState<string | null>(null);
  const dragRef = useRef<string | null>(null);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, stickerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIsDragging(true);
    setDragStart({ x, y });
    dragRef.current = stickerId;
    selectSticker(stickerId);
    
    // Handle double click for controls
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      // Double click detected
      setShowControls(showControls === stickerId ? null : stickerId);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 300);
    }
  }, [containerRef, showControls, selectSticker]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragRef.current || !containerRef.current) return;
    
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // 限制在容器范围内，留出一些边距
    const clampedX = Math.max(2, Math.min(98, x));
    const clampedY = Math.max(2, Math.min(98, y));
    
    updateSticker(dragRef.current, { x: clampedX, y: clampedY });
  }, [isDragging, containerRef, updateSticker]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragRef.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 点击空白区域取消选择
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectSticker(null);
      setShowControls(null);
    }
  }, [selectSticker]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const StickerControls: React.FC<{ sticker: Sticker }> = ({ sticker }) => (
    <div 
      className="absolute bg-white rounded-lg shadow-xl border border-gray-300 p-3 z-[100]"
      style={{
        left: `${sticker.x}%`,
        top: `${Math.max(0, sticker.y - 20)}%`,
        transform: 'translate(-50%, -100%)',
        minWidth: '320px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-2">
        {/* Size controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 w-8">大小:</span>
          <button
            onClick={() => updateSticker(sticker.id, { size: Math.max(0.3, sticker.size - 0.2) })}
            className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-bold flex items-center justify-center transition-colors"
            title="缩小"
          >
            -
          </button>
          <span className="text-sm px-2 min-w-12 text-center font-medium bg-gray-50 rounded py-1">
            {Math.round(sticker.size * 100)}%
          </span>
          <button
            onClick={() => updateSticker(sticker.id, { size: Math.min(3, sticker.size + 0.2) })}
            className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-bold flex items-center justify-center transition-colors"
            title="放大"
          >
            +
          </button>
          
          {/* Quick size presets */}
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => updateSticker(sticker.id, { size: 0.5 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="小"
            >
              小
            </button>
            <button
              onClick={() => updateSticker(sticker.id, { size: 1.0 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="中"
            >
              中
            </button>
            <button
              onClick={() => updateSticker(sticker.id, { size: 1.5 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="大"
            >
              大
            </button>
          </div>
        </div>
        
        {/* Rotation controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 w-8">旋转:</span>
          <button
            onClick={() => updateSticker(sticker.id, { rotation: (sticker.rotation - 15 + 360) % 360 })}
            className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-lg text-sm flex items-center justify-center transition-colors"
            title="逆时针旋转"
          >
            ↺
          </button>
          <span className="text-sm px-2 min-w-12 text-center font-medium bg-gray-50 rounded py-1">
            {Math.round(sticker.rotation)}°
          </span>
          <button
            onClick={() => updateSticker(sticker.id, { rotation: (sticker.rotation + 15) % 360 })}
            className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-lg text-sm flex items-center justify-center transition-colors"
            title="顺时针旋转"
          >
            ↻
          </button>
          
          {/* Reset rotation */}
          <button
            onClick={() => updateSticker(sticker.id, { rotation: 0 })}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors ml-2"
            title="重置旋转"
          >
            重置
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1 pt-1 border-t border-gray-200">
          {/* Layer controls */}
          <button
            onClick={() => bringToFront(sticker.id)}
            className="w-8 h-8 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs flex items-center justify-center transition-colors"
            title="置于顶层"
          >
            ↑
          </button>
          <button
            onClick={() => sendToBack(sticker.id)}
            className="w-8 h-8 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs flex items-center justify-center transition-colors"
            title="置于底层"
          >
            ↓
          </button>
          
          {/* Duplicate */}
          <button
            onClick={() => {
              duplicateSticker(sticker.id);
              setShowControls(null);
            }}
            className="w-8 h-8 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-xs flex items-center justify-center transition-colors"
            title="复制"
          >
            📋
          </button>
          
          {/* Delete */}
          <button
            onClick={() => {
              removeSticker(sticker.id);
              setShowControls(null);
            }}
            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg text-xs flex items-center justify-center text-red-600 transition-colors"
            title="删除"
          >
            🗑
          </button>
          
          {/* Close controls */}
          <button
            onClick={() => setShowControls(null)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs flex items-center justify-center transition-colors ml-auto"
            title="关闭控制面板"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      onClick={handleContainerClick}
      style={{ zIndex: 10 }}
    >
      {stickers.map((sticker) => (
        <div key={sticker.id}>
          {/* Sticker */}
          <div
            className={`absolute pointer-events-auto cursor-move select-none transition-all duration-150 hover:scale-105 ${
              selectedStickerId === sticker.id ? 'ring-2 ring-pink-400 ring-opacity-50' : ''
            }`}
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) scale(${sticker.size}) rotate(${sticker.rotation}deg)`,
              zIndex: sticker.zIndex + 10,
              fontSize: '2rem',
              filter: selectedStickerId === sticker.id ? 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.3))' : 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
            onMouseDown={(e) => handleMouseDown(e, sticker.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowControls(showControls === sticker.id ? null : sticker.id);
            }}
            title={`${sticker.emoji} - 双击或右键打开控制面板`}
          >
            {sticker.emoji}
          </div>
          
          {/* Controls */}
          {showControls === sticker.id && (
            <StickerControls sticker={sticker} />
          )}
        </div>
      ))}
      
      {/* Instructions overlay when no stickers */}
      {stickers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black bg-opacity-20 text-white px-6 py-3 rounded-lg text-sm text-center max-w-xs">
            <div className="mb-1">点击右侧贴纸按钮添加小红书贴纸 🏷️</div>
            <div className="text-xs opacity-80">添加后双击或右键贴纸可调整大小和旋转</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerOverlay;