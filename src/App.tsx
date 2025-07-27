import { useRef, useEffect } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import CardPreview from "./components/CardPreview";
import SettingsPanel from "./components/SettingsPanel";
import SideButtonPanel from "./components/SideButtonPanel";
import Layout from "./components/Layout";
import Split from "react-split";
import useThemeStore from "./stores/themeStore";
import "./App.css";

function App() {
  const previewRef = useRef<HTMLDivElement>(null);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    // Initialize theme on app mount
    initializeTheme();
  }, [initializeTheme]);

  const handleExport = async () => {
    try {
      if (previewRef.current) {
        const htmlToImage = await import("html-to-image");
        const dataUrl = await htmlToImage.toPng(previewRef.current);
        const link = document.createElement("a");
        link.download = "md2card.png";
        link.href = dataUrl;
        link.click();
      } else {
        console.error("Preview element not found");
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <Layout onExport={handleExport}>
      <Split
        className="split flex-1"
        style={{ width: "calc(100% - 300px)" }}
        gutterAlign="start"
        gutterSize={10}
      >
        <div>
          <MarkdownEditor />
        </div>
        <div>
          <CardPreview ref={previewRef} />
        </div>
      </Split>
      <SettingsPanel />
      <SideButtonPanel previewRef={previewRef} />
    </Layout>
  );
}

export default App;
