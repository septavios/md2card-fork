import { ThemeConfig } from './themeConfig';

export const appleNotesDarkTheme: ThemeConfig = {
  id: 'AppleNotesDark',
  name: 'Apple Notes Dark',
  description: 'Apple Notes inspired dark mode: minimal, professional, and native macOS look.',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "San Francisco", "PingFang SC", sans-serif',
    size: 16,
    lineHeight: 1.5,
    weight: 400,
  },
  colors: {
    primary: '#0a84ff',
    secondary: '#8e8e93',
    accent: '#636366',
    text: '#ffffff',
    background: '#000000',
    border: '#2c2c2e',
  },
  spacing: {
    padding: 20,
    margin: 12,
    borderRadius: 12,
  },
  background: {
    type: 'solid',
    solidColor: '#000000',
    opacity: 100,
  },
  shadow: {
    enabled: false,
    color: 'rgba(0,0,0,0.3)',
    blur: 0,
    spread: 0,
    offsetX: 0,
    offsetY: 0,
  },
  layout: {
    width: 375,
    height: 812,
    viewMode: '长卡片',
    hideOverflow: false,
    showPageNumbers: false,
    layoutMode: '自动拆分',
    scale: 100,
  },
  customStyles: {
    container: {
      position: 'relative',
      background: '#000000',
      borderRadius: '0px',
      overflow: 'hidden',
      margin: '0',
      padding: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    elements: {
      // 顶部导航栏 - 精确匹配 Apple Notes 设计
      '.card-header': {
        background: '#18181b', // zinc-900
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '0.5px solid rgba(84, 84, 88, 0.6)',
        position: 'relative',
        zIndex: '10',
      },
      
      // 返回按钮样式 - 精确匹配
      '.header-back-button': {
        color: '#facc15', // yellow-400
        fontSize: '16px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        gap: '8px',
        flex: '0 0 auto', // Don't grow or shrink
      },
      
      '.header-back-button::before': {
        content: '""',
        width: '20px',
        height: '20px',
        display: 'block',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23f3b30f%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20class%3D%22lucide%20lucide-chevron-left-icon%20lucide-chevron-left%22%3E%3Cpath%20d%3D%22m15%2018-6-6%206-6%22%2F%3E%3C%2Fsvg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '20px 20px',
      },
      
      // 右侧操作按钮容器
      '.header-action-buttons': {
        display: 'flex',
        alignItems: 'center',
        gap: '24px', // space-x-6
        flex: '0 0 auto', // Don't grow or shrink
        marginLeft: 'auto', // Push to the right
      },
      
      // 单个操作按钮样式
      '.header-action-button': {
        color: '#facc15', // yellow-400
        padding: '4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        fontSize: '18px',
      },
      
      // 分享按钮图标 - Share2
      '.header-action-button.share::before': {
        content: '""',
        width: '24px',
        height: '24px',
        display: 'block',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgb(248, 199, 68)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'%3E%3C/path%3E%3Cpolyline points='16 6 12 2 8 6'%3E%3C/polyline%3E%3Cline x1='12' x2='12' y1='2' y2='15'%3E%3C/line%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '24px 24px',
      },
      
      // 更多选项按钮图标 - MoreHorizontal
      '.header-action-button.more::before': {
        content: '""',
        width: '24px',
        height: '24px',
        display: 'block',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgb(248, 199, 68)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M17 12h.01'%3E%3C/path%3E%3Cpath d='M12 12h.01'%3E%3C/path%3E%3Cpath d='M7 12h.01'%3E%3C/path%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '24px 24px',
      },
      
      '.card-content': {
        background: '#1c1c1e',
        borderRadius: '0px',
        padding: '16px',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "PingFang SC", sans-serif',
        lineHeight: 1.4,
        flex: 1,
        fontSize: '16px',
        border: 'none',
        boxShadow: 'none',
        overflow: 'auto',
      },
      
      // 标题样式 - 完整的标题层级系统
      'h1, .md-h1': {
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: 700,
        marginTop: '0',
        marginBottom: '16px',
        lineHeight: 1.2,
        paddingBottom: '8px',
        borderBottom: '2px solid #2c2c2e',
        display: 'block',
        position: 'relative',
        '&::before': {
          content: '"📚"',
          marginRight: '12px',
          fontSize: '24px',
          verticalAlign: 'middle',
        },
      },
      
      'h2, .md-h2': {
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: 600,
        marginTop: '32px',
        marginBottom: '16px',
        lineHeight: 1.3,
        paddingBottom: '6px',
        borderBottom: '1px solid #2c2c2e',
        display: 'block',
        position: 'relative',
        '&::before': {
          content: '"✨"',
          marginRight: '10px',
          fontSize: '18px',
          verticalAlign: 'middle',
        },
      },
      
      'h3, .md-h3': {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 600,
        marginTop: '24px',
        marginBottom: '12px',
        lineHeight: 1.3,
        display: 'block',
        position: 'relative',
        '&::before': {
          content: '"🚀"',
          marginRight: '8px',
          fontSize: '16px',
          verticalAlign: 'middle',
        },
      },
      
      'h4, .md-h4': {
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 600,
        marginTop: '20px',
        marginBottom: '10px',
        lineHeight: 1.4,
        display: 'block',
        position: 'relative',
        '&::before': {
          content: '"💡"',
          marginRight: '8px',
          fontSize: '14px',
          verticalAlign: 'middle',
        },
      },
      
      'h5, .md-h5': {
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: 600,
        marginTop: '16px',
        marginBottom: '8px',
        lineHeight: 1.4,
        display: 'block',
        position: 'relative',
        '&::before': {
          content: '"🔹"',
          marginRight: '6px',
          fontSize: '12px',
          verticalAlign: 'middle',
        },
      },
      
      'h6, .md-h6': {
        color: '#8e8e93',
        fontSize: '14px',
        fontWeight: 600,
        marginTop: '12px',
        marginBottom: '6px',
        lineHeight: 1.4,
        display: 'block',
        position: 'relative',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        '&::before': {
          content: '"▪"',
          marginRight: '6px',
          fontSize: '10px',
          verticalAlign: 'middle',
        },
      },
      
      // 段落样式
      'p': {
        color: '#ffffff',
        fontSize: '16px',
        lineHeight: 1.4,
        margin: '8px 0',
        fontWeight: 400,
      },
      
      // 引用样式 - 匹配截图中的引用
      '.md-blockquote': {
        borderLeft: 'none',
        padding: '0',
        margin: '8px 0',
        background: 'transparent',
        color: '#8e8e93',
        fontStyle: 'normal',
        fontSize: '16px',
        lineHeight: 1.4,
        position: 'relative',
        paddingLeft: '16px',
        '&::before': {
          content: '"——"',
          position: 'absolute',
          left: '0',
          color: '#8e8e93',
          fontWeight: 400,
        },
      },
      
      // 列表样式 - 匹配截图中的复选框列表
      'ul': {
        listStyle: 'none',
        padding: '0',
        margin: '16px 0',
      },
      
      'li': {
        color: '#ffffff',
        fontSize: '16px',
        lineHeight: 1.5,
        marginBottom: '8px',
        paddingLeft: '0',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      },
      
      // 复选框样式 - 匹配截图中的复选框
      'li[data-task="true"]': {
        '&::before': {
          content: '"☑️"',
          marginRight: '8px',
          fontSize: '16px',
          color: '#34c759',
        },
      },
      
      'li[data-task="false"]': {
        '&::before': {
          content: '"☐"',
          marginRight: '8px',
          fontSize: '16px',
          color: '#8e8e93',
        },
      },
      
      // 普通列表项
      'li:not([data-task])': {
        '&::before': {
          content: '"•"',
          marginRight: '8px',
          fontSize: '16px',
          color: '#8e8e93',
        },
      },
      
      // 有序列表
      'ol': {
        listStyle: 'none',
        padding: '0',
        margin: '16px 0',
        counterReset: 'apple-counter',
      },
      
      'ol li': {
        counterIncrement: 'apple-counter',
        '&::before': {
          content: 'counter(apple-counter) "."',
          marginRight: '8px',
          fontSize: '16px',
          color: '#8e8e93',
          fontWeight: 500,
        },
      },
      
      // 强调文本
      '.md-strong, strong': {
        color: '#ffffff',
        fontWeight: 600,
      },
      
      '.md-em, em': {
        color: '#ffffff',
        fontStyle: 'italic',
      },
      
      // 分割线
      '.md-hr, hr': {
        border: 'none',
        height: '0.5px',
        background: '#2c2c2e',
        margin: '24px 0',
      },
      
      // 代码样式
      'code': {
        background: '#2c2c2e',
        color: '#ffffff',
        padding: '2px 6px',
        borderRadius: '4px',
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
        fontSize: '14px',
      },
      
      'pre': {
        background: '#2c2c2e',
        color: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        overflow: 'auto',
        margin: '16px 0',
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
        fontSize: '14px',
        lineHeight: 1.4,
      },
      
      // 链接样式
      'a': {
        color: '#0a84ff',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      
      // 表格样式 - 完整的表格设计系统
      'table, .md-table': {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        margin: '20px 0',
        fontSize: '15px',
        backgroundColor: '#1c1c1e',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #2c2c2e',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
      
      'thead, .md-thead': {
        backgroundColor: '#2c2c2e',
        position: 'relative',
      },
      
      'th, .md-th': {
        backgroundColor: '#2c2c2e',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: '14px',
        padding: '12px 16px',
        textAlign: 'left',
        borderBottom: '2px solid #3a3a3c',
        borderRight: '1px solid #3a3a3c',
        position: 'relative',
        '&:last-child': {
          borderRight: 'none',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '2px',
          background: 'linear-gradient(90deg, #0a84ff 0%, #5ac8fa 100%)',
        },
      },
      
      'tbody, .md-tbody': {
        backgroundColor: '#1c1c1e',
      },
      
      'td, .md-td': {
        backgroundColor: 'transparent',
        color: '#ffffff',
        fontSize: '15px',
        padding: '12px 16px',
        borderBottom: '1px solid #2c2c2e',
        borderRight: '1px solid #2c2c2e',
        lineHeight: 1.4,
        verticalAlign: 'top',
        transition: 'background-color 0.2s ease',
        '&:last-child': {
          borderRight: 'none',
        },
      },
      
      'tr, .md-tr': {
        '&:hover td': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        '&:last-child td': {
          borderBottom: 'none',
        },
      },
      
      // 表格标题样式
      'table caption': {
        color: '#8e8e93',
        fontSize: '13px',
        fontWeight: 500,
        textAlign: 'left',
        marginBottom: '8px',
        paddingLeft: '4px',
      },
      
      // 表格内的代码样式
      'table code, .md-table code': {
        backgroundColor: '#2c2c2e',
        color: '#0a84ff',
        padding: '2px 4px',
        borderRadius: '3px',
        fontSize: '13px',
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
      },
      
      // 表格内的链接样式
      'table a, .md-table a': {
        color: '#0a84ff',
        textDecoration: 'none',
        fontWeight: 500,
        '&:hover': {
          textDecoration: 'underline',
          color: '#5ac8fa',
        },
      },
      
      // 表格内的强调文本
      'table strong, .md-table strong': {
        color: '#ffffff',
        fontWeight: 600,
      },
      
      'table em, .md-table em': {
        color: '#8e8e93',
        fontStyle: 'italic',
      },
    },
  },
};

// 主题注册表 - 只包含 Apple Notes Dark 主题
export const predefinedThemes = {
  [appleNotesDarkTheme.id]: appleNotesDarkTheme,
};