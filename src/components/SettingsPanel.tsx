import React from "react";
import useSettingsStore from "../stores/settingsStore";
import { configNames } from "../themeConfigs";

const SettingsPanel: React.FC = () => {
  const {
    cardWidth,
    cardHeight,
    viewMode,
    hideOverflow,
    selectedTheme,
    setCardWidth,
    setCardHeight,
    setViewMode,
    setHideOverflow,
    setSelectedTheme,
  } = useSettingsStore();

  return (
    <div 
      className="rounded-lg shadow-sm p-6 m-4 w-[300px]"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex flex-col gap-6">
        {/* 分页按钮组 */}
        <div 
          className="flex rounded-lg p-1"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          {["长卡片", "短卡片"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-1.5 text-sm rounded-md transition-colors`}
              style={{
                backgroundColor: viewMode === tab ? 'var(--bg-primary)' : 'transparent',
                color: viewMode === tab ? 'var(--accent-color)' : 'var(--text-secondary)'
              }}
              onClick={() => setViewMode(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 尺寸设置 */}
        <div className="space-y-4">
          <h4 
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            尺寸
          </h4>
          <div className="flex gap-4">
            <div className="flex-1">
              <label 
                className="block text-sm mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                宽度
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${cardWidth}`}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setCardWidth(value);
                    }
                  }}
                  className="w-12 text-sm border rounded px-1 py-0.5"
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                />
                <span 
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  px
                </span>
              </div>
            </div>
            <div className="flex-1">
              <label 
                className="block text-sm mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                高度
              </label>
              <div className="flex items-center gap-2">
                <input
                  disabled={viewMode == "长卡片"}
                  type="text"
                  value={`${cardHeight}`}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setCardHeight(value);
                    }
                  }}
                  className="w-12 text-sm border rounded px-1 py-0.5"
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    opacity: viewMode == "长卡片" ? 0.5 : 1
                  }}
                />
                <span 
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  px
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 高度超出隐藏开关 */}
        <div className="flex items-center justify-between">
          <span 
            className="text-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            高度超出隐藏
          </span>
          <button
            className="w-12 h-6 rounded-full transition-colors"
            style={{
              backgroundColor: hideOverflow ? 'var(--accent-color)' : 'var(--bg-secondary)'
            }}
            onClick={() => setHideOverflow(!hideOverflow)}
          >
            <div
              className={`w-5 h-5 rounded-full transform transition-transform ${hideOverflow ? "translate-x-6" : "translate-x-1"}`}
              style={{ backgroundColor: 'var(--bg-primary)' }}
            />
          </button>
        </div>

        {/* 选择设计尺寸 */}
        <div>
          <label 
            className="block text-sm mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            选择设计尺寸
          </label>
          <select 
            className="w-full text-sm border rounded-lg p-2"
            style={{
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)'
            }}
          >
            <option>16:9</option>
            <option>4:3</option>
            <option>1:1</option>
          </select>
        </div>

        {/* 主题选择 */}
        <div>
          <label 
            className="block text-sm mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            选择主题
          </label>
          <select
            className="w-full text-sm border rounded-lg p-2"
            style={{
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)'
            }}
            value={selectedTheme}
            onChange={(e) =>
              // @ts-ignore
              setSelectedTheme(e.target.value as keyof typeof markedThemes)
            }
          >
            {configNames.map((themeName) => (
              <option key={themeName} value={themeName}>
                {themeName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
