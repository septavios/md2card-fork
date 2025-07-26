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
 * 计算颜色的亮度值 (0-255)
 * @param color 颜色值 (hex格式)
 * @returns 亮度值
 */
function getColorBrightness(color: string): number {
  // 移除 # 符号
  const hex = color.replace('#', '');
  
  // 解析RGB值
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // 使用相对亮度公式
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * 根据背景颜色智能选择文本颜色
 * @param backgroundColor 背景颜色
 * @param originalTextColor 原始文本颜色
 * @returns 优化后的文本颜色
 */
function getOptimalTextColor(backgroundColor: string, originalTextColor: string): string {
  // 如果背景不是纯色，返回原始文本颜色
  if (!backgroundColor || !backgroundColor.startsWith('#')) {
    return originalTextColor;
  }
  
  const brightness = getColorBrightness(backgroundColor);
  
  // 如果背景很亮 (亮度 > 128)，使用深色文字
  // 如果背景很暗 (亮度 <= 128)，使用浅色文字
  if (brightness > 128) {
    return '#2c3e50'; // 深色文字
  } else {
    return '#ffffff'; // 浅色文字
  }
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
  
  // 背景变量
  const { background } = config;
  
  // 颜色变量 - 智能文本颜色调整
  let finalTextColor = config.colors.text;
  
  // 根据背景类型智能调整文本颜色
  if (background.type === 'solid' && background.solidColor) {
    finalTextColor = getOptimalTextColor(background.solidColor, config.colors.text);
  }
  
  cssVars['--card-color-primary'] = config.colors.primary;
  cssVars['--card-color-secondary'] = config.colors.secondary;
  cssVars['--card-color-accent'] = config.colors.accent;
  cssVars['--card-color-text'] = finalTextColor;
  cssVars['--card-color-background'] = config.colors.background;
  cssVars['--card-color-border'] = config.colors.border;
  
  // 间距变量
  cssVars['--card-padding'] = `${config.spacing.padding}px`;
  cssVars['--card-margin'] = `${config.spacing.margin}px`;
  cssVars['--card-border-radius'] = `${config.spacing.borderRadius}px`;
  
  // 背景处理
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
      // 新的纹理预设
      const texturePresets = {
        // 自然风景纹理
        'nature-field': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="field" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB"/>
                <stop offset="30%" style="stop-color:#98FB98"/>
                <stop offset="70%" style="stop-color:#F0E68C"/>
                <stop offset="100%" style="stop-color:#DEB887"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#field)"/>
            <circle cx="20" cy="30" r="2" fill="#FF6347" opacity="0.7"/>
            <circle cx="80" cy="20" r="1.5" fill="#FF4500" opacity="0.6"/>
            <circle cx="60" cy="40" r="1" fill="#FF0000" opacity="0.8"/>
          </svg>
        `) + "')",
        'nature-tree': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="tree" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#228B22"/>
                <stop offset="50%" style="stop-color:#32CD32"/>
                <stop offset="100%" style="stop-color:#006400"/>
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#tree)"/>
            <rect x="45" y="60" width="10" height="40" fill="#8B4513"/>
            <circle cx="50" cy="40" r="25" fill="#228B22" opacity="0.8"/>
            <circle cx="40" cy="35" r="15" fill="#32CD32" opacity="0.6"/>
            <circle cx="60" cy="35" r="15" fill="#32CD32" opacity="0.6"/>
          </svg>
        `) + "')",
        'nature-mountain': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="mountain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB"/>
                <stop offset="40%" style="stop-color:#D2B48C"/>
                <stop offset="80%" style="stop-color:#8B7355"/>
                <stop offset="100%" style="stop-color:#696969"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#mountain)"/>
            <polygon points="0,100 30,40 60,100" fill="#8B7355" opacity="0.8"/>
            <polygon points="40,100 70,30 100,100" fill="#A0522D" opacity="0.7"/>
            <polygon points="60,100 85,50 100,100" fill="#696969" opacity="0.6"/>
          </svg>
        `) + "')",
        'landscape-sky': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="sky" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB"/>
                <stop offset="50%" style="stop-color:#B0E0E6"/>
                <stop offset="100%" style="stop-color:#F0F8FF"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#sky)"/>
            <circle cx="20" cy="20" r="8" fill="white" opacity="0.8"/>
            <circle cx="70" cy="30" r="12" fill="white" opacity="0.6"/>
            <circle cx="50" cy="15" r="6" fill="white" opacity="0.9"/>
          </svg>
        `) + "')",
        'nature-waterfall': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="waterfall" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#228B22"/>
                <stop offset="30%" style="stop-color:#32CD32"/>
                <stop offset="60%" style="stop-color:#87CEEB"/>
                <stop offset="100%" style="stop-color:#4682B4"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#waterfall)"/>
            <rect x="40" y="0" width="20" height="100" fill="#87CEEB" opacity="0.8"/>
            <rect x="45" y="0" width="10" height="100" fill="white" opacity="0.6"/>
          </svg>
        `) + "')",
        'landscape-desert': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="desert" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#F4A460"/>
                <stop offset="50%" style="stop-color:#DEB887"/>
                <stop offset="100%" style="stop-color:#D2B48C"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#desert)"/>
            <ellipse cx="20" cy="80" rx="15" ry="8" fill="#CD853F" opacity="0.6"/>
            <ellipse cx="70" cy="70" rx="20" ry="10" fill="#D2B48C" opacity="0.7"/>
            <ellipse cx="50" cy="90" rx="25" ry="12" fill="#DEB887" opacity="0.5"/>
          </svg>
        `) + "')",
        'nature-palm': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="palm" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#32CD32"/>
                <stop offset="70%" style="stop-color:#228B22"/>
                <stop offset="100%" style="stop-color:#006400"/>
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#palm)"/>
            <rect x="45" y="40" width="10" height="60" fill="#8B4513"/>
            <ellipse cx="50" cy="30" rx="30" ry="8" fill="#228B22" transform="rotate(0 50 30)"/>
            <ellipse cx="50" cy="30" rx="30" ry="8" fill="#32CD32" transform="rotate(45 50 30)"/>
            <ellipse cx="50" cy="30" rx="30" ry="8" fill="#228B22" transform="rotate(90 50 30)"/>
            <ellipse cx="50" cy="30" rx="30" ry="8" fill="#32CD32" transform="rotate(135 50 30)"/>
          </svg>
        `) + "')",
        'landscape-lake': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="lake" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB"/>
                <stop offset="30%" style="stop-color:#4682B4"/>
                <stop offset="70%" style="stop-color:#1E90FF"/>
                <stop offset="100%" style="stop-color:#0000CD"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#lake)"/>
            <ellipse cx="50" cy="70" rx="40" ry="20" fill="#4682B4" opacity="0.8"/>
            <ellipse cx="50" cy="70" rx="30" ry="15" fill="#1E90FF" opacity="0.6"/>
            <rect x="0" y="0" width="100" height="40" fill="#228B22" opacity="0.7"/>
          </svg>
        `) + "')",
        'landscape-cliff': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="cliff" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#696969"/>
                <stop offset="50%" style="stop-color:#A0522D"/>
                <stop offset="100%" style="stop-color:#8B4513"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#cliff)"/>
            <polygon points="0,0 100,0 80,100 0,100" fill="#696969" opacity="0.8"/>
            <polygon points="20,20 90,30 70,80 10,70" fill="#A0522D" opacity="0.6"/>
          </svg>
        `) + "')",
        'nature-forest': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="forest" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#006400"/>
                <stop offset="50%" style="stop-color:#228B22"/>
                <stop offset="100%" style="stop-color:#32CD32"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#forest)"/>
            <circle cx="20" cy="60" r="15" fill="#228B22" opacity="0.8"/>
            <circle cx="50" cy="40" r="20" fill="#32CD32" opacity="0.7"/>
            <circle cx="80" cy="70" r="18" fill="#228B22" opacity="0.6"/>
            <rect x="18" y="70" width="4" height="30" fill="#8B4513"/>
            <rect x="48" y="55" width="4" height="45" fill="#8B4513"/>
            <rect x="78" y="80" width="4" height="20" fill="#8B4513"/>
          </svg>
        `) + "')",
        'landscape-ocean': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB"/>
                <stop offset="30%" style="stop-color:#4682B4"/>
                <stop offset="70%" style="stop-color:#1E90FF"/>
                <stop offset="100%" style="stop-color:#0000CD"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#ocean)"/>
            <path d="M0,60 Q25,50 50,60 T100,60 L100,100 L0,100 Z" fill="#4682B4" opacity="0.7"/>
            <path d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z" fill="#1E90FF" opacity="0.5"/>
            <ellipse cx="80" cy="20" rx="15" ry="8" fill="white" opacity="0.8"/>
          </svg>
        `) + "')",
        'landscape-sunset': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="sunset" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF6347"/>
                <stop offset="30%" style="stop-color:#FF4500"/>
                <stop offset="60%" style="stop-color:#FFA500"/>
                <stop offset="100%" style="stop-color:#FFD700"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#sunset)"/>
            <circle cx="70" cy="30" r="15" fill="#FFD700" opacity="0.9"/>
            <rect x="0" y="70" width="100" height="30" fill="#8B4513" opacity="0.6"/>
            <polygon points="20,70 40,50 60,70" fill="#654321" opacity="0.8"/>
          </svg>
        `) + "')",
        'nature-hills': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="hills" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#9ACD32"/>
                <stop offset="50%" style="stop-color:#32CD32"/>
                <stop offset="100%" style="stop-color:#228B22"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#hills)"/>
            <path d="M0,100 Q25,60 50,80 T100,70 L100,100 Z" fill="#228B22" opacity="0.8"/>
            <path d="M0,100 Q30,70 60,85 T100,75 L100,100 Z" fill="#32CD32" opacity="0.6"/>
          </svg>
        `) + "')",
        'nature-meadow': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="meadow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ADFF2F"/>
                <stop offset="50%" style="stop-color:#32CD32"/>
                <stop offset="100%" style="stop-color:#228B22"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#meadow)"/>
            <circle cx="15" cy="20" r="3" fill="#FFD700" opacity="0.8"/>
            <circle cx="35" cy="30" r="2" fill="#FF69B4" opacity="0.7"/>
            <circle cx="65" cy="25" r="2.5" fill="#FF1493" opacity="0.6"/>
            <circle cx="85" cy="35" r="2" fill="#FFD700" opacity="0.9"/>
            <circle cx="25" cy="60" r="2" fill="#FF69B4" opacity="0.8"/>
            <circle cx="75" cy="70" r="3" fill="#FF1493" opacity="0.7"/>
          </svg>
        `) + "')",
        'landscape-river': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="river" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#228B22"/>
                <stop offset="40%" style="stop-color:#4682B4"/>
                <stop offset="60%" style="stop-color:#1E90FF"/>
                <stop offset="100%" style="stop-color:#228B22"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#river)"/>
            <path d="M0,40 Q30,30 50,50 Q70,70 100,60 L100,80 Q70,90 50,70 Q30,50 0,60 Z" fill="#4682B4" opacity="0.8"/>
            <path d="M0,45 Q30,35 50,55 Q70,75 100,65 L100,75 Q70,85 50,65 Q30,45 0,55 Z" fill="#1E90FF" opacity="0.6"/>
          </svg>
        `) + "')",
        // 图案纹理
        'pattern-geometric': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="triangles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,2 18,16 2,16" fill="#E0E0E0"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="white"/>
            <rect width="100" height="100" fill="url(#triangles)"/>
          </svg>
        `) + "')",
        'pattern-colorful': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="colorblocks" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="5" height="5" fill="#FF6B6B"/>
                <rect x="5" y="0" width="5" height="5" fill="#4ECDC4"/>
                <rect x="0" y="5" width="5" height="5" fill="#45B7D1"/>
                <rect x="5" y="5" width="5" height="5" fill="#FFA07A"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#colorblocks)"/>
          </svg>
        `) + "')",
        'pattern-paper': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#F8F8F8"/>
            <defs>
              <filter id="noise">
                <feTurbulence baseFrequency="0.9" numOctaves="1" result="noise"/>
                <feColorMatrix in="noise" type="saturate" values="0"/>
                <feComponentTransfer>
                  <feFuncA type="discrete" tableValues="0 0.1 0 0.2 0"/>
                </feComponentTransfer>
              </filter>
            </defs>
            <rect width="100" height="100" filter="url(#noise)" opacity="0.3"/>
          </svg>
        `) + "')",
        'pattern-diamond': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="diamonds" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,0 20,10 10,20 0,10" fill="none" stroke="#B0B0B0" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="#F0F0F0"/>
            <rect width="100" height="100" fill="url(#diamonds)"/>
          </svg>
        `) + "')",
        'pattern-hexagon': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="hexagons" x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse">
                <polygon points="15,2 25,8 25,18 15,24 5,18 5,8" fill="none" stroke="#8E8E93" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="#F2F2F7"/>
            <rect width="100" height="100" fill="url(#hexagons)"/>
          </svg>
        `) + "')",
        'pattern-wave': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M0,10 Q10,0 20,10 T40,10" fill="none" stroke="#333" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="white"/>
            <rect width="100" height="100" fill="url(#waves)"/>
          </svg>
        `) + "')",
        'pattern-ornate': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="ornate" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                <circle cx="12.5" cy="12.5" r="8" fill="none" stroke="#DAA520" stroke-width="1"/>
                <circle cx="12.5" cy="12.5" r="4" fill="#DAA520" opacity="0.3"/>
                <path d="M12.5,4.5 L12.5,20.5 M4.5,12.5 L20.5,12.5" stroke="#DAA520" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="#FFF8DC"/>
            <rect width="100" height="100" fill="url(#ornate)"/>
          </svg>
        `) + "')",
        'pattern-gradient': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF6B9D"/>
                <stop offset="25%" style="stop-color:#C44569"/>
                <stop offset="50%" style="stop-color:#F8B500"/>
                <stop offset="75%" style="stop-color:#6C5CE7"/>
                <stop offset="100%" style="stop-color:#A29BFE"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#rainbow)"/>
            <rect width="100" height="100" fill="url(#rainbow)" opacity="0.7"/>
          </svg>
        `) + "')",
        'pattern-nature': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="leaves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <ellipse cx="10" cy="10" rx="6" ry="3" fill="#228B22" opacity="0.6" transform="rotate(45 10 10)"/>
                <ellipse cx="10" cy="10" rx="6" ry="3" fill="#32CD32" opacity="0.4" transform="rotate(-45 10 10)"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="#F0FFF0"/>
            <rect width="100" height="100" fill="url(#leaves)"/>
          </svg>
        `) + "')",
        'pattern-wood': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#DEB887"/>
                <stop offset="20%" style="stop-color:#D2B48C"/>
                <stop offset="40%" style="stop-color:#CD853F"/>
                <stop offset="60%" style="stop-color:#D2B48C"/>
                <stop offset="80%" style="stop-color:#DEB887"/>
                <stop offset="100%" style="stop-color:#F5DEB3"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#wood)"/>
            <rect x="0" y="20" width="100" height="2" fill="#8B4513" opacity="0.3"/>
            <rect x="0" y="60" width="100" height="1" fill="#8B4513" opacity="0.2"/>
            <rect x="0" y="80" width="100" height="1.5" fill="#8B4513" opacity="0.25"/>
          </svg>
        `) + "')",
        'pattern-marble': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="marble" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#F8F8FF"/>
                <stop offset="30%" style="stop-color:#E6E6FA"/>
                <stop offset="60%" style="stop-color:#D3D3D3"/>
                <stop offset="100%" style="stop-color:#C0C0C0"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#marble)"/>
            <path d="M0,30 Q30,20 60,35 T100,25 L100,40 Q70,50 40,35 T0,45 Z" fill="#B0B0B0" opacity="0.3"/>
            <path d="M0,70 Q40,60 70,75 T100,65 L100,80 Q60,90 30,75 T0,85 Z" fill="#A9A9A9" opacity="0.2"/>
          </svg>
        `) + "')",
        'pattern-dark': "url('data:image/svg+xml;base64," + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="dark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#2C3E50"/>
                <stop offset="50%" style="stop-color:#34495E"/>
                <stop offset="100%" style="stop-color:#1A252F"/>
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#dark)"/>
            <circle cx="20" cy="20" r="2" fill="#3498DB" opacity="0.6"/>
            <circle cx="80" cy="30" r="1.5" fill="#E74C3C" opacity="0.5"/>
            <circle cx="60" cy="70" r="2.5" fill="#F39C12" opacity="0.4"/>
            <circle cx="30" cy="80" r="1" fill="#2ECC71" opacity="0.7"/>
          </svg>
        `) + "')"
      };
      
      // 传统图案
      const patterns = {
        'none': 'transparent',
        'dots': `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
        'grid': `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
        'lines': `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 11px)`,
        'diagonal': `repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 10px, transparent 10px, transparent 20px)`,
        'crosshatch': `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 6px), repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 6px)`
      };
      
      // 首先检查是否是新的纹理预设
      if (texturePresets[background.texturePattern as keyof typeof texturePresets]) {
        backgroundValue = texturePresets[background.texturePattern as keyof typeof texturePresets];
      } else {
        // 回退到传统图案
        backgroundValue = patterns[background.texturePattern as keyof typeof patterns] || config.colors.background;
      }
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
  
  // 可读性增强变量
  if (background.textOverlay) {
    cssVars['--card-text-overlay'] = background.textOverlay;
  }
  if (background.contrastBoost) {
    cssVars['--card-contrast-boost'] = background.contrastBoost / 100;
  }
  if (background.blurAmount) {
    cssVars['--card-blur-amount'] = `${background.blurAmount}px`;
  }
  
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