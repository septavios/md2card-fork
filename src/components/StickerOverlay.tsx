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
      className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
      style={{
        left: `${sticker.x}%`,
        top: `${Math.max(0, sticker.y - 15)}%`,
        transform: 'translate(-50%, -100%)',
        minWidth: '280px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1 flex-wrap">
        {/* Size controls */}
        <button
          onClick={() => updateSticker(sticker.id, { size: Math.max(0.3, sticker.size - 0.1) })}
          className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors"
          title="缩小"
        >
          -
        </button>
        <span className="text-xs px-1 min-w-8 text-center">{Math.round(sticker.size * 100)}%</span>
        <button
          onClick={() => updateSticker(sticker.id, { size: Math.min(3, sticker.size + 0.1) })}
          className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors"
          title="放大"
        >
          +
        </button>
        
        {/* Rotation */}
        <button
          onClick={() => updateSticker(sticker.id, { rotation: (sticker.rotation + 15) % 360 })}
          className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors"
          title="旋转"
        >
          ↻
        </button>
        
        {/* Layer controls */}
        <button
          onClick={() => bringToFront(sticker.id)}
          className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors"
          title="置于顶层"
        >
          ↑
        </button>
        <button
          onClick={() => sendToBack(sticker.id)}
          className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors"
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
          className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors"
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
          className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded text-xs flex items-center justify-center text-red-600 transition-colors"
          title="删除"
        >
          🗑
        </button>
        
        {/* Close controls */}
        <button
          onClick={() => setShowControls(null)}
          className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors ml-1"
          title="关闭"
        >
          ✕
        </button>
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
            title={`${sticker.emoji} - 双击或右键编辑`}
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
          <div className="bg-black bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm">
            点击右侧贴纸按钮添加小红书贴纸 🏷️
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerOverlay;