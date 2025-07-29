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

  const StickerControls: React.FC<{ sticker: Sticker }> = ({ sticker }) => {
    if (!containerRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    // Make the bounding box larger to properly encompass the sticker
    const stickerSize = 2 * sticker.size; // Base size in rem
    const padding = 20; // Extra padding around the sticker
    const stickerWidth = (stickerSize / 100) * rect.width + padding;
    const stickerHeight = (stickerSize / 100) * rect.height + padding;
    
    // Calculate corner positions relative to sticker center
    const halfWidth = stickerWidth / 2;
    const halfHeight = stickerHeight / 2;
    
    // Corner positions (before rotation)
    const corners = [
      { x: -halfWidth, y: -halfHeight, cursor: 'nw-resize' }, // Top-left
      { x: halfWidth, y: -halfHeight, cursor: 'ne-resize' },  // Top-right
      { x: halfWidth, y: halfHeight, cursor: 'se-resize' },   // Bottom-right
      { x: -halfWidth, y: halfHeight, cursor: 'sw-resize' },  // Bottom-left
    ];
    
    // Rotation handle position (above top center)
    const rotationHandleDistance = halfHeight + 40;
    const rotationHandle = { x: 0, y: -rotationHandleDistance };
    
    // Apply rotation to all points
    const rad = (sticker.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    const rotatePoint = (x: number, y: number) => ({
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    });
    
    const rotatedCorners = corners.map(corner => rotatePoint(corner.x, corner.y));
    const rotatedRotationHandle = rotatePoint(rotationHandle.x, rotationHandle.y);
    
    // Convert to screen coordinates
    const centerX = (sticker.x / 100) * rect.width;
    const centerY = (sticker.y / 100) * rect.height;
    
    const toScreenCoords = (point: { x: number; y: number }) => ({
      x: ((centerX + point.x) / rect.width) * 100,
      y: ((centerY + point.y) / rect.height) * 100,
    });
    
    const screenCorners = rotatedCorners.map(toScreenCoords);
    const screenRotationHandle = toScreenCoords(rotatedRotationHandle);
    
    // Create polygon path for outline
    const polygonPath = screenCorners.map(corner => `${corner.x}%,${corner.y}%`).join(' ');
    
    const handleCornerDrag = (cornerIndex: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      const startSize = sticker.size;
      
      const handleResize = (e: MouseEvent) => {
        const deltaX = e.clientX - startMouseX;
        const deltaY = e.clientY - startMouseY;
        
        // Calculate distance from start point for more natural resizing
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Determine direction based on corner and mouse movement
        let direction = 1;
        switch (cornerIndex) {
          case 0: // Top-left
            direction = (deltaX < 0 || deltaY < 0) ? 1 : -1;
            break;
          case 1: // Top-right
            direction = (deltaX > 0 || deltaY < 0) ? 1 : -1;
            break;
          case 2: // Bottom-right
            direction = (deltaX > 0 || deltaY > 0) ? 1 : -1;
            break;
          case 3: // Bottom-left
            direction = (deltaX < 0 || deltaY > 0) ? 1 : -1;
            break;
        }
        
        // Adjust sensitivity for smooth resizing
        const sensitivity = 200;
        const sizeDelta = (distance * direction) / sensitivity;
        
        const newSize = Math.max(0.3, Math.min(3, startSize + sizeDelta));
        updateSticker(sticker.id, { size: newSize });
      };
      
      const handleResizeEnd = () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.cursor = 'default';
      };
      
      document.body.style.cursor = corners[cornerIndex].cursor;
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    };
    
    const handleRotationDrag = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      const rect = containerRef.current!.getBoundingClientRect();
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
        document.body.style.cursor = 'default';
      };
      
      document.body.style.cursor = 'grabbing';
      document.addEventListener('mousemove', handleRotate);
      document.addEventListener('mouseup', handleRotateEnd);
    };
    
    return (
       <>
         {/* Purple polygon outline - more prominent */}
         <svg
           className="absolute inset-0 pointer-events-none"
           style={{ zIndex: sticker.zIndex + 15 }}
           width="100%"
           height="100%"
         >
           <polygon
             points={polygonPath}
             fill="rgba(147, 51, 234, 0.1)"
             stroke="rgba(147, 51, 234, 0.8)"
             strokeWidth="3"
             strokeDasharray="6,3"
           />
         </svg>
         
         {/* Corner resize handles - larger and more visible */}
         {screenCorners.map((corner, index) => (
           <div
             key={`corner-${index}`}
             className="absolute w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg hover:bg-purple-600 hover:scale-110 transition-all duration-200"
             style={{
               left: `${corner.x}%`,
               top: `${corner.y}%`,
               transform: 'translate(-50%, -50%)',
               zIndex: sticker.zIndex + 20,
               cursor: corners[index].cursor,
             }}
             onMouseDown={handleCornerDrag(index)}
             title="拖拽调整大小"
           />
         ))}
         
         {/* Rotation handle - larger and more prominent */}
         <div
           className="absolute w-5 h-5 bg-purple-500 rounded-full border-2 border-white shadow-lg hover:bg-purple-600 hover:scale-110 transition-all duration-200"
           style={{
             left: `${screenRotationHandle.x}%`,
             top: `${screenRotationHandle.y}%`,
             transform: 'translate(-50%, -50%)',
             zIndex: sticker.zIndex + 20,
             cursor: 'grab',
           }}
           onMouseDown={handleRotationDrag}
           title="拖拽旋转 ↻"
         >
           <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
             ↻
           </div>
         </div>
         
         {/* Connection line from sticker to rotation handle - more visible */}
         <svg
           className="absolute inset-0 pointer-events-none"
           style={{ zIndex: sticker.zIndex + 15 }}
           width="100%"
           height="100%"
         >
           <line
             x1={`${sticker.x}%`}
             y1={`${sticker.y}%`}
             x2={`${screenRotationHandle.x}%`}
             y2={`${screenRotationHandle.y}%`}
             stroke="rgba(147, 51, 234, 0.6)"
             strokeWidth="2"
             strokeDasharray="3,3"
           />
         </svg>
       </>
     );
  };

  const ContextMenu: React.FC<{ sticker: Sticker }> = ({ sticker }) => {
    // Calculate better positioning to avoid going off-screen
    const menuX = Math.max(10, Math.min(90, sticker.x));
    const menuY = sticker.y > 20 ? sticker.y - 8 : sticker.y + 8;
    
    return (
      <div 
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-1"
        style={{
          left: `${menuX}%`,
          top: `${menuY}%`,
          transform: sticker.y > 20 ? 'translate(-50%, -100%)' : 'translate(-50%, 0%)',
          minWidth: '120px',
          zIndex: 9999, // Use a very high z-index
          pointerEvents: 'auto', // Ensure pointer events work
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()} // Prevent drag interference
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Duplicating sticker:', sticker.id); // Debug log
            duplicateSticker(sticker.id);
            setShowContextMenu(null);
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
        >
          📋 复制
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Deleting sticker:', sticker.id); // Debug log
            removeSticker(sticker.id);
            setShowContextMenu(null);
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 transition-colors"
        >
          🗑 删除
        </button>
      </div>
    );
  };

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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(null);
              setShowControls(sticker.id); // Show controls on single click
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowControls(null);
              setShowContextMenu(showContextMenu === sticker.id ? null : sticker.id);
            }}
            title={`${sticker.emoji} - 点击显示紫色操作框，右键显示菜单`}
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
            <div className="text-xs opacity-80">点击贴纸显示紫色操作框</div>
            <div className="text-xs opacity-80">🟣 紫色边框：选中状态</div>
            <div className="text-xs opacity-80">🟣 角落圆点：拖拽调整大小</div>
            <div className="text-xs opacity-80">🟣 顶部圆点：拖拽旋转角度 ↻</div>
            <div className="text-xs opacity-80">右键显示更多选项</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerOverlay;