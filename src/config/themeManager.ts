import { Renderer } from "marked";
import { ThemeConfig, ThemeRegistration, ThemeRegistry, UserConfig, FinalConfig } from './themeConfig';
import { getFinalConfig } from './configMerger';
import { predefinedThemes } from './predefinedThemes';

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
    return Object.values(this.themes).map(theme => ({
      id: theme.config.id,
      name: theme.config.name,
      description: theme.config.description,
    }));
  }

  /**
   * 获取最终配置（合并主题配置和用户配置）
   */
  getFinalConfig(themeId: string, userConfig: UserConfig, hasUserCustomizations?: any): FinalConfig | null {
    const themeConfig = this.getThemeConfig(themeId);
    if (!themeConfig) {
      return null;
    }
    
    // 检测是否切换到不同主题
    const isThemeChange = this.lastSelectedTheme !== themeId;
    this.lastSelectedTheme = themeId;
    
    // 如果是主题切换，需要根据用户自定义情况决定合并策略
    if (isThemeChange) {
      // 主题切换时，主题配置优先，但保留用户明确自定义的设置
      const forceThemeOverride = !hasUserCustomizations || Object.values(hasUserCustomizations || {}).every(v => !v);
      return getFinalConfig(themeConfig, userConfig, forceThemeOverride);
    } else {
      // 同一主题内的设置变更，用户配置优先
      return getFinalConfig(themeConfig, userConfig, false);
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