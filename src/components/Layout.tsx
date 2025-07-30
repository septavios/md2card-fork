import { ReactNode } from "react";
import Header from "./Header";
import SettingsPanel from "./SettingsPanel";

interface LayoutProps {
  children: ReactNode;
  onExport: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onExport }) => {
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
          style={{ marginRight: '320px' }} // Account for fixed settings panel width (320px = w-80)
        >
          {children}
        </div>
        <SettingsPanel />
      </div>
    </div>
  );
};

export default Layout;
