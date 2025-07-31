import { Editor } from "@monaco-editor/react";
import { useState, useRef, useCallback } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiImage,
  FiCode,
  FiList,
  FiMessageSquare,
  FiAlignLeft,
  FiBarChart,
} from "react-icons/fi";
import { TbH1, TbH2, TbH3 } from "react-icons/tb";
import useEditorStore from "../stores/editorStore";
import useThemeStore from "../stores/themeStore";
import { useImageStore } from "../stores/imageStore";
import WritingStats from "./WritingStats";

const MarkdownEditor: React.FC = () => {
  const { content, setContent } = useEditorStore();
  const { isDarkMode } = useThemeStore();
  const { addImage } = useImageStore();
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);
  const [monacoError, setMonacoError] = useState<string | null>(null);

  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Insert image markdown at cursor position
  const insertImageMarkdown = useCallback((imageId: string, altText: string = "image") => {
    const editor = editorRef.current;
    if (!editor) return;

    const position = editor.getPosition();
    if (!position) return;

    // Use a clean, user-friendly reference format
    const imageMarkdown = `![${altText}](img:${imageId})`;
    
    editor.executeEdits("", [
      {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
        text: imageMarkdown,
      },
    ]);

    // Move cursor to end of inserted text
    const newPosition = {
      lineNumber: position.lineNumber,
      column: position.column + imageMarkdown.length,
    };
    editor.setPosition(newPosition);
    editor.focus();
  }, []);

  // Handle paste events for images
  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        
        const file = item.getAsFile();
        if (!file) continue;

        try {
          // Add image to store and get the ID
          const imageId = await addImage(file);
          
          // Use original filename if available, otherwise generate a name
          const altText = file.name && file.name !== 'image.png' ? 
            file.name.split('.')[0] : `pasted-image-${Date.now()}`;
          insertImageMarkdown(imageId, altText);
        } catch (error) {
          console.error('Error handling pasted image:', error);
        }
        break;
      }
    }
  }, [insertImageMarkdown, addImage]);

  // Handle file input change
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    try {
      // Add image to store and get the ID
      const imageId = await addImage(file);
      
      // Use original filename without extension as alt text
      const altText = file.name.split('.')[0] || `uploaded-image-${imageId}`;
      insertImageMarkdown(imageId, altText);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error handling selected image:', error);
    }
  }, [insertImageMarkdown, addImage]);

  // Handle paste events for textarea
  const handleTextareaPaste = useCallback(async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Check if the item is an image
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        
        const file = item.getAsFile();
        if (file) {
          try {
            const base64 = await fileToBase64(file);
            const altText = `pasted-image-${Date.now()}`;
            const imageMarkdown = `![${altText}](${base64})`;
            
            // Insert at current cursor position in textarea
            const textarea = event.target as HTMLTextAreaElement;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
            setContent(newContent);
            
            // Set cursor position after inserted text
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
              textarea.focus();
            }, 0);
          } catch (error) {
            console.error('Error converting image to base64:', error);
          }
        }
        break;
      }
    }
  }, [content, setContent, fileToBase64]);

  // Handle image button click
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFormat = (format: string) => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const selection = editor.getSelection();
    if (!selection) {
      return;
    }

    const selectedText = editor.getModel()?.getValueInRange(selection) || "";
    let newText = "";

    switch (format) {
      case "h1":
        newText = `# ${selectedText}`;
        break;
      case "h2":
        newText = `## ${selectedText}`;
        break;
      case "h3":
        newText = `### ${selectedText}`;
        break;
      case "bold":
        newText = `**${selectedText}**`;
        break;
      case "italic":
        newText = `*${selectedText}*`;
        break;
      case "underline":
        newText = `<u>${selectedText}</u>`;
        break;
      case "link":
        newText = `[${selectedText}](url)`;
        break;
      case "image":
        handleImageButtonClick();
        return;
      case "code":
        newText = selectedText.includes("\n")
          ? `\`\`\`\n${selectedText}\n\`\`\``
          : `\`${selectedText}\``;
        break;
      case "list":
        newText = selectedText
          .split("\n")
          .map((line: string) => `- ${line}`)
          .join("\n");
        break;
      case "quote":
        newText = selectedText
          .split("\n")
          .map((line: string) => `> ${line}`)
          .join("\n");
        break;
      default:
        newText = selectedText;
    }

    editor.executeEdits("", [
      {
        range: selection,
        text: newText,
      },
    ]);

    // Focus back to the editor after formatting
    editor.focus();
  };

  const ToolbarButton = ({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) => (
    <button
      onClick={onClick}
      className="p-1.5 rounded transition-colors"
      style={{
        color: 'var(--text-secondary)',
        backgroundColor: 'transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div 
      className="h-full shadow-sm overflow-hidden flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Hidden file input for image selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <div 
        className="flex items-center gap-1 p-2 border-b"
        style={{ 
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <div 
          className="flex items-center gap-1 pr-2 border-r"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <ToolbarButton onClick={() => handleFormat("h1")} title="标题 1">
            <TbH1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleFormat("h2")} title="标题 2">
            <TbH2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleFormat("h3")} title="标题 3">
            <TbH3 className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <div 
          className="flex items-center gap-1 px-2 border-r"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <ToolbarButton onClick={() => handleFormat("bold")} title="粗体">
            <FiBold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleFormat("italic")} title="斜体">
            <FiItalic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleFormat("underline")} title="下划线">
            <FiUnderline className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <div 
          className="flex items-center gap-1 px-2 border-r"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <ToolbarButton onClick={() => handleFormat("link")} title="链接">
            <FiLink className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleFormat("image")} title="图片">
            <FiImage className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleFormat("code")} title="代码">
            <FiCode className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <div className="flex items-center gap-1 px-2">
          <ToolbarButton onClick={() => handleFormat("list")} title="列表">
            <FiList className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleFormat("quote")} title="引用">
            <FiMessageSquare className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => handleFormat("align")} title="对齐">
            <FiAlignLeft className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Stats panel - always visible at top */}
        <div 
          className="border-b"
          style={{ 
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <WritingStats />
        </div>
        
        {/* Editor area */}
        <div className="flex-1">
          {/* Monaco Editor with fallback */}
          {monacoError ? (
            <div className="h-full flex flex-col">
              <div 
                className="border p-3 mb-2 rounded"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <p className="text-sm">Monaco Editor failed to load: {monacoError}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Using fallback textarea editor</p>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={handleTextareaPaste}
                className="flex-1 w-full p-4 border outline-none resize-none font-mono text-sm rounded"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Type your markdown here..."
              />
            </div>
          ) : (
            <Editor
               value={content}
               onChange={(value) => setContent(value || "")}
               language="markdown"
               theme={isDarkMode ? "vs-dark" : "light"}
               className="flex-1"
               onMount={(editor, monaco) => {
                 editorRef.current = editor;
                 setIsMonacoLoaded(true);
                 
                 // Add paste event listener for image handling
                 const editorDomNode = editor.getDomNode();
                 if (editorDomNode) {
                   editorDomNode.addEventListener('paste', handlePaste);
                 }
               }}
               loading={
                 <div 
                   className="flex items-center justify-center h-full"
                   style={{ color: 'var(--text-muted)' }}
                 >
                   <div>Loading Monaco Editor...</div>
                 </div>
               }
               options={{
                 minimap: { enabled: false },
                 fontSize: 14,
                 lineNumbers: "off",
                 wordWrap: "on",
                 contextmenu: false,
                 scrollbar: {
                   vertical: "visible",
                   horizontal: "visible",
                 },
               }}
             />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
