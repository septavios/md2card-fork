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
        {/* 1. 公众号模式 toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>公众号模式</span>
          <ToggleSwitch id="public-mode" label="" checked={false} onChange={() => {}} />
        </div>

        {/* 2. Button group: 长图文, 自动拆分, 横线拆分 */}
        <div className="flex gap-2 mb-2">
          <button
            className={`flex-1 py-2 rounded-lg font-medium text-sm ${viewMode === '长卡片' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-purple-300'}`}
            onClick={() => setViewMode('长卡片')}
          >
            长图文
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-medium text-sm ${(viewMode === '短卡片' && layoutMode === '自动拆分') ? 'bg-purple-600 text-white' : 'bg-gray-800 text-purple-300'}`}
            onClick={() => { setViewMode('短卡片'); setLayoutMode('自动拆分'); }}
          >
            自动拆分
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-medium text-sm ${(viewMode === '短卡片' && layoutMode === '横线拆分') ? 'bg-purple-600 text-white' : 'bg-gray-800 text-purple-300'}`}
            onClick={() => { setViewMode('短卡片'); setLayoutMode('横线拆分'); }}
          >
            横线拆分
          </button>
        </div>

        {/* 3. Info/help text */}
        <div className="flex items-center text-xs text-purple-300 mb-2">
          <span className="mr-1">ℹ️</span>
          <span>单张卡片不拆分</span>
        </div>

        {/* 4. Size controls */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label htmlFor="card-width" className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>宽度</label>
              <div className="relative">
                <input id="card-width" type="number" value={cardWidth} onChange={e => setCardWidth(Number(e.target.value))} className="w-full text-xs border rounded-lg px-2 py-2 pr-8 focus:outline-none" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
              </div>
            </div>
            <div>
              <label htmlFor="card-height" className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>高度</label>
              <div className="relative">
                <input id="card-height" type="number" value={cardHeight} onChange={e => setCardHeight(Number(e.target.value))} className="w-full text-xs border rounded-lg px-2 py-2 pr-8 focus:outline-none" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">px</span>
              </div>
            </div>
          </div>
          <select id="aspect-ratio" className="w-full text-xs border rounded-lg p-2 focus:outline-none" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} value={aspectRatio} onChange={e => handleAspectRatioChange(e.target.value as AspectRatio)}>
            <option value="16:9">16:9 (宽屏)</option>
            <option value="4:3">4:3 (标准)</option>
            <option value="1:1">1:1 (正方形)</option>
            <option value="自定义">自定义尺寸</option>
          </select>
        </div>

        {/* 5. 高度超出隐藏 toggle */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>高度超出隐藏</span>
          <ToggleSwitch id="hide-overflow" label="" checked={hideOverflow} onChange={setHideOverflow} />
        </div>

        {/* 6. 显示页码 toggle */}
        {viewMode === '短卡片' && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>显示页码</span>
            <ToggleSwitch id="show-page-numbers" label="" checked={showPageNumbers} onChange={setShowPageNumbers} />
          </div>
        )}

        {/* 7. Theme dropdown (小红书帖子) */}
        <div className="mb-4">
          <label htmlFor="theme-select" className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>主题</label>
          <select id="theme-select" className="w-full text-xs border rounded-lg p-2 focus:outline-none" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} value={selectedTheme} onChange={e => handleThemeChange(e.target.value)}>
            {themeManager.getAllThemes().map(theme => (
              <option key={theme.id} value={theme.id}>{theme.name}</option>
            ))}
          </select>
        </div>

        {/* 8. Scale slider */}
        <div className="mb-4">
          <RangeSlider id="scale-slider" label="缩放" value={scale} onChange={setScale} min={50} max={150} unit="%" />
        </div>

        {/* 9. Font selection */}
        <div className="mb-4">
          <label htmlFor="font-family" className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>字体选择</label>
          <select id="font-family" className="w-full text-xs border rounded-lg p-2 focus:outline-none" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} value={selectedFont} onChange={e => setSelectedFont(e.target.value)}>
            {FONT_OPTIONS.map(font => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
