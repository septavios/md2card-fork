import { Renderer } from "marked";

// 基础配置接口
export interface FontConfig {
  family: string;
  size: number;
  lineHeight: number;
  weight?: number;
}

export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  border: string;
}

export interface SpacingConfig {
  padding: number;
  margin: number;
  borderRadius: number;
}

export interface BackgroundConfig {
  type: "solid" | "gradient" | "texture" | "image";
  solidColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: number;
  texturePattern?: string;
  imageUrl?: string;
  opacity: number;
  // Readability enhancement options
  textOverlay?: 'none' | 'semi-transparent' | 'blur' | 'gradient';
  contrastBoost?: number; // 0-100
  blurAmount?: number; // 0-10 px
}

export interface ShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  spread: number;
  offsetX: number;
  offsetY: number;
}

export interface LayoutConfig {
  width: number;
  height: number;
  viewMode: "长卡片" | "短卡片";
  hideOverflow: boolean;
  showPageNumbers: boolean;
  layoutMode: "自动拆分" | "横线拆分";
  scale: number;
}

// 主题配置接口
export interface ThemeConfig {
  id: string;
  name: string;
  description?: string;
  font: FontConfig;
  colors: ColorConfig;
  spacing: SpacingConfig;
  background: BackgroundConfig;
  shadow: ShadowConfig;
  layout: Partial<LayoutConfig>;
  // 主题特有的样式覆盖
  customStyles?: {
    container?: Record<string, any>;
    elements?: Record<string, Record<string, any>>;
  };
}

// 用户配置接口（可以覆盖主题的任何配置）
export interface UserConfig {
  selectedTheme: string;
  font?: Partial<FontConfig>;
  colors?: Partial<ColorConfig>;
  spacing?: Partial<SpacingConfig>;
  background?: Partial<BackgroundConfig>;
  shadow?: Partial<ShadowConfig>;
  layout?: Partial<LayoutConfig>;
  customStyles?: {
    container?: Record<string, any>;
    elements?: Record<string, Record<string, any>>;
  };
}

// 最终合并后的配置
export interface FinalConfig extends ThemeConfig {
  // 继承 ThemeConfig 的所有属性
  hasUserCustomizations?: any; // 用户自定义设置信息
}

// 卡片组件属性接口
export interface CardProps {
  page: string;
  width?: number;
  height?: number;
  config: FinalConfig; // 使用合并后的配置
  containerRef?: React.RefObject<HTMLDivElement>;
  contentRef?: React.RefObject<HTMLDivElement>;
  pageNumber?: number; // 当前页码
  totalPages?: number; // 总页数
  showPageNumbers?: boolean; // 是否显示页码
  hideOverflow?: boolean; // 是否隐藏超出内容
}

// 主题注册接口
export interface ThemeRegistration {
  config: ThemeConfig;
  component: React.FunctionComponent<CardProps>;
  renderer: Renderer;
}

// 主题注册表
export type ThemeRegistry = Record<string, ThemeRegistration>;