// 从相对路径导入ButtonGroup组件
import ButtonGroup from "./ButtonGroup";
import useThemeStore from "../stores/themeStore";

interface HeaderProps {
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport }) => {
  const { isDarkMode, showClock, setDarkMode, setShowClock } = useThemeStore();

  return (
    <header 
      className="h-[50px] flex flex-row justify-between items-center px-6 py-4 border-b shadow-sm"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 3px var(--shadow-color)'
      }}
    >
      <span 
        className="text-2xl font-bold tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        MD2Card
      </span>
      <ButtonGroup
        isDarkMode={isDarkMode}
        showClock={showClock}
        onDarkModeChange={setDarkMode}
        onShowClockChange={setShowClock}
        onExport={onExport}
      />
    </header>
  );
};

export default Header;
