import { Editor } from "@monaco-editor/react";
import { useState, useRef, useCallback, useEffect } from "react";
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
  FiArrowUp,
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

  // Function to scroll editor to top
  const scrollToTop = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.setScrollTop(0);
      editor.setPosition({ lineNumber: 1, column: 1 });
      editor.focus();
    }
  }, []);

  // Add keyboard shortcut for scrolling to top
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Home to scroll to top
      if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [scrollToTop]);

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
          <ToolbarButton onClick={scrollToTop} title="回到顶部 (Ctrl/Cmd + Home)">
            <FiArrowUp className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col" style={{ height: "100%" }}>
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
        <div className="flex-1" style={{ height: "100%" }}>
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
               style={{ height: "100%" }}
               onMount={(editor, monaco) => {
                 editorRef.current = editor;
                 setIsMonacoLoaded(true);
                 
                 // Add some test content to ensure scrolling is possible
                 if (!content || content.length < 100) {
                   const testContent = `# Test Content for Scrolling

This is a test to ensure the Monaco editor can scroll properly.

## Section 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Section 2
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Section 3
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## Section 4
Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

## Section 5
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

## Section 6
Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.

## Section 7
Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

## Section 8
Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

## Section 9
Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

## Section 10
Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.

## Section 11
Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

## Section 12
This should be enough content to make the editor scrollable. Try scrolling with your mouse wheel or using the scrollbar on the right side of the editor.`;
                   setContent(testContent);
                 }
                 
                 // Debug: Check editor dimensions and scroll capabilities
                 console.log('Monaco Editor mounted');
                 console.log('Editor scroll height:', editor.getScrollHeight());
                 console.log('Editor client height:', editor.getLayoutInfo().height);
                 console.log('Editor scroll top:', editor.getScrollTop());
                 console.log('Can scroll:', editor.getScrollHeight() > editor.getLayoutInfo().height);
                 
                 // Add paste event listener for image handling
                 const editorDomNode = editor.getDomNode();
                 if (editorDomNode) {
                   editorDomNode.addEventListener('paste', handlePaste);
                   
                   // Ensure editor maintains focus and scroll position
                   editorDomNode.addEventListener('click', () => {
                     editor.focus();
                   });

                   // Expose Monaco Editor methods for testing with improved scroll handling
                   (editorDomNode as any).monacoScrollTo = (scrollTop: number) => {
                     editor.setScrollTop(scrollTop);
                     // Force layout update
                     editor.layout();
                   };
                   
                   (editorDomNode as any).monacoGetScrollTop = () => {
                     return editor.getScrollTop();
                   };

                   (editorDomNode as any).monacoGetScrollHeight = () => {
                     return editor.getScrollHeight();
                   };

                   (editorDomNode as any).monacoGetClientHeight = () => {
                     const layoutInfo = editor.getLayoutInfo();
                     return layoutInfo.height;
                   };

                   // Expose method to set content directly for testing
                   (editorDomNode as any).monacoSetValue = (value: string) => {
                     editor.setValue(value);
                     // Force layout update after content change
                     setTimeout(() => editor.layout(), 100);
                   };

                   // Expose method to get scrollable element
                   (editorDomNode as any).monacoGetScrollableElement = () => {
                     return editorDomNode.querySelector('.monaco-scrollable-element');
                   };
                   
                   // Debug: Check if scrollable element exists
                   const scrollableElement = editorDomNode.querySelector('.monaco-scrollable-element');
                   console.log('Scrollable element found:', !!scrollableElement);
                   if (scrollableElement) {
                     console.log('Scrollable element style:', (scrollableElement as HTMLElement).style.cssText);
                   }
                 }
                 
                 // Ensure editor can always scroll to top and maintain scroll position
                 editor.onDidChangeModelContent(() => {
                   // Maintain scroll position when content changes
                   const scrollTop = editor.getScrollTop();
                   if (scrollTop > 0) {
                     editor.setScrollTop(scrollTop);
                   }
                   // Force layout update
                   editor.layout();
                 });

                 // Handle scroll events to ensure proper scroll behavior
                 editor.onDidScrollChange(() => {
                   // Ensure scroll position is properly maintained
                   const scrollTop = editor.getScrollTop();
                   const scrollHeight = editor.getScrollHeight();
                   const clientHeight = editor.getLayoutInfo().height;
                   
                   // If we're at the bottom and content is added, stay at bottom
                   if (scrollTop + clientHeight >= scrollHeight - 10) {
                     editor.setScrollTop(scrollHeight - clientHeight);
                   }
                 });
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
                   verticalScrollbarSize: 14,
                   horizontalScrollbarSize: 14,
                   alwaysConsumeMouseWheel: true,
                   verticalHasArrows: false,
                   horizontalHasArrows: false,
                   useShadows: false,
                   verticalSliderSize: 14,
                   horizontalSliderSize: 14,
                 },
                 scrollBeyondLastLine: true,
                 automaticLayout: true,
                 overviewRulerLanes: 0,
                 smoothScrolling: true,
                 cursorSmoothCaretAnimation: "on",
                 mouseWheelScrollSensitivity: 1,
                 fastScrollSensitivity: 5,
                 // Ensure proper scroll behavior
                 scrollBeyondLastColumn: true,
                 // Improve scroll performance
                 renderWhitespace: "none",
                 // Ensure proper focus handling
                 tabFocusMode: "focus",
                 // Force scrollbars to be visible
                 fixedOverflowWidgets: true,
               }}
             />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
