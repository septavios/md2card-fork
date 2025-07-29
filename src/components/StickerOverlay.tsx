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
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
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
      setShowContextMenu(null);
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
    <>
      {/* Resize handle - bottom right corner */}
      <div
        className="absolute w-4 h-4 bg-blue-500 rounded-full border border-white shadow-md cursor-nw-resize hover:bg-blue-600 transition-colors"
        style={{
          left: `${sticker.x + 1.5}%`,
          top: `${sticker.y + 1.5}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: sticker.zIndex + 20,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          
          const startSize = sticker.size;
          const startX = e.clientX;
          const startY = e.clientY;
          
          const handleResize = (e: MouseEvent) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const delta = (deltaX + deltaY) / 200;
            const newSize = Math.max(0.3, Math.min(3, startSize + delta));
            updateSticker(sticker.id, { size: newSize });
          };
          
          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
          };
          
          document.addEventListener('mousemove', handleResize);
          document.addEventListener('mouseup', handleResizeEnd);
        }}
        title="拖拽调整大小"
      />
      
      {/* Rotation handle - top right corner */}
      <div
        className="absolute w-4 h-4 bg-green-500 rounded-full border border-white shadow-md cursor-grab hover:bg-green-600 transition-colors"
        style={{
          left: `${sticker.x + 1.5}%`,
          top: `${sticker.y - 1.5}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: sticker.zIndex + 20,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          
          if (!containerRef.current) return;
          
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + (sticker.x / 100) * rect.width;
          const centerY = rect.top + (sticker.y / 100) * rect.height;
          
          const handleRotate = (e: MouseEvent) => {
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
            const normalizedAngle = ((angle % 360) + 360) % 360;
            updateSticker(sticker.id, { rotation: normalizedAngle });
          };
          
          const handleRotateEnd = () => {
            document.removeEventListener('mousemove', handleRotate);
            document.removeEventListener('mouseup', handleRotateEnd);
          };
          
          document.addEventListener('mousemove', handleRotate);
          document.addEventListener('mouseup', handleRotateEnd);
        }}
        title="拖拽旋转"
      />
    </>
  );

  const ContextMenu: React.FC<{ sticker: Sticker }> = ({ sticker }) => (
    <div 
      className="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[100]"
      style={{
        left: `${sticker.x}%`,
        top: `${sticker.y - 8}%`,
        transform: 'translate(-50%, -100%)',
        minWidth: '120px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          duplicateSticker(sticker.id);
          setShowContextMenu(null);
        }}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
      >
        📋 复制
      </button>
      <button
        onClick={() => {
          removeSticker(sticker.id);
          setShowContextMenu(null);
        }}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 transition-colors"
      >
        🗑 删除
      </button>
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
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(null);
              setShowControls(showControls === sticker.id ? null : sticker.id);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowControls(null);
              setShowContextMenu(showContextMenu === sticker.id ? null : sticker.id);
            }}
            title={`${sticker.emoji} - 双击显示调整手柄，右键显示菜单`}
          >
            {sticker.emoji}
          </div>
          
          {/* Controls */}
          {showControls === sticker.id && (
            <StickerControls sticker={sticker} />
          )}
          
          {/* Context Menu */}
          {showContextMenu === sticker.id && (
            <ContextMenu sticker={sticker} />
          )}
        </div>
      ))}
      
      {/* Instructions overlay when no stickers */}
      {stickers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black bg-opacity-20 text-white px-6 py-3 rounded-lg text-sm text-center max-w-xs">
            <div className="mb-1">点击右侧贴纸按钮添加小红书贴纸 🏷️</div>
            <div className="text-xs opacity-80">双击贴纸显示调整手柄</div>
            <div className="text-xs opacity-80">🔵 蓝色：拖拽调整大小</div>
            <div className="text-xs opacity-80">🟢 绿色：拖拽旋转角度</div>
            <div className="text-xs opacity-80">右键显示更多选项</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerOverlay;