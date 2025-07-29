import React, { useState, useCallback } from 'react';
import useStickerStore, { XIAOHONGSHU_STICKERS } from '../stores/stickerStore';

interface StickerPickerProps {
  onClose: () => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ onClose }) => {
  const { addSticker } = useStickerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 分类贴纸
  const categories = {
    all: { name: '全部', stickers: XIAOHONGSHU_STICKERS },
    faces: { name: '表情', stickers: XIAOHONGSHU_STICKERS.slice(0, 20) },
    hands: { name: '手势', stickers: XIAOHONGSHU_STICKERS.slice(20, 40) },
    objects: { name: '物品', stickers: XIAOHONGSHU_STICKERS.slice(40, 60) },
    food: { name: '食物', stickers: XIAOHONGSHU_STICKERS.slice(60, 90) },
    activities: { name: '活动', stickers: XIAOHONGSHU_STICKERS.slice(90, 110) },
    hearts: { name: '爱心', stickers: XIAOHONGSHU_STICKERS.slice(110, 130) },
    nature: { name: '自然', stickers: XIAOHONGSHU_STICKERS.slice(130, 150) },
  };

  const handleStickerClick = useCallback((emoji: string) => {
    // 在卡片中心位置添加贴纸，稍微随机化位置避免重叠
    const x = 45 + Math.random() * 10; // 45-55%
    const y = 45 + Math.random() * 10; // 45-55%
    addSticker(emoji, x, y);
    onClose();
  }, [addSticker, onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const filteredStickers = categories[selectedCategory as keyof typeof categories].stickers.filter(
    emoji => emoji.includes(searchTerm) || searchTerm === ''
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-96 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">小红书贴纸</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="关闭"
            >
              ✕
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="搜索贴纸..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              autoFocus
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Categories */}
        <div className="p-2 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-wrap gap-1">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === key
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-pink-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sticker Grid */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {filteredStickers.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onClick={() => handleStickerClick(emoji)}
                className="w-10 h-10 text-2xl hover:bg-pink-100 rounded-lg transition-colors flex items-center justify-center hover:scale-110 transform duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400"
                title={`添加 ${emoji} 贴纸`}
                aria-label={`添加 ${emoji} 贴纸`}
              >
                {emoji}
              </button>
            ))}
          </div>
          
          {filteredStickers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>没有找到相关贴纸</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                重置搜索
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">点击贴纸添加到卡片中 • 按 ESC 键关闭</p>
        </div>
      </div>
    </div>
  );
};

export default StickerPicker;