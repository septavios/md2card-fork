import React, { useState } from "react";
import useSettingsStore, { LayoutMode, AspectRatio, BackgroundType } from "../stores/settingsStore";
import { themeManager } from "../config/themeManager";

// Available fonts
const FONT_OPTIONS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", 
  "Source Sans Pro", "Poppins", "Nunito", "PT Sans", "Ubuntu"
];

// Texture patterns
const TEXTURE_PATTERNS = [
  "none", "dots", "grid", "lines", "diagonal", "crosshatch"
];

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, id }) => (
  <div className="flex items-center justify-between">
    <label 
      htmlFor={id}
      className="text-sm cursor-pointer"
      style={{ color: 'var(--text-primary)' }}
    >
      {label}
    </label>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      className="w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      style={{
        backgroundColor: checked ? 'var(--accent-color)' : 'var(--bg-secondary)'
      }}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`w-5 h-5 rounded-full transform transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      />
    </button>
  </div>
);

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  unit?: string;
  id: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ 
  value, onChange, min, max, step = 1, label, unit = "", id 
}) => (
  <div className="space-y-2">
    <label 
      htmlFor={id}
      className="block text-sm"
      style={{ color: 'var(--text-primary)' }}
    >
      {label}: {value}{unit}
    </label>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
      style={{
        background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${((value - min) / (max - min)) * 100}%, var(--bg-secondary) ${((value - min) / (max - min)) * 100}%, var(--bg-secondary) 100%)`
      }}
    />
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, collapsible = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
        {collapsible && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ 
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-secondary)'
            }}
            aria-expanded={isExpanded}
          >
            {isExpanded ? '收起' : '展开'}
          </button>
        )}
      </div>
      {isExpanded && (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

const SettingsPanel: React.FC = () => {
  const {
    // Existing settings
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
    
    // New settings
    showPageNumbers,
    layoutMode,
    aspectRatio,
    scale,
    selectedFont,
    fontSize,
    lineHeight,
    background,
    setShowPageNumbers,
    setLayoutMode,
    setAspectRatio,
    setScale,
    setSelectedFont,
    setFontSize,
    setLineHeight,
    setBackground,
    
    // User customization management
    resetToThemeDefaults,
  } = useSettingsStore();

  const [expandedBackgroundSection, setExpandedBackgroundSection] = useState<BackgroundType | null>(background.type);

  // 处理主题选择的智能配置优先级系统
  const handleThemeChange = (newTheme: string) => {
    if (newTheme !== selectedTheme) {
      // 切换到不同主题时，重置用户自定义设置并应用新主题
      resetToThemeDefaults();
    }
    setSelectedTheme(newTheme);
  };

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    if (ratio !== "自定义") {
      // Auto-calculate dimensions based on aspect ratio
      const baseWidth = 440;
      switch (ratio) {
        case "16:9":
          setCardWidth(baseWidth);
          setCardHeight(Math.round(baseWidth * 9 / 16));
          break;
        case "4:3":
          setCardWidth(baseWidth);
          setCardHeight(Math.round(baseWidth * 3 / 4));
          break;
        case "1:1":
          setCardWidth(baseWidth);
          setCardHeight(baseWidth);
          break;
      }
    }
  };

  return (
    <div 
      className="fixed right-0 top-0 h-full w-80 shadow-lg border-l overflow-y-auto"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        zIndex: 1000
      }}
      role="complementary"
      aria-label="设置面板"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <h2 
            className="text-lg font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            设置面板
          </h2>
        </div>

        {/* Layout Mode */}
        <Section title="布局模式">
          <div 
            className="flex rounded-lg p-1"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
            role="radiogroup"
            aria-label="选择布局模式"
          >
            {(["长卡片", "短卡片"] as const).map((tab) => (
              <button
                key={tab}
                role="radio"
                aria-checked={viewMode === tab}
                className="flex-1 py-2 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
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

          <div 
            className="flex rounded-lg p-1"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
            role="radiogroup"
            aria-label="选择拆分模式"
          >
            {(["自动拆分", "横线拆分"] as LayoutMode[]).map((mode) => (
              <button
                key={mode}
                role="radio"
                aria-checked={layoutMode === mode}
                className="flex-1 py-2 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  backgroundColor: layoutMode === mode ? 'var(--bg-primary)' : 'transparent',
                  color: layoutMode === mode ? 'var(--accent-color)' : 'var(--text-secondary)'
                }}
                onClick={() => setLayoutMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </Section>

        {/* Size Settings */}
        <Section title="尺寸">
          <div className="space-y-3">
            <div>
              <label 
                htmlFor="aspect-ratio"
                className="block text-sm mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                设计尺寸
              </label>
              <select 
                id="aspect-ratio"
                className="w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)'
                }}
                value={aspectRatio}
                onChange={(e) => handleAspectRatioChange(e.target.value as AspectRatio)}
              >
                <option value="16:9">16:9</option>
                <option value="4:3">4:3</option>
                <option value="1:1">1:1</option>
                <option value="自定义">自定义</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label 
                  htmlFor="card-width"
                  className="block text-sm mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  宽度
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="card-width"
                    type="number"
                    value={cardWidth}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setCardWidth(value);
                      }
                    }}
                    className="w-full text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)'
                    }}
                    disabled={aspectRatio !== "自定义"}
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
                  htmlFor="card-height"
                  className="block text-sm mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  高度
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="card-height"
                    type="number"
                    value={cardHeight}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setCardHeight(value);
                      }
                    }}
                    className="w-full text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      opacity: (viewMode === "长卡片" || aspectRatio !== "自定义") ? 0.5 : 1
                    }}
                    disabled={viewMode === "长卡片" || aspectRatio !== "自定义"}
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

            <RangeSlider
              id="scale-slider"
              label="缩放"
              value={scale}
              onChange={setScale}
              min={50}
              max={150}
              unit="%"
            />
          </div>
        </Section>

        {/* Display Options */}
        <Section title="显示选项">
          <ToggleSwitch
            id="show-page-numbers"
            label="显示页码"
            checked={showPageNumbers}
            onChange={setShowPageNumbers}
          />
          <ToggleSwitch
            id="hide-overflow"
            label="高度超出隐藏"
            checked={hideOverflow}
            onChange={setHideOverflow}
          />
        </Section>

        {/* Font Settings */}
        <Section title="字体选择">
          <div className="space-y-3">
            <div>
              <label 
                htmlFor="font-family"
                className="block text-sm mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                字体
              </label>
              <select 
                id="font-family"
                className="w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)'
                }}
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <RangeSlider
              id="font-size-slider"
              label="字体大小"
              value={fontSize}
              onChange={setFontSize}
              min={10}
              max={24}
              unit="px"
            />

            <RangeSlider
              id="line-height-slider"
              label="行高"
              value={lineHeight}
              onChange={setLineHeight}
              min={1.0}
              max={2.5}
              step={0.1}
            />
          </div>
        </Section>

        {/* Theme Selection */}
        <Section title="主题选择">
          <select
            id="theme-select"
            className="w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)'
            }}
            value={selectedTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            {themeManager.getAllThemes().map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </Section>

        {/* Background Settings */}
        <Section title="自定义背景" collapsible>
          <div className="space-y-4">
            {/* Background Type Selector */}
            <div 
              className="grid grid-cols-2 gap-2 p-1 rounded-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              role="radiogroup"
              aria-label="选择背景类型"
            >
              {(["solid", "gradient", "texture", "image"] as BackgroundType[]).map((type) => (
                <button
                  key={type}
                  role="radio"
                  aria-checked={background.type === type}
                  className="py-2 text-xs rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{
                    backgroundColor: background.type === type ? 'var(--bg-primary)' : 'transparent',
                    color: background.type === type ? 'var(--accent-color)' : 'var(--text-secondary)'
                  }}
                  onClick={() => {
                    setBackground({ type });
                    setExpandedBackgroundSection(type);
                  }}
                >
                  {type === "solid" ? "纯色" : 
                   type === "gradient" ? "渐变" :
                   type === "texture" ? "纹理" : "图片"}
                </button>
              ))}
            </div>

            {/* Background Options */}
            {background.type === "solid" && (
              <div className="space-y-3">
                <div>
                  <label 
                    htmlFor="solid-color"
                    className="block text-sm mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    颜色
                  </label>
                  <input
                    id="solid-color"
                    type="color"
                    value={background.solidColor}
                    onChange={(e) => setBackground({ solidColor: e.target.value })}
                    className="w-full h-10 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
              </div>
            )}

            {background.type === "gradient" && (
              <div className="space-y-3">
                {/* Gradient Presets */}
                <div>
                  <label 
                    className="block text-sm mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    渐变背景
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { start: '#667eea', end: '#764ba2', name: '紫蓝渐变' },
                      { start: '#f093fb', end: '#f5576c', name: '粉红渐变' },
                      { start: '#4facfe', end: '#00f2fe', name: '青蓝渐变' },
                      { start: '#43e97b', end: '#38f9d7', name: '绿青渐变' },
                      { start: '#fa709a', end: '#fee140', name: '粉黄渐变' },
                      { start: '#a8edea', end: '#fed6e3', name: '薄荷粉渐变' },
                      { start: '#ffecd2', end: '#fcb69f', name: '桃橙渐变' },
                      { start: '#ff9a9e', end: '#fecfef', name: '粉色渐变' },
                      { start: '#ff6b6b', end: '#feca57', name: '红黄渐变' },
                      { start: '#48cae4', end: '#0077b6', name: '海蓝渐变' },
                      { start: '#c471f5', end: '#fa71cd', name: '紫粉渐变' },
                      { start: '#74b9ff', end: '#0984e3', name: '天蓝渐变' }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        className="w-full h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                          borderColor: (background.gradientStart === preset.start && background.gradientEnd === preset.end) 
                            ? 'var(--accent-primary)' 
                            : 'transparent'
                        }}
                        onClick={() => setBackground({ 
                          type: 'gradient',
                          gradientStart: preset.start, 
                          gradientEnd: preset.end,
                          gradientDirection: 135
                        })}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Gradient Controls */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label 
                      htmlFor="gradient-start"
                      className="block text-sm mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      起始色
                    </label>
                    <input
                      id="gradient-start"
                      type="color"
                      value={background.gradientStart}
                      onChange={(e) => setBackground({ gradientStart: e.target.value })}
                      className="w-full h-10 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="gradient-end"
                      className="block text-sm mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      结束色
                    </label>
                    <input
                      id="gradient-end"
                      type="color"
                      value={background.gradientEnd}
                      onChange={(e) => setBackground({ gradientEnd: e.target.value })}
                      className="w-full h-10 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                  </div>
                </div>
                <RangeSlider
                  id="gradient-direction-slider"
                  label="方向"
                  value={background.gradientDirection}
                  onChange={(direction) => setBackground({ gradientDirection: direction })}
                  min={0}
                  max={360}
                  unit="°"
                />
              </div>
            )}

            {background.type === "texture" && (
              <div>
                <label 
                  htmlFor="texture-pattern"
                  className="block text-sm mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  纹理图案
                </label>
                <select 
                  id="texture-pattern"
                  className="w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                  value={background.texturePattern}
                  onChange={(e) => setBackground({ texturePattern: e.target.value })}
                >
                  {TEXTURE_PATTERNS.map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {pattern === "none" ? "无" :
                       pattern === "dots" ? "圆点" :
                       pattern === "grid" ? "网格" :
                       pattern === "lines" ? "线条" :
                       pattern === "diagonal" ? "斜线" :
                       pattern === "crosshatch" ? "交叉线" : pattern}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {background.type === "image" && (
              <div>
                <label 
                  htmlFor="image-url"
                  className="block text-sm mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  图片URL
                </label>
                <input
                  id="image-url"
                  type="url"
                  value={background.imageUrl}
                  onChange={(e) => setBackground({ imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                />
              </div>
            )}

            {/* Opacity Control */}
            <RangeSlider
              id="background-opacity-slider"
              label="透明度"
              value={background.opacity}
              onChange={(opacity) => setBackground({ opacity })}
              min={0}
              max={100}
              unit="%"
            />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default SettingsPanel;
