import React, { useState, useCallback, useMemo } from 'react';
import { Code, Eye, Languages } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import styles from './LocalizedContentEditor.module.css';
import { useAdmin } from '../../../context/AdminContext';

const LocalizedContentEditor = ({ 
  label, 
  value = { en: '', tr: '' }, 
  onChange, 
  minHeight = '200px',
  placeholder = { en: 'Write in English...', tr: 'Türkçe yazın...' },
  helpText
}) => {
  const { t } = useAdmin();
  const [activeTab, setActiveTab] = useState('en');
  const [showRawJson, setShowRawJson] = useState(false);
  const [rawJsonValue, setRawJsonValue] = useState('');
  const [jsonError, setJsonError] = useState(null);

  // Ensure value has both keys - memoized to prevent useCallback dependency issues
  const safeValue = useMemo(() => ({
    en: value?.en || '',
    tr: value?.tr || ''
  }), [value?.en, value?.tr]);

  const handleContentChange = useCallback((lang, content) => {
    onChange?.({
      ...safeValue,
      [lang]: content
    });
  }, [safeValue, onChange]);

  const handleRawJsonChange = (e) => {
    const jsonStr = e.target.value;
    setRawJsonValue(jsonStr);
    
    try {
      const parsed = JSON.parse(jsonStr);
      setJsonError(null);
      onChange?.(parsed);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const toggleRawJson = () => {
    if (!showRawJson) {
      // Going to raw mode - set initial JSON value
      setRawJsonValue(JSON.stringify(safeValue, null, 2));
      setJsonError(null);
    }
    setShowRawJson(!showRawJson);
  };

  const tabs = [
    { id: 'en', label: '🇬🇧 English', flag: '🇬🇧' },
    { id: 'tr', label: '🇹🇷 Türkçe', flag: '🇹🇷' }
  ];

  return (
    <div className={styles.container}>
      {/* Header with label and controls */}
      <div className={styles.header}>
        <label className={styles.label}>
          <Languages size={16} />
          {label}
        </label>
        <button
          type="button"
          onClick={toggleRawJson}
          className={`${styles.toggleBtn} ${showRawJson ? styles.active : ''}`}
          title={showRawJson ? t('blogPage.visualMode') || 'Visual Mode' : t('blogPage.rawJson') || 'Raw JSON'}
        >
          {showRawJson ? <Eye size={14} /> : <Code size={14} />}
          <span>{showRawJson ? 'Visual' : 'JSON'}</span>
        </button>
      </div>

      {showRawJson ? (
        /* Raw JSON Editor */
        <div className={styles.rawJsonContainer}>
          <textarea
            className={`${styles.rawJsonEditor} ${jsonError ? styles.hasError : ''}`}
            value={rawJsonValue}
            onChange={handleRawJsonChange}
            placeholder='{ "en": "...", "tr": "..." }'
            style={{ minHeight }}
            spellCheck={false}
          />
          {jsonError && (
            <div className={styles.jsonError}>
              {t('blogPage.invalidJson') || 'Invalid JSON'}: {jsonError}
            </div>
          )}
          {helpText && !jsonError && (
            <div className={styles.helpText}>{helpText}</div>
          )}
        </div>
      ) : (
        /* Tabbed Rich Text Editors */
        <div className={styles.tabbedEditor}>
          {/* Language Tabs */}
          <div className={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              >
                {tab.label}
                {safeValue[tab.id] && (
                  <span className={styles.hasContent}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Editor for each language */}
          <div className={styles.editorWrapper}>
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={styles.editorPane}
                style={{ display: activeTab === tab.id ? 'block' : 'none' }}
              >
                <RichTextEditor
                  value={safeValue[tab.id]}
                  onChange={(content) => handleContentChange(tab.id, content)}
                  placeholder={typeof placeholder === 'object' ? placeholder[tab.id] : placeholder}
                  minHeight={minHeight}
                  showRawToggle={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalizedContentEditor;
