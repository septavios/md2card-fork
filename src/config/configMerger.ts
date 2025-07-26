import { ThemeConfig, UserConfig, FinalConfig } from './themeConfig';

/**
 * 深度合并两个对象
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || ({} as any), source[key] as any);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  
  return result;
}

/**
 * 合并主题配置和用户配置，生成最终配置
 * @param themeConfig 主题配置
 * @param userConfig 用户配置
 * @param forceThemeOverride 是否强制使用主题配置覆盖用户配置
 * @returns 合并后的最终配置
 */
export function getFinalConfig(themeConfig: ThemeConfig, userConfig: UserConfig, forceThemeOverride: boolean = false): FinalConfig {
  // 创建基础配置副本
  let finalConfig: FinalConfig = { ...themeConfig };
  
  if (forceThemeOverride) {
    // 强制主题覆盖模式：只保留主题配置，忽略用户配置
    return finalConfig;
  }
  
  // 正常模式：用户配置覆盖主题配置
  // 合并字体配置
  if (userConfig.font) {
    finalConfig.font = deepMerge(finalConfig.font, userConfig.font);
  }
  
  // 合并颜色配置
  if (userConfig.colors) {
    finalConfig.colors = deepMerge(finalConfig.colors, userConfig.colors);
  }
  
  // 合并间距配置
  if (userConfig.spacing) {
    finalConfig.spacing = deepMerge(finalConfig.spacing, userConfig.spacing);
  }
  
  // 合并背景配置 - 用户背景设置完全覆盖主题背景设置
  if (userConfig.background) {
    // 先使用主题背景作为基础，然后用用户配置完全覆盖
    finalConfig.background = { ...finalConfig.background, ...userConfig.background };
  }
  
  // 合并阴影配置
  if (userConfig.shadow) {
    finalConfig.shadow = deepMerge(finalConfig.shadow, userConfig.shadow);
  }
  
  // 合并布局配置
  if (userConfig.layout) {
    finalConfig.layout = deepMerge(finalConfig.layout, userConfig.layout);
  }
  
  // 合并自定义样式
  if (userConfig.customStyles) {
    finalConfig.customStyles = deepMerge(finalConfig.customStyles || {}, userConfig.customStyles);
  }
  
  return finalConfig;
}

/**
 * 将配置转换为CSS变量对象
 * @param config 最终配置
 * @returns CSS变量对象
 */
export function configToCSSVariables(config: FinalConfig): Record<string, any> {
  const cssVars: Record<string, any> = {};
  
  // 字体变量
  cssVars['--card-font-family'] = config.font.family;
  cssVars['--card-font-size'] = `${config.font.size}px`;
  cssVars['--card-line-height'] = config.font.lineHeight;
  if (config.font.weight) {
    cssVars['--card-font-weight'] = config.font.weight;
  }
  
  // 颜色变量
  cssVars['--card-color-primary'] = config.colors.primary;
  cssVars['--card-color-secondary'] = config.colors.secondary;
  cssVars['--card-color-accent'] = config.colors.accent;
  cssVars['--card-color-text'] = config.colors.text;
  cssVars['--card-color-background'] = config.colors.background;
  cssVars['--card-color-border'] = config.colors.border;
  
  // 间距变量
  cssVars['--card-padding'] = `${config.spacing.padding}px`;
  cssVars['--card-margin'] = `${config.spacing.margin}px`;
  cssVars['--card-border-radius'] = `${config.spacing.borderRadius}px`;
  
  // 背景变量
  const { background } = config;
  let backgroundValue = '';
  
  console.log('Processing background:', background);
  
  switch (background.type) {
    case 'solid':
      backgroundValue = background.solidColor || config.colors.background;
      break;
    case 'gradient':
      backgroundValue = `linear-gradient(${background.gradientDirection || 45}deg, ${background.gradientStart || config.colors.primary}, ${background.gradientEnd || config.colors.secondary})`;
      console.log('Generated gradient:', backgroundValue);
      break;
    case 'texture':
      // 纹理图案
      const patterns = {
        'none': 'transparent',
        'dots': `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
        'grid': `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
        'lines': `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 11px)`,
        'diagonal': `repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 10px, transparent 10px, transparent 20px)`,
        'crosshatch': `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 6px), repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 6px)`
      };
      backgroundValue = patterns[background.texturePattern as keyof typeof patterns] || config.colors.background;
      break;
    case 'image':
      backgroundValue = background.imageUrl ? `url(${background.imageUrl})` : config.colors.background;
      cssVars['--card-background-size'] = 'cover';
      cssVars['--card-background-position'] = 'center';
      cssVars['--card-background-repeat'] = 'no-repeat';
      break;
  }
  
  cssVars['--card-background'] = backgroundValue;
  console.log('Final CSS background:', backgroundValue);
  cssVars['--card-opacity'] = background.opacity / 100;
  
  // 阴影变量
  if (config.shadow.enabled) {
    cssVars['--card-shadow'] = `${config.shadow.offsetX}px ${config.shadow.offsetY}px ${config.shadow.blur}px ${config.shadow.spread}px ${config.shadow.color}`;
  } else {
    cssVars['--card-shadow'] = 'none';
  }
  
  return cssVars;
}

/**
 * 从旧的设置存储格式转换为新的用户配置格式
 * @param oldSettings 旧的设置对象
 * @returns 新的用户配置对象
 */
export function migrateFromOldSettings(oldSettings: any): UserConfig {
  return {
    selectedTheme: oldSettings.selectedTheme || '默认',
    font: {
      family: oldSettings.selectedFont,
      size: oldSettings.fontSize,
      lineHeight: oldSettings.lineHeight,
    },
    background: oldSettings.background,
    layout: {
      width: oldSettings.cardWidth,
      height: oldSettings.cardHeight,
      viewMode: oldSettings.viewMode,
      hideOverflow: oldSettings.hideOverflow,
      showPageNumbers: oldSettings.showPageNumbers,
      layoutMode: oldSettings.layoutMode,
      scale: oldSettings.scale,
    },
  };
}