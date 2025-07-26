import { FiSun, FiMoon, FiClock } from "react-icons/fi";

interface ButtonGroupProps {
  isDarkMode: boolean;
  showClock: boolean;
  onDarkModeChange: (isDark: boolean) => void;
  onShowClockChange: (show: boolean) => void;
  onExport: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  isDarkMode,
  showClock,
  onDarkModeChange,
  onShowClockChange,
  onExport,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onDarkModeChange(!isDarkMode)}
        className="p-2 rounded-full transition-colors"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
      >
        {isDarkMode ? (
          <FiSun className="w-5 h-5" />
        ) : (
          <FiMoon className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={() => onShowClockChange(!showClock)}
        className="p-2 rounded-full transition-colors"
        style={{
          backgroundColor: showClock ? 'var(--accent-primary)' : 'transparent',
          color: showClock ? 'white' : 'var(--text-secondary)'
        }}
        onMouseEnter={(e) => {
          if (!showClock) {
            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!showClock) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        title={showClock ? "隐藏时钟" : "显示时钟"}
      >
        <FiClock className="w-5 h-5" />
      </button>
      <button
        onClick={onExport}
        className="px-6 py-2 rounded-md transition-colors font-medium shadow-sm"
        style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
        }}
      >
        导出为PNG
      </button>
    </div>
  );
};

export default ButtonGroup;
