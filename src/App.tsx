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
import useSettingsStore from "./stores/settingsStore";
import useStickerStore from "./stores/stickerStore";
import { devLog, prodLog } from "./utils/logger";
import "./App.css";

function App() {
  const previewRef = useRef<HTMLDivElement>(null);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const { isSettingsPanelVisible } = useSettingsStore();
  const { isPickerOpen, setPickerOpen } = useStickerStore();

  useEffect(() => {
    // Initialize theme on app mount
    initializeTheme();
  }, [initializeTheme]);

  const handleExport = async () => {
    try {
      if (previewRef.current) {
        const htmlToImage = await import("html-to-image");
        
        // Store original styles
        const originalStyles = new Map();
        const elementsToAdjust = [
          previewRef.current,
          ...Array.from(previewRef.current.querySelectorAll('.export-content, .card, .card-content, .card-content-inner'))
        ];
        
        // Temporarily adjust styles to prevent truncation
        elementsToAdjust.forEach(element => {
          if (element instanceof HTMLElement) {
            originalStyles.set(element, {
              overflow: element.style.overflow,
              maxWidth: element.style.maxWidth,
              width: element.style.width,
              whiteSpace: element.style.whiteSpace,
              wordWrap: element.style.wordWrap,
              minWidth: element.style.minWidth,
              flexShrink: element.style.flexShrink,
              flexBasis: element.style.flexBasis
            });
            
            // Apply styles to ensure full content is captured
            element.style.overflow = 'visible';
            element.style.maxWidth = 'none';
            element.style.whiteSpace = 'normal';
            element.style.wordWrap = 'break-word';
            element.style.flexShrink = '0';
            element.style.flexBasis = 'auto';
            
            // For the main container, ensure it's wide enough
            if (element === previewRef.current) {
              element.style.width = 'auto';
              element.style.minWidth = '100%';
            } else if (element.classList.contains('export-content')) {
              // For export-content, remove width constraints completely
              element.style.width = 'auto';
              element.style.minWidth = 'max-content';
            }
          }
        });
        
        // Wait a bit for layout to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const dataUrl = await htmlToImage.toPng(previewRef.current, {
          backgroundColor: 'transparent',
          pixelRatio: 2, // Higher quality
          skipAutoScale: true
        });
        
        // Restore original styles
        elementsToAdjust.forEach(element => {
          if (element instanceof HTMLElement && originalStyles.has(element)) {
            const original = originalStyles.get(element);
            element.style.overflow = original.overflow;
            element.style.maxWidth = original.maxWidth;
            element.style.width = original.width;
            element.style.whiteSpace = original.whiteSpace;
            element.style.wordWrap = original.wordWrap;
            element.style.minWidth = original.minWidth;
            element.style.flexShrink = original.flexShrink;
            element.style.flexBasis = original.flexBasis;
          }
        });
        
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
          style={{ width: "calc(100% - 300px)", height: "100%" }}
          gutterAlign="start"
          gutterSize={10}
        >
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <ErrorBoundary>
              <MarkdownEditor />
            </ErrorBoundary>
          </div>
          <div style={{ height: "100%" }}>
            <ErrorBoundary>
              <CardPreview ref={previewRef} />
            </ErrorBoundary>
          </div>
        </Split>
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
