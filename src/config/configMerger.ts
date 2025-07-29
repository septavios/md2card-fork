import { ThemeConfig, UserConfig, FinalConfig } from './themeConfig';
import { devLog, prodLog } from '../utils/logger';

// Strategy pattern for merging configurations
interface MergeStrategy {
  merge(themeConfig: ThemeConfig, userConfig: UserConfig): FinalConfig;
}

class ThemePriorityStrategy implements MergeStrategy {
  merge(themeConfig: ThemeConfig, userConfig: UserConfig): FinalConfig {
    // Theme takes priority - only merge user config for non-conflicting properties
    const result = deepMerge({}, themeConfig) as FinalConfig;
    
    // Only apply user config to layout and non-theme-specific properties
    if (userConfig.layout) {
      result.layout = deepMerge(result.layout || {}, userConfig.layout);
    }
    
    return result;
  }
}

class UserPriorityStrategy implements MergeStrategy {
  merge(themeConfig: ThemeConfig, userConfig: UserConfig): FinalConfig {
    // User config takes priority
    return deepMerge(themeConfig, userConfig) as FinalConfig;
  }
}

// Utility function for deep merging objects
function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;
  
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// Main configuration merger function
export function getFinalConfig(
  themeConfig: ThemeConfig, 
  userConfig: UserConfig, 
  forceThemeOverride: boolean = false
): FinalConfig {
  try {
    const strategy = forceThemeOverride 
      ? new ThemePriorityStrategy() 
      : new UserPriorityStrategy();
    
    return strategy.merge(themeConfig, userConfig);
  } catch (error) {
    prodLog.error('Error merging configurations:', error);
    // Fallback to theme config
    return { ...themeConfig } as FinalConfig;
  }
}

// Color utility functions
export class ColorUtils {
  static getColorBrightness(color: string): number {
    try {
      // Remove # if present
      const hex = color.replace('#', '');
      
      // Convert to RGB
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // Calculate brightness using luminance formula
      return (r * 299 + g * 587 + b * 114) / 1000;
    } catch (error) {
      devLog.warn('Error calculating color brightness:', error);
      return 128; // Default to medium brightness
    }
  }

  static getOptimalTextColor(backgroundColor: string): string {
    try {
      const brightness = this.getColorBrightness(backgroundColor);
      return brightness > 128 ? '#000000' : '#ffffff';
    } catch (error) {
      devLog.warn('Error getting optimal text color:', error);
      return '#000000'; // Default to black
    }
  }
}

// Legacy migration function for backward compatibility
export function migrateFromOldSettings(oldSettings: any): UserConfig {
  try {
    const userConfig: UserConfig = {
      selectedTheme: oldSettings.selectedTheme || 'default',
    };

    // Migrate font settings
    if (oldSettings.selectedFont || oldSettings.fontSize || oldSettings.lineHeight) {
      userConfig.font = {
        family: oldSettings.selectedFont,
        size: oldSettings.fontSize,
        lineHeight: oldSettings.lineHeight,
      };
    }

    // Migrate background settings
    if (oldSettings.background) {
      userConfig.background = oldSettings.background;
    }

    // Migrate other settings as needed
    if (oldSettings.colors) {
      userConfig.colors = oldSettings.colors;
    }

    if (oldSettings.spacing) {
      userConfig.spacing = oldSettings.spacing;
    }

    if (oldSettings.shadow) {
      userConfig.shadow = oldSettings.shadow;
    }

    if (oldSettings.layout) {
      userConfig.layout = oldSettings.layout;
    }

    return userConfig;
  } catch (error) {
    prodLog.error('Error migrating old settings:', error);
    return { selectedTheme: 'default' };
  }
}

// Convert final config to CSS variables
export function configToCSSVariables(config: FinalConfig, hasUserCustomizations?: any): Record<string, string> {
  try {
    const cssVars: Record<string, string> = {};

    // Font variables
    if (config.font) {
      cssVars['--card-font-family'] = config.font.family;
      cssVars['--card-font-size'] = `${config.font.size}px`;
      cssVars['--card-line-height'] = config.font.lineHeight.toString();
      if (config.font.weight) {
        cssVars['--card-font-weight'] = config.font.weight.toString();
      }
    }

    // Color variables
    if (config.colors) {
      cssVars['--card-color-primary'] = config.colors.primary;
      cssVars['--card-color-secondary'] = config.colors.secondary;
      cssVars['--card-color-accent'] = config.colors.accent;
      cssVars['--card-color-text'] = config.colors.text;
      cssVars['--card-color-background'] = config.colors.background;
      cssVars['--card-border'] = `1px solid ${config.colors.border}`;
    }

    // Spacing variables
    if (config.spacing) {
      cssVars['--card-padding'] = `${config.spacing.padding}px`;
      cssVars['--card-margin'] = `${config.spacing.margin}px`;
      cssVars['--card-border-radius'] = `${config.spacing.borderRadius}px`;
    }

    // Background variables with user customization logic
    if (config.background) {
      const bg = config.background;
      
      // Check if user has customized background
      const userCustomizedBackground = hasUserCustomizations?.background;
      
      if (userCustomizedBackground && bg.type === 'solid' && bg.solidColor) {
        // User customized background - use their settings
        cssVars['--card-background'] = bg.solidColor;
        cssVars['--card-color-text'] = ColorUtils.getOptimalTextColor(bg.solidColor);
      } else if (bg.type === 'gradient' && bg.gradientStart && bg.gradientEnd) {
        const direction = bg.gradientDirection || 45;
        cssVars['--card-background'] = `linear-gradient(${direction}deg, ${bg.gradientStart}, ${bg.gradientEnd})`;
      } else if (bg.type === 'image' && bg.imageUrl) {
        cssVars['--card-background'] = `url(${bg.imageUrl})`;
        cssVars['--card-background-size'] = 'cover';
        cssVars['--card-background-position'] = 'center';
      } else if (bg.solidColor) {
        // Default to solid color
        cssVars['--card-background'] = bg.solidColor;
      }

      if (bg.opacity !== undefined && bg.opacity < 1) {
        cssVars['--card-background-opacity'] = bg.opacity.toString();
      }
    }

    // Shadow variables
    if (config.shadow && config.shadow.enabled) {
      const shadow = config.shadow;
      cssVars['--card-shadow'] = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
    } else {
      cssVars['--card-shadow'] = 'none';
    }

    return cssVars;
  } catch (error) {
    prodLog.error('Error converting config to CSS variables:', error);
    return {};
  }
}