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
        color: '#0a84ff', // Apple蓝色，与h2保持一致的设计语言
        fontSize: '28px',
        fontWeight: 700,
        marginTop: '0',
        marginBottom: '16px',
        lineHeight: 1.2,
        paddingBottom: '8px',
        borderBottom: '2px solid #2c2c2e',
        display: 'block',
        position: 'relative',
      },
      
      'h1::before, .md-h1::before': {
        content: '"📚"',
        marginRight: '12px',
        fontSize: '24px',
        verticalAlign: 'middle',
      },
      
      'h2, .md-h2': {
        color: '#0a84ff', // Apple蓝色，更符合Apple Notes主题
        fontSize: '22px',
        fontWeight: 600,
        marginTop: '16px', // 减少上边距从32px到16px
        marginBottom: '16px',
        lineHeight: 1.3,
        paddingBottom: '6px',
        borderBottom: '1px solid #2c2c2e',
        display: 'block',
        position: 'relative',
      },
      
      'h2::before, .md-h2::before': {
        content: '"✨"',
        marginRight: '10px',
        fontSize: '18px',
        verticalAlign: 'middle',
      },
      
      'h3, .md-h3': {
        color: '#5ac8fa', // Light blue - creates nice hierarchy between h2 and h4
        fontSize: '18px',
        fontWeight: 600,
        marginTop: '24px',
        marginBottom: '12px',
        lineHeight: 1.3,
        display: 'block',
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(90, 200, 250, 0.1) 0%, rgba(10, 132, 255, 0.05) 100%)',
        padding: '8px 12px',
        borderRadius: '6px',
        borderLeft: '3px solid #5ac8fa',
      },
      
      'h3::before, .md-h3::before': {
        content: '"🚀"',
        marginRight: '8px',
        fontSize: '16px',
        verticalAlign: 'middle',
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
      },
      
      'h4::before, .md-h4::before': {
        content: '"💡"',
        marginRight: '8px',
        fontSize: '14px',
        verticalAlign: 'middle',
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
      },
      
      'h5::before, .md-h5::before': {
        content: '"🔹"',
        marginRight: '6px',
        fontSize: '12px',
        verticalAlign: 'middle',
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
      },
      
      'h6::before, .md-h6::before': {
        content: '"▪"',
        marginRight: '6px',
        fontSize: '10px',
        verticalAlign: 'middle',
      },
      
      // 段落样式
      'p': {
        color: '#ffffff',
        fontSize: '16px',
        lineHeight: 1.4,
        margin: '8px 0',
        fontWeight: 400,
      },
      
      // 引用样式 - Apple Notes 风格 (card-apple-notes blockquote)
      '.card-apple-notes .md-blockquote, .card-apple-notes blockquote': {
        padding: '1px 0',
        borderLeft: '3px solid #0a84ff', // --notes-border
        paddingLeft: '16px',
        margin: '4px 0', // 减少margin从16px到4px
        color: '#8e8e93', // --notes-quote-color
        fontStyle: 'italic',
        background: 'transparent',
        borderRadius: '0',
        boxShadow: 'none',
        position: 'relative',
        fontSize: '16px',
        lineHeight: 1.5,
      },
      
      '.card-apple-notes .md-blockquote::before, .card-apple-notes blockquote::before': {
        display: 'none',
      },
      
      '.card-apple-notes .md-blockquote::after, .card-apple-notes blockquote::after': {
        display: 'none',
      },
      
      '.card-apple-notes .md-blockquote p, .card-apple-notes blockquote p': {
        margin: '0',
        color: '#8e8e93',
        fontWeight: 400,
        fontStyle: 'italic',
      },
      
      '.card-apple-notes .md-blockquote p:last-child, .card-apple-notes blockquote p:last-child': {
        marginBottom: '0',
      },
      
      // 通用blockquote样式（非Apple Notes主题）
      '.md-blockquote': {
        borderLeft: '4px solid #0a84ff',
        padding: '16px 20px',
        margin: '20px 0',
        background: 'rgba(10, 132, 255, 0.08)',
        color: '#ffffff',
        fontStyle: 'italic',
        fontSize: '16px',
        lineHeight: 1.6,
        position: 'relative',
        borderRadius: '0 8px 8px 0',
        boxShadow: '0 2px 8px rgba(10, 132, 255, 0.1)',
      },
      
      '.md-blockquote::before': {
        content: '""',
        position: 'absolute',
        left: '-4px',
        top: '0',
        bottom: '0',
        width: '4px',
        background: 'linear-gradient(180deg, #0a84ff 0%, #5ac8fa 100%)',
        borderRadius: '2px',
      },
      
      '.md-blockquote::after': {
        content: '"💭"',
        position: 'absolute',
        top: '12px',
        right: '16px',
        fontSize: '20px',
        opacity: 0.6,
      },
      
      '.md-blockquote p': {
        margin: '0',
        color: '#ffffff',
        fontWeight: 400,
      },
      
      '.md-blockquote p:last-child': {
        marginBottom: '0',
      },
      
      // 引用内的作者署名样式
      '.md-blockquote cite, .md-blockquote .citation': {
        display: 'block',
        marginTop: '12px',
        fontSize: '14px',
        color: '#8e8e93',
        fontStyle: 'normal',
        fontWeight: 500,
        textAlign: 'right',
      },
      
      '.md-blockquote cite::before, .md-blockquote .citation::before': {
        content: '"— "',
        color: '#0a84ff',
      },
      
      // 列表样式 - 匹配截图中的复选框列表
      'ul': {
        listStyle: 'none',
        padding: '0',
        margin: '4px 0', // 减少margin从16px到4px
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
      
      // 任务列表样式 - 使用用户提供的复选框样式
      'li[data-task="true"]': {
        position: 'relative',
        paddingLeft: '1.5em',
        listStyle: 'none',
      },
      'li[data-task="true"]::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        width: '16px',
        height: '16px',
        backgroundColor: '#1677ff',
        borderColor: '#1677ff',
        borderRadius: '2px',
        border: '1px solid',
        backgroundPosition: '1px 2px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '80%',
        backgroundImage: 'url(data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACLSURBVHgB7ZPBDYAgDEX/SI7AJjIKGziCozCKIzBChRiSHgoIlHjxJb3BexoA+GEQ0RYnxDmgDZNnPLQQ5BmDWSpyh1nSF66U7yTjShvOOFf65RVyzxaFWmREvgmLxUi3nG10rciw/E2kIrfooRAhFXlnxGKGRsRCg0LEQhMWSYdtsAJ6blHzdX/GDSY+GhmjX+BiAAAAAElFTkSuQmCC)'
      },
      'li[data-task="false"]': {
        position: 'relative',
        paddingLeft: '1.5em',
        listStyle: 'none',
      },
      'li[data-task="false"]::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        width: '16px',
        height: '16px',
        backgroundColor: 'transparent',
        border: '1px solid #d9d9d9',
        borderRadius: '2px'
      },
      // 显示checkbox输入元素并应用样式
      'input[type="checkbox"]': {
        width: '16px',
        height: '16px',
        marginRight: '8px',
        appearance: 'none',
        border: '1px solid #d9d9d9',
        borderRadius: '2px',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
      'input[type="checkbox"]:checked': {
        backgroundColor: '#1677ff',
        borderColor: '#1677ff',
        backgroundPosition: '1px 2px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '80%',
        backgroundImage: 'url(data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACLSURBVHgB7ZPBDYAgDEX/SI7AJjIKGziCozCKIzBChRiSHgoIlHjxJb3BexoA+GEQ0RYnxDmgDZNnPLQQ5BmDWSpyh1nSF66U7yTjShvOOFf65RVyzxaFWmREvgmLxUi3nG10rciw/E2kIrfooRAhFXlnxGKGRsRCg0LEQhMWSYdtsAJ6blHzdX/GDSY+GhmjX+BiAAAAAElFTkSuQmCC)'
      },
      // 为包含checkbox的li添加样式（通过JavaScript动态添加类名）
      'li.task-item-checked': {
        position: 'relative',
        paddingLeft: '1.5em',
        listStyle: 'none',
      },
      'li.task-item-checked::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        width: '16px',
        height: '16px',
        backgroundColor: '#1677ff',
        borderColor: '#1677ff',
        borderRadius: '2px',
        border: '1px solid',
        backgroundPosition: '1px 2px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '80%',
        backgroundImage: 'url(data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACLSURBVHgB7ZPBDYAgDEX/SO7AJjIKGziCozCKIzBChRiSHgoIlHjxJb3BexoA+GEQ0RYnxDmgDZNnPLQQ5BmDWSpyh1nSF66U7yTjShvOOFf65RVyzxaFWmREvgmLxUi3nG10rciw/E2kIrfooRAhFXlnxGKGRsRCg0LEQhMWSYdtsAJ6blHzdX/GDSY+GhmjX+BiAAAAAElFTkSuQmCC)'
      },
      'li.task-item-unchecked': {
        position: 'relative',
        paddingLeft: '1.5em',
        listStyle: 'none',
      },
      'li.task-item-unchecked::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        width: '16px',
        height: '16px',
        backgroundColor: 'transparent',
        border: '1px solid #d9d9d9',
        borderRadius: '2px'
      },
      
      // 普通列表项
      'li:not([data-task])': {
      },
      'li:not([data-task])::before': {
        content: '"•"',
        marginRight: '8px',
        fontSize: '16px',
        color: '#8e8e93',
      },
      
      // 有序列表
      'ol': {
        listStyle: 'none',
        padding: '0',
        margin: '4px 0', // 减少margin从16px到4px
        counterReset: 'apple-counter',
      },
      
      'ol li': {
        counterIncrement: 'apple-counter',
      },
      'ol li::before': {
        content: 'counter(apple-counter) "."',
        marginRight: '8px',
        fontSize: '16px',
        color: '#8e8e93',
        fontWeight: 500,
      },
      
      // 强调文本 - 增强产品复盘文章的视觉效果
      '.md-strong, strong': {
        color: '#ff9f0a !important', // Apple橙色，用于强调关键词如"问题："、"解决策略："
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 更高优先级的选择器，确保覆盖其他卡片组件的样式
      '.card-apple-notes .md-strong, .card-apple-notes strong': {
        color: '#ff9f0a !important',
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 最高优先级选择器，覆盖所有可能的样式冲突，包括styled-components
      'div.card.card-apple-notes .card-content .card-content-inner .md-strong, div.card.card-apple-notes .card-content .card-content-inner strong': {
        color: '#ff9f0a !important',
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 确保列表内的强调文本也有正确的样式
      'ul .md-strong, ul strong, ol .md-strong, ol strong, li .md-strong, li strong': {
        color: '#ff9f0a !important',
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 更高优先级的列表选择器，确保覆盖其他卡片组件的样式
      '.card-apple-notes ul .md-strong, .card-apple-notes ul strong, .card-apple-notes ol .md-strong, .card-apple-notes ol strong, .card-apple-notes li .md-strong, .card-apple-notes li strong': {
        color: '#ff9f0a !important',
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 最高优先级列表选择器，覆盖所有可能的样式冲突，包括styled-components
      'div.card.card-apple-notes .card-content .card-content-inner ul .md-strong, div.card.card-apple-notes .card-content .card-content-inner ul strong, div.card.card-apple-notes .card-content .card-content-inner ol .md-strong, div.card.card-apple-notes .card-content .card-content-inner ol strong, div.card.card-apple-notes .card-content .card-content-inner li .md-strong, div.card.card-apple-notes .card-content .card-content-inner li strong': {
        color: '#ff9f0a !important',
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 超高优先级选择器，针对所有可能的列表嵌套结构
      'div.card.card-apple-notes .card-content .card-content-inner ul li .md-strong, div.card.card-apple-notes .card-content .card-content-inner ul li strong, div.card.card-apple-notes .card-content .card-content-inner ol li .md-strong, div.card.card-apple-notes .card-content .card-content-inner ol li strong, div.card.card-apple-notes .card-content .card-content-inner li.md-listitem .md-strong, div.card.card-apple-notes .card-content .card-content-inner li.md-listitem strong': {
        color: '#ff9f0a !important',
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 终极优先级选择器，使用属性选择器和伪类
      'div.card.card-apple-notes .card-content .card-content-inner [class*="md-"] .md-strong, div.card.card-apple-notes .card-content .card-content-inner [class*="md-"] strong, div.card.card-apple-notes .card-content .card-content-inner .md-listitem .md-strong, div.card.card-apple-notes .card-content .card-content-inner .md-listitem strong': {
        color: '#ff9f0a !important',
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 使用CSS自定义属性和最高优先级选择器
      'div.card.card-apple-notes .card-content .card-content-inner': {
        '--apple-notes-bold-color': '#ff9f0a',
        '--apple-notes-bold-bg': 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%)',
      },
      
      // 使用CSS变量的超高优先级选择器
      'div.card.card-apple-notes .card-content .card-content-inner .md-strong[class], div.card.card-apple-notes .card-content .card-content-inner strong[class]': {
        color: 'var(--apple-notes-bold-color, #ff9f0a) !important',
        fontWeight: '700 !important',
        background: 'var(--apple-notes-bold-bg, linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%)) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      // 针对所有可能的强调文本，无论在什么容器中
      'div.card.card-apple-notes .card-content .card-content-inner *:not(code):not(pre) > .md-strong, div.card.card-apple-notes .card-content .card-content-inner *:not(code):not(pre) > strong': {
        color: '#ff9f0a !important',
        fontWeight: '700 !important',
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%) !important',
        padding: '2px 6px !important',
        borderRadius: '4px !important',
        fontSize: '16px !important',
      },
      
      '.md-em, em': {
        color: '#ffffff',
        fontStyle: 'italic',
      },
      
      // 分割线 - 增强产品复盘文章的视觉分隔效果
      '.md-hr, hr': {
        border: 'none',
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #2c2c2e 20%, #0a84ff 50%, #2c2c2e 80%, transparent 100%)',
        margin: '8px 0', // 减少margin从32px到8px
        borderRadius: '1px',
        boxShadow: '0 1px 3px rgba(10, 132, 255, 0.3)',
      },
      
      // 代码样式 - 增强技术术语和项目地址的可读性
      'code': {
        background: 'rgba(142, 142, 147, 0.12)',
        color: '#5ac8fa',
        padding: '3px 8px',
        borderRadius: '6px',
        fontFamily: 'SF Mono, Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace',
        fontSize: '14px',
        border: '1px solid rgba(142, 142, 147, 0.2)',
        fontWeight: 500,
      },
      
      // 代码块样式 - 增强代码展示效果
      'pre': {
        background: '#1a1a1a',
        color: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        overflow: 'auto',
        margin: '4px 0', // 减少margin从16px到4px
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
        fontSize: '14px',
        lineHeight: 1.4,
        border: '1px solid #2c2c2e',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
      'pre code': {
        background: 'transparent',
        border: 'none',
        padding: '0',
        color: '#ffffff',
      },
      
      // 链接样式 - 增强链接的视觉效果和交互体验
      'a': {
        color: '#5ac8fa',
        textDecoration: 'none',
        borderBottom: '1px solid rgba(90, 200, 250, 0.3)',
        transition: 'all 0.2s ease',
        fontWeight: 500,
      },
      'a:hover': {
        color: '#0a84ff',
        borderBottomColor: '#0a84ff',
        textDecoration: 'none',
      },

      // 产品复盘文章特殊样式
      // 文章末尾的hashtag标签样式
      'p:last-child': {
        textAlign: 'center',
        marginTop: '32px',
        paddingTop: '16px',
        borderTop: '1px solid #2c2c2e',
      },
      'p:last-child code': {
        background: 'linear-gradient(135deg, #0a84ff 0%, #5ac8fa 100%)',
        color: '#ffffff',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        marginRight: '6px',
        border: 'none',
        display: 'inline-block',
        marginBottom: '4px',
        boxShadow: '0 2px 4px rgba(10, 132, 255, 0.3)',
        transition: 'transform 0.2s ease',
      },
      'p:last-child code:hover': {
        transform: 'translateY(-1px)',
      },

      // 特殊引用框样式 (用于"最近花了几周时间..."这样的开头引用)
      'blockquote:first-of-type': {
        background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.1) 0%, rgba(90, 200, 250, 0.05) 100%)',
        borderLeft: '4px solid #0a84ff',
        padding: '16px 20px',
        margin: '20px 0',
        borderRadius: '0 8px 8px 0',
        position: 'relative',
      },
      'blockquote:first-of-type::before': {
        content: '"💭"',
        position: 'absolute',
        top: '12px',
        right: '16px',
        fontSize: '20px',
        opacity: 0.6,
      },

      // 表格样式 - 完整的表格设计系统
      'table, .md-table': {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        margin: '4px 0', // 减少margin从20px到4px
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
      },
      'th:last-child, .md-th:last-child': {
        borderRight: 'none',
      },
      'th::before, .md-th::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '2px',
        background: 'linear-gradient(90deg, #0a84ff 0%, #5ac8fa 100%)',
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
      },
      'td:last-child, .md-td:last-child': {
        borderRight: 'none',
      },
      
      'tr:hover td, .md-tr:hover .md-td': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      },
      'tr:last-child td, .md-tr:last-child .md-td': {
        borderBottom: 'none',
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
      },
      'table a:hover, .md-table a:hover': {
        textDecoration: 'underline',
        color: '#5ac8fa',
      },
      
      // 表格内的强调文本
      'table strong, .md-table strong': {
        color: '#ff9f0a', // 保持Apple橙色
        fontWeight: 700,
        background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '15px', // 稍微调整表格内的字体大小
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