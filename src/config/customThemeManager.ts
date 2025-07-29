import { ThemeConfig } from './themeConfig';
import { prodLog } from '../utils/logger';

export interface CustomTheme extends ThemeConfig {
  isCustom: true;
  createdAt: string;
  updatedAt: string;
  author?: string;
}

export interface CustomThemeExport {
  version: string;
  theme: CustomTheme;
  exportedAt: string;
}

class CustomThemeManager {
  private customThemes: Map<string, CustomTheme> = new Map();
  private storageKey = 'custom-themes';

  constructor() {
    this.loadCustomThemes();
  }

  /**
   * 从localStorage加载自定义主题
   */
  private loadCustomThemes() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const themes = JSON.parse(stored) as CustomTheme[];
        themes.forEach(theme => {
          this.customThemes.set(theme.id, theme);
        });
      }
    } catch (error) {
      prodLog.error('Failed to load custom themes:', error);
    }
  }

  /**
   * 保存自定义主题到localStorage
   */
  private saveCustomThemes() {
    try {
      const themes = Array.from(this.customThemes.values());
      localStorage.setItem(this.storageKey, JSON.stringify(themes));
    } catch (error) {
      prodLog.error('Failed to save custom themes:', error);
    }
  }

  /**
   * 创建新的自定义主题
   */
  createCustomTheme(
    name: string,
    baseThemeId: string,
    customizations: Partial<ThemeConfig>,
    author?: string
  ): CustomTheme | null {
    // 注意：这里我们不再依赖themeManager来获取基础主题
    // 而是直接使用传入的customizations作为主题配置
    
    // 生成唯一ID
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // 创建自定义主题（使用默认配置作为基础）
    const customTheme: CustomTheme = {
      id,
      name,
      description: customizations.description || `自定义主题`,
      font: customizations.font || { family: 'Inter', size: 16, lineHeight: 1.6 },
      colors: customizations.colors || {
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#8b5cf6',
        background: '#ffffff',
        text: '#1a1a1a',
        border: '#e5e7eb'
      },
      spacing: customizations.spacing || { padding: 16, margin: 16, borderRadius: 12 },
      background: customizations.background || { type: 'solid', solidColor: '#ffffff', opacity: 100 },
      shadow: customizations.shadow || { enabled: true, blur: 10, spread: 0, offsetX: 0, offsetY: 2, color: '#000000' },
      layout: customizations.layout || { width: 800, height: 600 },
      customStyles: customizations.customStyles || {},
      isCustom: true,
      createdAt: now,
      updatedAt: now,
      author,
    };

    // 保存到内存和localStorage
    this.customThemes.set(id, customTheme);
    this.saveCustomThemes();

    return customTheme;
  }

  /**
   * 更新自定义主题
   */
  updateCustomTheme(id: string, updates: Partial<ThemeConfig>): boolean {
    const theme = this.customThemes.get(id);
    if (!theme) {
      return false;
    }

    const updatedTheme: CustomTheme = {
      ...theme,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.customThemes.set(id, updatedTheme);
    this.saveCustomThemes();

    return true;
  }

  /**
   * 删除自定义主题
   */
  deleteCustomTheme(id: string): boolean {
    if (!this.customThemes.has(id)) {
      return false;
    }

    this.customThemes.delete(id);
    this.saveCustomThemes();
    return true;
  }

  /**
   * 获取所有自定义主题
   */
  getAllCustomThemes(): CustomTheme[] {
    return Array.from(this.customThemes.values());
  }

  /**
   * 获取自定义主题
   */
  getCustomTheme(id: string): CustomTheme | null {
    return this.customThemes.get(id) || null;
  }

  /**
   * 检查是否为自定义主题
   */
  isCustomTheme(id: string): boolean {
    return this.customThemes.has(id);
  }

  /**
   * 导出自定义主题
   */
  exportTheme(id: string): CustomThemeExport | null {
    const theme = this.customThemes.get(id);
    if (!theme) {
      return null;
    }

    return {
      version: '1.0.0',
      theme,
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * 导入自定义主题
   */
  importTheme(exportData: CustomThemeExport): CustomTheme | null {
    try {
      const { theme } = exportData;
      
      // 生成新的ID以避免冲突
      const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const importedTheme: CustomTheme = {
        ...theme,
        id: newId,
        name: `${theme.name} (导入)`,
        createdAt: now,
        updatedAt: now,
        isCustom: true,
      };

      // 保存到内存和localStorage
      this.customThemes.set(newId, importedTheme);
      this.saveCustomThemes();

      return importedTheme;
    } catch (error) {
      prodLog.error('Failed to import theme:', error);
      return null;
    }
  }

  /**
   * 从当前用户设置创建自定义主题
   */
  createThemeFromCurrentSettings(
    name: string,
    baseThemeId: string,
    userConfig: any,
    author?: string
  ): CustomTheme | null {
    // 将用户配置转换为主题配置
    const customizations: Partial<ThemeConfig> = {
      font: userConfig.selectedFont ? {
        family: userConfig.selectedFont,
        size: userConfig.fontSize || 16,
        lineHeight: userConfig.lineHeight || 1.6,
        weight: 400,
      } : undefined,
      background: userConfig.background ? {
        type: userConfig.background.type,
        solidColor: userConfig.background.solidColor,
        gradientStart: userConfig.background.gradientStart,
        gradientEnd: userConfig.background.gradientEnd,
        gradientDirection: userConfig.background.gradientDirection,
        texturePattern: userConfig.background.texturePattern,
        imageUrl: userConfig.background.imageUrl,
        opacity: userConfig.background.opacity || 100,
        textOverlay: userConfig.background.textOverlay,
        contrastBoost: userConfig.background.contrastBoost,
        blurAmount: userConfig.background.blurAmount,
      } : undefined,
    };

    return this.createCustomTheme(name, baseThemeId, customizations, author);
  }

  /**
   * 清除所有自定义主题
   */
  clearAllCustomThemes() {
    this.customThemes.clear();
    localStorage.removeItem(this.storageKey);
  }
}

// 创建全局自定义主题管理器实例
export const customThemeManager = new CustomThemeManager();