import { ThemeConfig } from '../themeConfig';

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
      // Header styles
      '.card-header': {
        background: '#18181b',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '0.5px solid rgba(84, 84, 88, 0.6)',
        position: 'relative',
        zIndex: '10',
      },
      
      // Back button
      '.header-back-button': {
        color: '#facc15',
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
        flex: '0 0 auto',
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
      
      // Action buttons
      '.header-action-buttons': {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flex: '0 0 auto',
        marginLeft: 'auto',
      },
      
      '.header-action-button': {
        color: '#facc15',
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
      
      // Content area
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
      
      // Typography
      'h1, .md-h1': {
        color: '#0a84ff',
        fontSize: '28px',
        fontWeight: 700,
        marginTop: '0',
        marginBottom: '16px',
        lineHeight: 1.2,
        paddingBottom: '8px',
        borderBottom: '2px solid #2c2c2e',
      },
      
      'h2, .md-h2': {
        color: '#0a84ff',
        fontSize: '22px',
        fontWeight: 600,
        marginTop: '32px',
        marginBottom: '16px',
        lineHeight: 1.3,
        paddingBottom: '6px',
        borderBottom: '1px solid #2c2c2e',
      },
      
      'h3, .md-h3': {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 600,
        marginTop: '24px',
        marginBottom: '12px',
        lineHeight: 1.4,
      },
      
      // Paragraphs and text
      'p': {
        color: '#ffffff',
        fontSize: '16px',
        lineHeight: 1.6,
        marginBottom: '16px',
        fontWeight: 400,
      },
      
      // Lists
      'ul, ol': {
        color: '#ffffff',
        fontSize: '16px',
        lineHeight: 1.6,
        marginBottom: '16px',
        paddingLeft: '20px',
      },
      
      'li': {
        marginBottom: '8px',
        color: '#ffffff',
      },
      
      // Code
      'code': {
        backgroundColor: '#2c2c2e',
        color: '#0a84ff',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
      },
      
      'pre': {
        backgroundColor: '#2c2c2e',
        color: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        overflow: 'auto',
        marginBottom: '16px',
        fontSize: '14px',
        lineHeight: 1.4,
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
      },
      
      // Blockquotes
      'blockquote': {
        borderLeft: '4px solid #0a84ff',
        paddingLeft: '16px',
        marginLeft: '0',
        marginBottom: '16px',
        color: '#8e8e93',
        fontStyle: 'italic',
      },
      
      // Links
      'a': {
        color: '#0a84ff',
        textDecoration: 'none',
      },
      
      'a:hover': {
        textDecoration: 'underline',
      },
      
      // Tables
      'table': {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '16px',
        color: '#ffffff',
      },
      
      'th, td': {
        padding: '8px 12px',
        textAlign: 'left',
        borderBottom: '1px solid #2c2c2e',
      },
      
      'th': {
        fontWeight: 600,
        color: '#0a84ff',
        backgroundColor: '#1c1c1e',
      },
    },
  },
};