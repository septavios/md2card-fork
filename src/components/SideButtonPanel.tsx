import React from 'react';

interface SideButtonPanelProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onEditMode?: () => void;
}

const SideButtonPanel: React.FC<SideButtonPanelProps> = ({ previewRef, onEditMode }) => {
  // Download PNG file
  const handleDownloadPNG = async () => {
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
      console.error("Download failed:", error);
    }
  };

  // Copy as PNG file
  const handleCopyPNG = async () => {
    try {
      if (previewRef.current) {
        const htmlToImage = await import("html-to-image");
        const blob = await htmlToImage.toBlob(previewRef.current);
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          // You could add a toast notification here
          console.log('Image copied to clipboard');
        }
      } else {
        console.error("Preview element not found");
      }
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Add sticker to preview card
  const handleAddSticker = () => {
    // This would open a sticker picker modal or panel
    // For now, just log the action
    console.log('Add sticker feature - to be implemented');
    // You could implement a sticker picker here
  };

  // Change to edit mode
  const handleEditMode = () => {
    if (onEditMode) {
      onEditMode();
    } else {
      // Default behavior: focus on the editor
      console.log('Switch to edit mode');
    }
  };

  const buttonClass = `
    w-10 h-10 
    bg-gray-800 hover:bg-gray-700 
    border border-gray-600 
    rounded-lg 
    flex items-center justify-center 
    text-white text-lg
    transition-all duration-200 
    hover:scale-105 
    cursor-pointer
    mb-2
  `;

  return (
    <div 
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
      style={{ 
        marginRight: '340px' // Account for settings panel width + some spacing
      }}
    >
      <div className="flex flex-col space-y-2">
        {/* Download PNG */}
        <button
          onClick={handleDownloadPNG}
          className={buttonClass}
          title="Download PNG"
        >
          ⬇
        </button>

        {/* Copy PNG */}
        <button
          onClick={handleCopyPNG}
          className={buttonClass}
          title="Copy as PNG"
        >
          📋
        </button>

        {/* Add Sticker */}
        <button
          onClick={handleAddSticker}
          className={buttonClass}
          title="Add Sticker"
        >
          🏷
        </button>

        {/* Edit Mode */}
        <button
          onClick={handleEditMode}
          className={buttonClass}
          title="Edit Mode"
        >
          ✏️
        </button>
      </div>
    </div>
  );
};

export default SideButtonPanel;