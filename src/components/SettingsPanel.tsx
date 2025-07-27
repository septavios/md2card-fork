import React, { useState } from "react";
import useSettingsStore, { LayoutMode, AspectRatio, BackgroundType } from "../stores/settingsStore";
import { themeManager } from "../config/themeManager";
import CustomThemePanel from "./CustomThemePanel";

// Available fonts
const FONT_OPTIONS = [
  // 系统默认字体
  { value: "Inter, Arial, sans-serif", label: "Inter (默认)" },
  { value: "system-ui, -apple-system, sans-serif", label: "系统字体" },
  
  // 中文优化字体
  { value: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif", label: "苹方 (PingFang SC)" },
  { value: "'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif", label: "微软雅黑" },
  { value: "'Hiragino Sans GB', 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "冬青黑体" },
  { value: "'Source Han Sans SC', 'Noto Sans CJK SC', sans-serif", label: "思源黑体" },
  { value: "'Noto Sans SC', 'Source Han Sans SC', sans-serif", label: "Noto Sans SC" },
  
  // 衬线字体
  { value: "'Songti SC', 'SimSun', 'Times New Roman', serif", label: "宋体" },
  { value: "'STSong', 'SimSun', 'Times New Roman', serif", label: "华文宋体" },
  { value: "'Kaiti SC', 'KaiTi', 'Times New Roman', serif", label: "楷体" },
  { value: "'STKaiti', 'KaiTi', 'Times New Roman', serif", label: "华文楷体" },
  { value: "'STFangsong', 'FangSong', 'Times New Roman', serif", label: "华文仿宋" },
  { value: "Georgia, 'Times New Roman', serif", label: "Georgia" },
  
  // 等宽字体
  { value: "'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', monospace", label: "SF Mono" },
  { value: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", label: "JetBrains Mono" },
  { value: "'Cascadia Code', 'Consolas', 'Monaco', monospace", label: "Cascadia Code" },
  { value: "'Fira Code', 'Monaco', 'Consolas', monospace", label: "Fira Code" },
  
  // 现代无衬线字体
  { value: "Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "Roboto" },
  { value: "'Open Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "Open Sans" },
  { value: "Lato, 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "Lato" },
  { value: "Montserrat, 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "Montserrat" },
  { value: "'Source Sans Pro', 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "Source Sans Pro" },
  { value: "Poppins, 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "Poppins" },
  { value: "Nunito, 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "Nunito" },
  { value: "'PT Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "PT Sans" },
  { value: "Ubuntu, 'PingFang SC', 'Microsoft YaHei', sans-serif", label: "Ubuntu" },
  
  // 艺术字体
  { value: "'Noto Serif SC', 'Source Han Serif SC', serif", label: "Noto Serif SC" },
  { value: "'Source Han Serif SC', 'Noto Serif SC', serif", label: "思源宋体" },
];

// Texture patterns with categories and preview data
const TEXTURE_CATEGORIES = [
  { id: "nature", name: "nature" },
  { id: "landscape", name: "landscape" },
  { id: "abstract", name: "abstract" },
  { id: "texture", name: "texture" },
  { id: "minimal", name: "minimal" },
  { id: "pattern", name: "pattern" },
  { id: "wood", name: "wood" },
  { id: "marble", name: "marble" },
  { id: "paper", name: "paper" },
  { id: "watercolor", name: "watercolor" }
];

const NATURE_TEXTURES = [
  // Row 1 - 自然风景
  { 
    id: "nature-field", 
    category: "nature", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "nature-tree", 
    category: "nature", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "nature-mountain", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },

  // Row 2
  { 
    id: "landscape-sky", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "nature-waterfall", 
    category: "nature", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "landscape-desert", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },

  // Row 3
  { 
    id: "nature-palm", 
    category: "nature", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "landscape-lake", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "landscape-cliff", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },

  // Row 4
  { 
    id: "nature-forest", 
    category: "nature", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "landscape-ocean", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "landscape-sunset", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },

  // Row 5
  { 
    id: "nature-hills", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "nature-meadow", 
    category: "nature", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "landscape-river", 
    category: "landscape", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  }
];

const PATTERN_TEXTURES = [
  // Row 1 - 几何图案
  { 
    id: "pattern-geometric", 
    category: "pattern", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <pattern id="triangles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,16 2,16" fill="#E0E0E0"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="white"/>
        <rect width="100" height="100" fill="url(#triangles)"/>
      </svg>
    `) + "')"
  },
  { 
    id: "pattern-colorful", 
    category: "pattern", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "pattern-paper", 
    category: "paper", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },

  // Row 2
  { 
    id: "pattern-diamond", 
    category: "pattern", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <pattern id="diamonds" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,0 20,10 10,20 0,10" fill="none" stroke="#B0B0B0" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="#F0F0F0"/>
        <rect width="100" height="100" fill="url(#diamonds)"/>
      </svg>
    `) + "')"
  },
  { 
    id: "pattern-hexagon", 
    category: "pattern", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <pattern id="hexagons" x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse">
            <polygon points="15,2 25,8 25,18 15,24 5,18 5,8" fill="none" stroke="#8E8E93" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="#F2F2F7"/>
        <rect width="100" height="100" fill="url(#hexagons)"/>
      </svg>
    `) + "')"
  },
  { 
    id: "pattern-wave", 
    category: "pattern", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0,10 Q10,0 20,10 T40,10" fill="none" stroke="#333" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="white"/>
        <rect width="100" height="100" fill="url(#waves)"/>
      </svg>
    `) + "')"
  },

  // Row 3
  { 
    id: "pattern-ornate", 
    category: "pattern", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "pattern-gradient", 
    category: "abstract", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "pattern-nature", 
    category: "nature", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },

  // Row 4
  { 
    id: "pattern-wood", 
    category: "wood", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "pattern-marble", 
    category: "marble", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
    `) + "')"
  },
  { 
    id: "pattern-dark", 
    category: "minimal", 
    preview: "url('data:image/svg+xml;base64," + btoa(`
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
  }
];

// 合并所有纹理预设
const TEXTURE_PRESETS = [...NATURE_TEXTURES, ...PATTERN_TEXTURES];

// Legacy texture patterns for backward compatibility
const TEXTURE_PATTERNS = [
  "none", "dots", "grid", "lines", "diagonal", "crosshatch"
];

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, id }) => (
  <div className="flex items-center justify-between py-2">
    <label 
      htmlFor={id}
      className="text-sm font-medium cursor-pointer"
      style={{ color: 'var(--text-primary)' }}
    >
      {label}
    </label>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-105"
      style={{
        backgroundColor: checked ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
        boxShadow: checked ? '0 2px 8px rgba(139, 92, 246, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full transform transition-all duration-300 ${checked ? "translate-x-6" : "translate-x-0.5"}`}
        style={{ 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
        }}
      />
    </button>
  </div>
);

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  unit?: string;
  id: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ 
  value, onChange, min, max, step = 1, label, unit = "", id 
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label 
        htmlFor={id}
        className="text-sm font-medium"
        style={{ color: 'var(--text-primary)' }}
      >
        {label}
      </label>
      <span 
        className="text-sm font-semibold px-2 py-1 rounded-md"
        style={{ 
          color: 'var(--accent-primary)',
          backgroundColor: 'var(--bg-tertiary)'
        }}
      >
        {value}{unit}
      </span>
    </div>
    <div className="relative">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 range-slider"
        style={{
          background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${((value - min) / (max - min)) * 100}%, var(--bg-tertiary) ${((value - min) / (max - min)) * 100}%, var(--bg-tertiary) 100%)`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .range-slider::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--accent-primary);
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
            transition: all 0.2s ease;
          }
          .range-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 8px rgba(139, 92, 246, 0.4);
          }
          .range-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--accent-primary);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
            transition: all 0.2s ease;
          }
          .range-slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 8px rgba(139, 92, 246, 0.4);
          }
        `
      }} />
    </div>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const Section: React.FC<SectionProps> = ({ 
  title, 
  children, 
  collapsible = false, 
  isExpanded: externalIsExpanded,
  onToggle 
}) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(true);
  
  // 使用外部状态（如果提供）或内部状态
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  
  const handleToggle = () => {
    const newExpanded = !isExpanded;
    if (onToggle) {
      onToggle(newExpanded);
    } else {
      setInternalIsExpanded(newExpanded);
    }
  };

  return (
    <div 
      className="rounded-xl border transition-all duration-200 hover:shadow-md"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ 
              color: 'var(--text-primary)',
              letterSpacing: '0.05em'
            }}
          >
            {title}
          </h3>
          {collapsible && (
            <button
              onClick={handleToggle}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-1"
              style={{ 
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? '收起' : '展开'}</span>
              <svg 
                className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsPanel: React.FC = () => {
  const {
    // Existing settings
    cardWidth,
    cardHeight,
    viewMode,
    hideOverflow,
    selectedTheme,
    setCardWidth,
    setCardHeight,
    setViewMode,
    setHideOverflow,
    setSelectedTheme,
    
    // New settings
    showPageNumbers,
    layoutMode,
    aspectRatio,
    scale,
    selectedFont,
    fontSize,
    lineHeight,
    background,
    setShowPageNumbers,
    setLayoutMode,
    setAspectRatio,
    setScale,
    setSelectedFont,
    setFontSize,
    setLineHeight,
    setBackground,
    
    // User customization management
    resetToThemeDefaults,
  } = useSettingsStore();

  // const [expandedBackgroundSection, setExpandedBackgroundSection] = useState<BackgroundType | null>(background.type);

  // 管理可折叠section的展开状态
  const [isBackgroundSectionExpanded, setIsBackgroundSectionExpanded] = useState(false);
  const [isCustomThemePanelOpen, setIsCustomThemePanelOpen] = useState(false);

  // 处理主题选择的智能配置优先级系统
  const handleThemeChange = (newTheme: string) => {
    if (newTheme !== selectedTheme) {
      // 切换到不同主题时，重置用户自定义设置并应用新主题
      resetToThemeDefaults();
      
      // 收起所有展开的菜单
      setIsBackgroundSectionExpanded(false);
      // setExpandedBackgroundSection(null);
    }
    setSelectedTheme(newTheme);
  };

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setAspectRatio(ratio);
    if (ratio !== "自定义") {
      // Auto-calculate dimensions based on aspect ratio
      const baseWidth = 440;
      switch (ratio) {
        case "16:9":
          setCardWidth(baseWidth);
          setCardHeight(Math.round(baseWidth * 9 / 16));
          break;
        case "4:3":
          setCardWidth(baseWidth);
          setCardHeight(Math.round(baseWidth * 3 / 4));
          break;
        case "1:1":
          setCardWidth(baseWidth);
          setCardHeight(baseWidth);
          break;
      }
    }
  };

  return (
    <div 
      className="fixed right-0 top-0 h-full w-80 shadow-2xl border-l overflow-y-auto backdrop-blur-sm"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        zIndex: 1000,
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)'
      }}
      role="complementary"
      aria-label="设置面板"
    >
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="border-b pb-5 mb-6" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--accent-primary)',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 
                className="text-lg font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                设置面板
              </h2>
              <p 
                className="text-xs mt-1"
                style={{ color: 'var(--text-muted)' }}
              >
                自定义您的卡片设计
              </p>
            </div>
          </div>
        </div>

        {/* Layout Mode */}
        <Section title="布局模式">
          <div className="space-y-4">
            <div 
              className="flex rounded-xl p-1.5 shadow-inner"
              style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}
              role="radiogroup"
              aria-label="选择布局模式"
            >
              {(["长卡片", "短卡片"] as const).map((tab) => (
                <button
                  key={tab}
                  role="radio"
                  aria-checked={viewMode === tab}
                  className="flex-1 py-2.5 text-sm rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-[0.98]"
                  style={{
                    backgroundColor: viewMode === tab ? 'var(--accent-primary)' : 'transparent',
                    color: viewMode === tab ? 'white' : 'var(--text-secondary)',
                    boxShadow: viewMode === tab ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                  onClick={() => setViewMode(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div 
              className="flex rounded-xl p-1.5 shadow-inner"
              style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}
              role="radiogroup"
              aria-label="选择拆分模式"
            >
              {(["自动拆分", "横线拆分"] as LayoutMode[]).map((mode) => (
                <button
                  key={mode}
                  role="radio"
                  aria-checked={layoutMode === mode}
                  className="flex-1 py-2.5 text-sm rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-[0.98]"
                  style={{
                    backgroundColor: layoutMode === mode ? 'var(--accent-primary)' : 'transparent',
                    color: layoutMode === mode ? 'white' : 'var(--text-secondary)',
                    boxShadow: layoutMode === mode ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                  onClick={() => setLayoutMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Size Settings */}
        <Section title="尺寸">
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="aspect-ratio"
                className="block text-sm font-medium mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                设计尺寸
              </label>
              <select 
                id="aspect-ratio"
                className="w-full text-sm border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:border-purple-300"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                value={aspectRatio}
                onChange={(e) => handleAspectRatioChange(e.target.value as AspectRatio)}
              >
                <option value="16:9">16:9 (宽屏)</option>
                <option value="4:3">4:3 (标准)</option>
                <option value="1:1">1:1 (正方形)</option>
                <option value="自定义">自定义尺寸</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label 
                  htmlFor="card-width"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  宽度
                </label>
                <div className="relative">
                  <input
                    id="card-width"
                    type="number"
                    value={cardWidth}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setCardWidth(value);
                      }
                    }}
                    className="w-full text-sm border rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: aspectRatio !== "自定义" ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    disabled={aspectRatio !== "自定义"}
                  />
                  <span 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm pointer-events-none"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    px
                  </span>
                </div>
              </div>
              <div>
                <label 
                  htmlFor="card-height"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  高度
                </label>
                <div className="relative">
                  <input
                    id="card-height"
                    type="number"
                    value={cardHeight}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setCardHeight(value);
                      }
                    }}
                    className="w-full text-sm border rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: (viewMode === "长卡片" || aspectRatio !== "自定义") ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      opacity: (viewMode === "长卡片" || aspectRatio !== "自定义") ? 0.6 : 1
                    }}
                    disabled={viewMode === "长卡片" || aspectRatio !== "自定义"}
                  />
                  <span 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm pointer-events-none"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    px
                  </span>
                </div>
              </div>
            </div>

            <RangeSlider
              id="scale-slider"
              label="缩放"
              value={scale}
              onChange={setScale}
              min={50}
              max={150}
              unit="%"
            />
          </div>
        </Section>

        {/* Display Options */}
        <Section title="显示选项">
          {/* 只在短卡片（分页）模式下显示页码选项 */}
          {viewMode === "短卡片" && (
            <ToggleSwitch
              id="show-page-numbers"
              label="显示页码"
              checked={showPageNumbers}
              onChange={setShowPageNumbers}
            />
          )}
          <ToggleSwitch
            id="hide-overflow"
            label="高度超出隐藏"
            checked={hideOverflow}
            onChange={setHideOverflow}
          />
        </Section>

        {/* Font Settings */}
        <Section title="字体选择">
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="font-family"
                className="block text-sm font-medium mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                字体系列
              </label>
              <select 
                id="font-family"
                className="w-full text-sm border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:border-purple-300"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                value={selectedFont}
                onChange={(e) => {
                  setSelectedFont(e.target.value);
                  // Do NOT reset theme or background here
                }}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <RangeSlider
              id="font-size-slider"
              label="字体大小"
              value={fontSize}
              onChange={setFontSize}
              min={10}
              max={24}
              unit="px"
            />

            <RangeSlider
              id="line-height-slider"
              label="行高"
              value={lineHeight}
              onChange={setLineHeight}
              min={1.0}
              max={2.5}
              step={0.1}
            />
          </div>
        </Section>

        {/* Theme Selection */}
        <Section title="主题选择">
          <div className="space-y-3">
            <div className="relative">
              <select
                id="theme-select"
                className="w-full text-sm border rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:border-purple-300 appearance-none"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                value={selectedTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
              >
                {themeManager.getAllThemes().map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Custom Theme Management Button */}
            <button
              onClick={() => setIsCustomThemePanelOpen(true)}
              className="w-full py-2.5 px-3 text-sm font-medium rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                color: 'var(--accent-primary)',
                borderColor: 'var(--accent-primary)',
                backgroundColor: 'transparent'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                管理自定义主题
              </div>
            </button>
            
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              选择主题将重置自定义设置
            </p>
          </div>
        </Section>

        {/* Background Settings */}
        <Section 
          title="自定义背景" 
          collapsible 
          isExpanded={isBackgroundSectionExpanded}
          onToggle={setIsBackgroundSectionExpanded}
        >
          <div className="space-y-5">
            {/* Background Type Selector */}
            <div 
              className="grid grid-cols-2 gap-2 p-1.5 rounded-xl shadow-inner"
              style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}
              role="radiogroup"
              aria-label="选择背景类型"
            >
              {(["solid", "gradient", "texture", "image"] as BackgroundType[]).map((type) => (
                <button
                  key={type}
                  role="radio"
                  aria-checked={background.type === type}
                  className="py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-[0.98]"
                  style={{
                    backgroundColor: background.type === type ? 'var(--accent-primary)' : 'transparent',
                    color: background.type === type ? 'white' : 'var(--text-secondary)',
                    boxShadow: background.type === type ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                  onClick={() => {
                    setBackground({ type });
                    // setExpandedBackgroundSection(type);
                  }}
                >
                  {type === "solid" ? "纯色" : 
                   type === "gradient" ? "渐变" :
                   type === "texture" ? "纹理" : "图片"}
                </button>
              ))}
            </div>

            {/* Background Options */}
            {background.type === "solid" && (
              <div className="space-y-3">
                <div>
                  <label 
                    className="block text-sm mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    纯色背景
                  </label>
                  
                  {/* Color Preset Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {[
                      // 第一行 - 基础色系
                      '#ffffff', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#ef4444',
                      // 第二行 - 暖色调
                      '#fb923c', '#fbbf24', '#a3e635', '#22c55e', '#10b981', '#f472b6', '#f87171',
                      // 第三行 - 浅色调
                      '#fed7aa', '#fef3c7', '#dcfce7', '#bbf7d0', '#a7f3d0', '#67e8f9', '#93c5fd',
                      // 第四行 - 深色调
                      '#1e293b', '#7c3aed', '#ec4899', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
                      // 第五行 - 紫色系和深色
                      '#8b5cf6', '#a855f7', '#c084fc', '#e879f9', '#fbbf24', '#f59e0b', '#d97706'
                    ].map((color, index) => (
                      <button
                        key={index}
                        className="w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                        style={{
                          backgroundColor: color,
                          borderColor: background.solidColor === color 
                            ? 'var(--accent-color)' 
                            : color === '#ffffff' ? 'var(--border-color)' : 'transparent',
                          borderWidth: background.solidColor === color ? '2px' : '1px'
                        }}
                        onClick={() => setBackground({ 
                          type: 'solid',
                          solidColor: color 
                        })}
                        title={`颜色: ${color}`}
                      />
                    ))}
                  </div>

                  {/* Custom Color Picker */}
                  <div>
                    <label 
                      htmlFor="solid-color"
                      className="block text-sm mb-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      自定义颜色
                    </label>
                    <input
                      id="solid-color"
                      type="color"
                      value={background.solidColor}
                      onChange={(e) => setBackground({ solidColor: e.target.value })}
                      className="w-full h-10 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {background.type === "gradient" && (
              <div className="space-y-3">
                {/* Gradient Presets */}
                <div>
                  <label 
                    className="block text-sm mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    渐变背景
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { start: '#667eea', end: '#764ba2', name: '紫蓝渐变' },
                      { start: '#f093fb', end: '#f5576c', name: '粉红渐变' },
                      { start: '#4facfe', end: '#00f2fe', name: '青蓝渐变' },
                      { start: '#43e97b', end: '#38f9d7', name: '绿青渐变' },
                      { start: '#fa709a', end: '#fee140', name: '粉黄渐变' },
                      { start: '#a8edea', end: '#fed6e3', name: '薄荷粉渐变' },
                      { start: '#ffecd2', end: '#fcb69f', name: '桃橙渐变' },
                      { start: '#ff9a9e', end: '#fecfef', name: '粉色渐变' },
                      { start: '#ff6b6b', end: '#feca57', name: '红黄渐变' },
                      { start: '#48cae4', end: '#0077b6', name: '海蓝渐变' },
                      { start: '#c471f5', end: '#fa71cd', name: '紫粉渐变' },
                      { start: '#74b9ff', end: '#0984e3', name: '天蓝渐变' }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        className="w-full h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                          borderColor: (background.gradientStart === preset.start && background.gradientEnd === preset.end) 
                            ? 'var(--accent-primary)' 
                            : 'transparent'
                        }}
                        onClick={() => setBackground({ 
                          type: 'gradient',
                          gradientStart: preset.start, 
                          gradientEnd: preset.end,
                          gradientDirection: 135
                        })}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Gradient Controls */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label 
                      htmlFor="gradient-start"
                      className="block text-sm mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      起始色
                    </label>
                    <input
                      id="gradient-start"
                      type="color"
                      value={background.gradientStart}
                      onChange={(e) => setBackground({ gradientStart: e.target.value })}
                      className="w-full h-10 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="gradient-end"
                      className="block text-sm mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      结束色
                    </label>
                    <input
                      id="gradient-end"
                      type="color"
                      value={background.gradientEnd}
                      onChange={(e) => setBackground({ gradientEnd: e.target.value })}
                      className="w-full h-10 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                  </div>
                </div>
                <RangeSlider
                  id="gradient-direction-slider"
                  label="方向"
                  value={background.gradientDirection}
                  onChange={(direction) => setBackground({ gradientDirection: direction })}
                  min={0}
                  max={360}
                  unit="°"
                />
              </div>
            )}

            {background.type === "texture" && (
              <div className="space-y-4">
                {/* Category Tags */}
                <div>
                  <label 
                    className="block text-sm mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    纹理背景
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {TEXTURE_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        className="px-3 py-1 text-xs rounded-full border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Texture Preview Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {TEXTURE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className="aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden relative group"
                      style={{
                        background: preset.preview,
                        borderColor: background.texturePattern === preset.id 
                          ? 'var(--accent-color)' 
                          : 'var(--border-color)',
                        boxShadow: background.texturePattern === preset.id 
                          ? '0 0 0 2px var(--accent-color)' 
                          : 'none'
                      }}
                      onClick={() => setBackground({ 
                        type: 'texture',
                        texturePattern: preset.id
                      })}
                      title={`${preset.category} - ${preset.id}`}
                    >
                      {/* Readability indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div 
                          className="text-xs px-2 py-1 rounded backdrop-blur-sm"
                          style={{ 
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white'
                          }}
                        >
                          预览
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Readability Enhancement Controls */}
                <div className="space-y-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    可读性增强
                  </h4>
                  
                  {/* Text Overlay Options */}
                  <div>
                    <label 
                      className="block text-sm mb-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      文本背景
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="py-2 px-3 text-xs rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          backgroundColor: background.textOverlay === 'none' ? 'var(--accent-color)' : 'var(--bg-primary)',
                          color: background.textOverlay === 'none' ? 'white' : 'var(--text-primary)',
                          borderColor: 'var(--border-color)'
                        }}
                        onClick={() => setBackground({ textOverlay: 'none' })}
                      >
                        无
                      </button>
                      <button
                        className="py-2 px-3 text-xs rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          backgroundColor: background.textOverlay === 'semi-transparent' ? 'var(--accent-color)' : 'var(--bg-primary)',
                          color: background.textOverlay === 'semi-transparent' ? 'white' : 'var(--text-primary)',
                          borderColor: 'var(--border-color)'
                        }}
                        onClick={() => setBackground({ textOverlay: 'semi-transparent' })}
                      >
                        半透明
                      </button>
                      <button
                        className="py-2 px-3 text-xs rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          backgroundColor: background.textOverlay === 'blur' ? 'var(--accent-color)' : 'var(--bg-primary)',
                          color: background.textOverlay === 'blur' ? 'white' : 'var(--text-primary)',
                          borderColor: 'var(--border-color)'
                        }}
                        onClick={() => setBackground({ textOverlay: 'blur' })}
                      >
                        模糊
                      </button>
                      <button
                        className="py-2 px-3 text-xs rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          backgroundColor: background.textOverlay === 'gradient' ? 'var(--accent-color)' : 'var(--bg-primary)',
                          color: background.textOverlay === 'gradient' ? 'white' : 'var(--text-primary)',
                          borderColor: 'var(--border-color)'
                        }}
                        onClick={() => setBackground({ textOverlay: 'gradient' })}
                      >
                        渐变遮罩
                      </button>
                    </div>
                  </div>

                  {/* Contrast Enhancement */}
                  <RangeSlider
                    id="texture-contrast-slider"
                    label="对比度增强"
                    value={background.contrastBoost || 0}
                    onChange={(contrastBoost) => setBackground({ contrastBoost })}
                    min={0}
                    max={100}
                    unit="%"
                  />

                  {/* Blur Effect */}
                  <RangeSlider
                    id="texture-blur-slider"
                    label="背景模糊"
                    value={background.blurAmount || 0}
                    onChange={(blurAmount) => setBackground({ blurAmount })}
                    min={0}
                    max={10}
                    unit="px"
                  />
                </div>

                {/* Legacy Pattern Selector */}
                <div>
                  <label 
                    htmlFor="texture-pattern"
                    className="block text-sm mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    传统图案
                  </label>
                  <select 
                    id="texture-pattern"
                    className="w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                    value={TEXTURE_PATTERNS.includes(background.texturePattern) ? background.texturePattern : "none"}
                    onChange={(e) => setBackground({ texturePattern: e.target.value })}
                  >
                    {TEXTURE_PATTERNS.map((pattern) => (
                      <option key={pattern} value={pattern}>
                        {pattern === "none" ? "无" :
                         pattern === "dots" ? "圆点" :
                         pattern === "grid" ? "网格" :
                         pattern === "lines" ? "线条" :
                         pattern === "diagonal" ? "斜线" :
                         pattern === "crosshatch" ? "交叉线" : pattern}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {background.type === "image" && (
              <div>
                <label 
                  htmlFor="image-url"
                  className="block text-sm mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  图片URL
                </label>
                <input
                  id="image-url"
                  type="url"
                  value={background.imageUrl}
                  onChange={(e) => setBackground({ imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                />
              </div>
            )}

            {/* Opacity Control */}
            <RangeSlider
              id="background-opacity-slider"
              label="透明度"
              value={background.opacity}
              onChange={(opacity) => setBackground({ opacity })}
              min={0}
              max={100}
              unit="%"
            />
          </div>
        </Section>
      </div>
      
      {/* Custom Theme Panel */}
      {isCustomThemePanelOpen && (
        <CustomThemePanel 
          isOpen={isCustomThemePanelOpen}
          onClose={() => setIsCustomThemePanelOpen(false)}
        />
      )}
    </div>
  );
};

export default SettingsPanel;
