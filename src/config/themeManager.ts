import { Renderer } from "marked";
import { ThemeConfig, ThemeRegistration, ThemeRegistry, UserConfig, FinalConfig } from './themeConfig';
import { getFinalConfig } from './configMerger';
import { predefinedThemes } from './predefinedThemes';
import { customThemeManager } from './customThemeManager';

class ThemeManager {
  private themes: ThemeRegistry = {};
  private renderers: Record<string, Renderer> = {};
  private lastSelectedTheme: string | null = null;

  constructor() {
    // 注册预定义主题
    this.registerPredefinedThemes();
  }

  /**
   * 注册预定义主题
   */
  private registerPredefinedThemes() {
    // 这里我们先注册主题配置，组件和渲染器将在后续动态加载
    Object.values(predefinedThemes).forEach(themeConfig => {
      this.themes[themeConfig.id] = {
        config: themeConfig,
        component: null as any, // 将在动态加载时设置
        renderer: new Renderer(), // 默认渲染器，将在动态加载时覆盖
      };
    });
  }

  /**
   * 注册主题
   */
  registerTheme(themeId: string, registration: ThemeRegistration) {
    this.themes[themeId] = registration;
    this.renderers[themeId] = registration.renderer;
  }

  /**
   * 获取主题配置
   */
  getThemeConfig(themeId: string): ThemeConfig | null {
    return this.themes[themeId]?.config || null;
  }

  /**
   * 获取主题组件
   */
  getThemeComponent(themeId: string) {
    return this.themes[themeId]?.component || null;
  }

  /**
   * 获取主题渲染器
   */
  getThemeRenderer(themeId: string): Renderer | null {
    return this.themes[themeId]?.renderer || null;
  }

  /**
   * 获取所有主题列表
   */
  getAllThemes(): Array<{ id: string; name: string; description?: string }> {
    // 获取预定义主题
    const predefinedThemesList = Object.values(this.themes).map(theme => ({
      id: theme.config.id,
      name: theme.config.name,
      description: theme.config.description,
    }));

    // 获取自定义主题
    const customThemes = customThemeManager.getAllCustomThemes().map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
    }));

    // 合并并返回所有主题
    return [...predefinedThemesList, ...customThemes];
  }

  /**
   * 获取最终配置（合并主题配置和用户配置）
   */
  getFinalConfig(themeId: string, userConfig: UserConfig, hasUserCustomizations?: any): FinalConfig | null {
    // 首先尝试从预定义主题获取配置
    let themeConfig = this.getThemeConfig(themeId);
    
    // 如果预定义主题中没有，尝试从自定义主题获取
    if (!themeConfig) {
      const customTheme = customThemeManager.getCustomTheme(themeId);
      if (customTheme) {
        themeConfig = customTheme; // CustomTheme extends ThemeConfig
      }
    }
    
    if (!themeConfig) {
      return null;
    }
    
    // 检测是否切换到不同主题
    const isThemeChange = this.lastSelectedTheme !== themeId;
    this.lastSelectedTheme = themeId;
    
    // 如果是主题切换，需要根据用户自定义情况决定合并策略
    if (isThemeChange) {
      // 主题切换时，只有当用户完全没有任何自定义时才强制覆盖
      // 否则保留所有用户自定义设置，只应用主题的默认配置到未自定义的部分
      const hasAnyCustomizations = hasUserCustomizations && Object.values(hasUserCustomizations || {}).some(v => v);
      const finalConfig = getFinalConfig(themeConfig, userConfig, !hasAnyCustomizations);
      finalConfig.hasUserCustomizations = hasUserCustomizations;
      return finalConfig;
    } else {
      // 同一主题内的设置变更，用户配置优先，不强制覆盖
      const finalConfig = getFinalConfig(themeConfig, userConfig, false);
      finalConfig.hasUserCustomizations = hasUserCustomizations;
      return finalConfig;
    }
  }

  /**
   * 检查主题是否存在
   */
  hasTheme(themeId: string): boolean {
    return themeId in this.themes;
  }

  /**
   * 动态更新主题组件（用于热重载）
   */
  updateThemeComponent(themeId: string, component: React.FunctionComponent<any>) {
    if (this.themes[themeId]) {
      this.themes[themeId].component = component;
    }
  }

  /**
   * 动态更新主题渲染器（用于热重载）
   */
  updateThemeRenderer(themeId: string, renderer: Renderer) {
    if (this.themes[themeId]) {
      this.themes[themeId].renderer = renderer;
      this.renderers[themeId] = renderer;
    }
  }
}

// 创建全局主题管理器实例
export const themeManager = new ThemeManager();

// 导出类型和接口
export * from './themeConfig';
export * from './configMerger';
export * from './predefinedThemes';