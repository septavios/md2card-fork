import { ReactNode } from "react";
import Header from "./Header";
import SettingsPanel from "./SettingsPanel";
import useSettingsStore from "../stores/settingsStore";

interface LayoutProps {
  children: ReactNode;
  onExport: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onExport }) => {
  const { isSettingsPanelVisible, toggleSettingsPanel } = useSettingsStore();

  return (
    <div 
      className="h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Header onExport={onExport} />
      <div 
        className="flex flex-1"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div 
          className="flex-1"
          style={{ marginRight: isSettingsPanelVisible ? '320px' : '0px' }} // Conditional margin
        >
          {children}
        </div>
        {isSettingsPanelVisible && <SettingsPanel />}
        
        {/* Toggle button for settings panel */}
        <button
          onClick={toggleSettingsPanel}
          className="fixed top-1/2 right-2 z-50 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200"
          style={{
            transform: 'translateY(-50%)',
            right: isSettingsPanelVisible ? '330px' : '10px'
          }}
          title="配置面板"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="transition-transform duration-200"
          >
            {/* Bookmark icon */}
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Layout;
