import React, { useRef, useCallback, useEffect } from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, List, ListOrdered, Link, Image, Code, Quote, Undo, Redo, Eye, EyeOff } from 'lucide-react';
import styles from './RichTextEditor.module.css';

const ToolbarButton = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${styles.toolbarBtn} ${active ? styles.active : ''}`}
    title={title}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className={styles.divider} />;

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Start writing...', 
  minHeight = '300px',
  showRawToggle = true 
}) => {
  const editorRef = useRef(null);
  const [showRaw, setShowRaw] = React.useState(false);
  // Use value directly for rawValue in controlled mode
  const rawValue = value || '';
  const prevValueRef = useRef(value);

  // Sync editor content when value changes from outside
  useEffect(() => {
    if (editorRef.current && !showRaw) {
      // Only update if content is different to avoid cursor jumping
      if (editorRef.current.innerHTML !== value && prevValueRef.current !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    prevValueRef.current = value;
  }, [value, showRaw]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange?.(html);
    }
  }, [onChange]);

  const execCommand = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleRawChange = useCallback((e) => {
    const html = e.target.value;
    onChange?.(html);
  }, [onChange]);

  const toggleRaw = () => {
    if (showRaw) {
      // Switching to visual mode - update editor content
      if (editorRef.current) {
        editorRef.current.innerHTML = rawValue;
      }
    }
    setShowRaw(!showRaw);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const formatBlock = (tag) => {
    execCommand('formatBlock', tag);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
    handleInput();
  };

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <ToolbarButton onClick={() => execCommand('bold')} title="Bold (Ctrl+B)">
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('italic')} title="Italic (Ctrl+I)">
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('underline')} title="Underline (Ctrl+U)">
            <Underline size={16} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className={styles.toolbarGroup}>
          <ToolbarButton onClick={() => formatBlock('h1')} title="Heading 1">
            <Heading1 size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock('h2')} title="Heading 2">
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock('h3')} title="Heading 3">
            <Heading3 size={16} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className={styles.toolbarGroup}>
          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock('blockquote')} title="Quote">
            <Quote size={16} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className={styles.toolbarGroup}>
          <ToolbarButton onClick={insertLink} title="Insert Link">
            <Link size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={insertImage} title="Insert Image">
            <Image size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock('pre')} title="Code Block">
            <Code size={16} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className={styles.toolbarGroup}>
          <ToolbarButton onClick={() => execCommand('undo')} title="Undo">
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('redo')} title="Redo">
            <Redo size={16} />
          </ToolbarButton>
        </div>

        {showRawToggle && (
          <>
            <ToolbarDivider />
            <div className={styles.toolbarGroup}>
              <ToolbarButton onClick={toggleRaw} active={showRaw} title={showRaw ? 'Visual Mode' : 'HTML Mode'}>
                {showRaw ? <Eye size={16} /> : <EyeOff size={16} />}
                <span className={styles.btnText}>{showRaw ? 'Visual' : 'HTML'}</span>
              </ToolbarButton>
            </div>
          </>
        )}
      </div>

      {/* Editor or Raw textarea */}
      {showRaw ? (
        <textarea
          className={styles.rawEditor}
          value={rawValue}
          onChange={handleRawChange}
          placeholder={placeholder}
          style={{ minHeight }}
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          className={styles.editor}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          style={{ minHeight }}
          suppressContentEditableWarning
        />
      )}
    </div>
  );
};

export default RichTextEditor;
