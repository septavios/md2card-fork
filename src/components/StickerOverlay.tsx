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
    <>
      {/* Resize handle - bottom right corner */}
      <div
        className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-nw-resize flex items-center justify-center text-white text-xs font-bold hover:bg-blue-600 transition-colors"
        style={{
          left: `${sticker.x + 2}%`,
          top: `${sticker.y + 2}%`,
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
            const delta = (deltaX + deltaY) / 200; // Sensitivity adjustment
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
      >
        ⤡
      </div>
      
      {/* Rotation handle - top right corner */}
      <div
        className="absolute w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg cursor-grab flex items-center justify-center text-white text-xs font-bold hover:bg-green-600 transition-colors"
        style={{
          left: `${sticker.x + 2}%`,
          top: `${sticker.y - 2}%`,
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
      >
        ↻
      </div>
      
      {/* Delete handle - top left corner */}
      <div
        className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-white text-xs font-bold hover:bg-red-600 transition-colors"
        style={{
          left: `${sticker.x - 2}%`,
          top: `${sticker.y - 2}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: sticker.zIndex + 20,
        }}
        onClick={(e) => {
          e.stopPropagation();
          removeSticker(sticker.id);
          setShowControls(null);
        }}
        title="删除贴纸"
      >
        ×
      </div>
      
      {/* Duplicate handle - bottom left corner */}
      <div
        className="absolute w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-white text-xs font-bold hover:bg-yellow-600 transition-colors"
        style={{
          left: `${sticker.x - 2}%`,
          top: `${sticker.y + 2}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: sticker.zIndex + 20,
        }}
        onClick={(e) => {
          e.stopPropagation();
          duplicateSticker(sticker.id);
          setShowControls(null);
        }}
        title="复制贴纸"
      >
        📋
      </div>
    </>
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
            title={`${sticker.emoji} - 双击或右键显示操作手柄`}
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
            <div className="text-xs opacity-80">双击或右键选择贴纸显示操作手柄</div>
            <div className="text-xs opacity-80">🔵 蓝色手柄：拖拽调整大小</div>
            <div className="text-xs opacity-80">🟢 绿色手柄：拖拽旋转角度</div>
            <div className="text-xs opacity-80">🔴 红色手柄：删除贴纸</div>
            <div className="text-xs opacity-80">🟡 黄色手柄：复制贴纸</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerOverlay;