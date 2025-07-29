import { Editor } from "@monaco-editor/react";
import { useState, useRef } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink2,
  FiImage,
  FiCode,
  FiList,
  FiAlignLeft,
  FiMessageSquare,
} from "react-icons/fi";
import { TbH1, TbH2, TbH3 } from "react-icons/tb";
import useEditorStore from "../stores/editorStore";
import useThemeStore from "../stores/themeStore";

const MarkdownEditor: React.FC = () => {
  const { content, setContent } = useEditorStore();
  const { isDarkMode } = useThemeStore();
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);
  const [monacoError, setMonacoError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

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
        newText = `![${selectedText}](url)`;
        break;
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
            <FiLink2 className="w-4 h-4" />
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
      {/* Monaco Editor with fallback */}
      {monacoError ? (
        <div className="flex-1 flex flex-col">
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
  );
};

export default MarkdownEditor;
