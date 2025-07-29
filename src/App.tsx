import { useRef, useEffect } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import CardPreview from "./components/CardPreview";
import SettingsPanel from "./components/SettingsPanel";
import SideButtonPanel from "./components/SideButtonPanel";
import StickerPicker from "./components/StickerPicker";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import Split from "react-split";
import useThemeStore from "./stores/themeStore";
import useStickerStore from "./stores/stickerStore";
import { devLog, prodLog } from "./utils/logger";
import "./App.css";

function App() {
  const previewRef = useRef<HTMLDivElement>(null);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const { isPickerOpen, setPickerOpen } = useStickerStore();

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
        prodLog.error("Preview element not found");
      }
    } catch (error) {
      prodLog.error("Export failed:", error);
    }
  };

  return (
    <ErrorBoundary>
      <Layout onExport={handleExport}>
        <Split
          className="split flex-1"
          style={{ width: "calc(100% - 300px)" }}
          gutterAlign="start"
          gutterSize={10}
        >
          <div>
            <ErrorBoundary>
              <MarkdownEditor />
            </ErrorBoundary>
          </div>
          <div>
            <ErrorBoundary>
              <CardPreview ref={previewRef} />
            </ErrorBoundary>
          </div>
        </Split>
        <ErrorBoundary>
          <SettingsPanel />
        </ErrorBoundary>
        <ErrorBoundary>
          <SideButtonPanel previewRef={previewRef} />
        </ErrorBoundary>
      </Layout>
      
      {/* Sticker Picker Modal - Render at root level to avoid z-index issues */}
      {isPickerOpen && (
        <StickerPicker onClose={() => setPickerOpen(false)} />
      )}
    </ErrorBoundary>
  );
}

export default App;
