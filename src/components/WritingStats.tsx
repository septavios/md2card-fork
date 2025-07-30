import React, { useMemo } from 'react';
import { 
  FiFileText, 
  FiClock, 
  FiHash, 
  FiType, 
  FiBookOpen,
  FiTarget,
  FiTrendingUp,
  FiEdit3
} from 'react-icons/fi';
import useEditorStore from '../stores/editorStore';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  tooltip?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, color = 'var(--text-secondary)', tooltip }) => (
  <div 
    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105"
    style={{ 
      backgroundColor: 'var(--bg-tertiary)',
      border: '1px solid var(--border-color)'
    }}
    title={tooltip}
  >
    <div style={{ color }}>{icon}</div>
    <div className="flex flex-col">
      <span 
        className="text-xs font-medium"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <span 
        className="text-sm font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  </div>
);

const WritingStats: React.FC = () => {
  const { content } = useEditorStore();

  const stats = useMemo(() => {
    if (!content) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0,
        headings: 0,
        links: 0,
        codeBlocks: 0,
        lists: 0,
        images: 0,
        hashtags: 0
      };
    }

    // 基础统计
    const characters = content.length;
    const charactersNoSpaces = content.replace(/\s/g, '').length;
    
    // 中英文混合字数统计
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    const words = chineseChars + englishWords;
    
    // 段落和行数
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length;
    const lines = content.split('\n').length;
    
    // 阅读时间估算 (中文200字/分钟，英文250词/分钟)
    const readingTime = Math.ceil((chineseChars / 200 + englishWords / 250));
    
    // Markdown 元素统计
    const headings = (content.match(/^#{1,6}\s/gm) || []).length;
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length + (content.match(/`[^`]+`/g) || []).length;
    const lists = (content.match(/^[\s]*[-*+]\s/gm) || []).length + (content.match(/^[\s]*\d+\.\s/gm) || []).length;
    const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    
    // 社交媒体相关
    const hashtags = (content.match(/#[\u4e00-\u9fa5a-zA-Z0-9_]+/g) || []).length;

    return {
      characters,
      charactersNoSpaces,
      words,
      paragraphs,
      lines,
      readingTime,
      headings,
      links,
      codeBlocks,
      lists,
      images,
      hashtags
    };
  }, [content]);

  // 根据字数给出创作建议
  const getWritingAdvice = () => {
    if (stats.words === 0) return "开始你的创作吧！";
    if (stats.words < 50) return "继续加油，内容还可以更丰富";
    if (stats.words < 200) return "不错的开始，可以添加更多细节";
    if (stats.words < 500) return "内容充实，适合短文分享";
    if (stats.words < 1000) return "篇幅适中，很好的长度";
    return "内容丰富，考虑分段发布";
  };

  const getAdviceColor = () => {
    if (stats.words === 0) return '#8e8e93';
    if (stats.words < 200) return '#ff9f0a';
    if (stats.words < 500) return '#5ac8fa';
    return '#30d158';
  };

  return (
    <div 
      className="rounded-lg border"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* 紧凑的单行布局 */}
      <div className="flex items-center justify-between px-3 py-2">
        {/* 左侧：标题和主要统计 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FiEdit3 className="w-3 h-3" style={{ color: 'var(--text-primary)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>创作统计</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FiType className="w-3 h-3" style={{ color: '#5ac8fa' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{stats.words}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="w-3 h-3" style={{ color: '#ff9f0a' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{stats.readingTime}分</span>
            </div>
            <div className="flex items-center gap-1">
              <FiFileText className="w-3 h-3" style={{ color: '#30d158' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{stats.paragraphs}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiHash className="w-3 h-3" style={{ color: '#ff6b6b' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{stats.headings}</span>
            </div>
          </div>
        </div>

        {/* 右侧：创作建议 */}
        <div className="flex items-center gap-1">
          <FiTarget 
            className="w-3 h-3" 
            style={{ color: getAdviceColor() }} 
          />
          <span 
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {getWritingAdvice()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WritingStats;