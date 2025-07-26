import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  onExport: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onExport }) => {
  return (
    <div 
      className="h-screen w-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Header onExport={onExport} />
      <div
        className="flex-1 flex gap-4"
        style={{
          height: "calc(100% - 50px)",
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
