import { Renderer } from "marked";
import { themeManager } from "./config/themeManager";
import UniversalCard from "./components/UniversalCard";

export interface CardProps  {
  page: string;
  width: number;
  height: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  contentRef?: React.RefObject<HTMLDivElement>;
}

export interface CardConfig {
  name: string;
  component: React.FunctionComponent<CardProps>;
  renderer: Renderer;
}

// 找出./cards/*Card.tsx文件
export const cardFiles = import.meta.glob("./components/cards/*Card.tsx", {
  eager: true,
});

// 动态导入所有的卡片组件
export const cardComponents = Object.values(cardFiles).reduce(
  (configs: Record<string, CardConfig>, module) => {
    const config = (module as any).default as CardConfig;
    configs[config.name] = config;
    return configs;
  },
  {} as Record<string, CardConfig>,
);

// 注册旧的卡片组件到新的主题管理器
Object.values(cardComponents).forEach(config => {
  // 为旧组件创建适配器，使其与新系统兼容
  const adaptedComponent = (props: any) => {
    // 如果有配置，使用 UniversalCard，否则使用原始组件
    if (props.config) {
      return UniversalCard(props);
    }
    return config.component(props);
  };

  themeManager.updateThemeComponent(config.name, adaptedComponent);
  themeManager.updateThemeRenderer(config.name, config.renderer);
});

export const configNames = Object.values(cardComponents).map(
  (config) => config.name,
);

// 导出主题管理器以便其他地方使用
export { themeManager };
