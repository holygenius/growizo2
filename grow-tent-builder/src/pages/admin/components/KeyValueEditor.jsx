import React, { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from './KeyValueEditor.module.css';

/**
 * KeyValueEditor - A user-friendly interface for editing key-value pairs
 * Instead of editing raw JSON, users can add/edit/remove key-value pairs visually
 * 
 * @param {Object} value - The current object value (will be converted from/to JSON)
 * @param {Function} onChange - Called with the updated object when changes are made
 * @param {string} label - Optional label for the editor
 * @param {string} keyPlaceholder - Placeholder text for key input
 * @param {string} valuePlaceholder - Placeholder text for value input
 * @param {Array} suggestedKeys - Optional array of suggested keys for autocomplete
 */
export default function KeyValueEditor({
    value = {},
    onChange,
    label,
    keyPlaceholder = 'Key (e.g., watts)',
    valuePlaceholder = 'Value (e.g., 600W)',
    suggestedKeys = []
}) {
    // Convert object to array of {key, value} pairs for easier manipulation
    const initialPairs = useMemo(() => {
        if (value && typeof value === 'object') {
            return Object.entries(value).map(([k, v]) => ({
                id: Math.random().toString(36).substr(2, 9),
                key: k,
                value: typeof v === 'object' ? JSON.stringify(v) : String(v)
            }));
        }
        return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [pairs, setPairs] = useState(initialPairs);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Convert pairs back to object and notify parent
    const notifyChange = (updatedPairs) => {
        const obj = {};
        updatedPairs.forEach(pair => {
            if (pair.key.trim()) {
                // Try to parse value as number or boolean
                let val = pair.value;
                if (val === 'true') val = true;
                else if (val === 'false') val = false;
                else if (!isNaN(val) && val.trim() !== '') val = parseFloat(val);
                obj[pair.key.trim()] = val;
            }
        });
        onChange(obj);
    };

    const handleAddPair = () => {
        if (!newKey.trim()) return;
        
        const newPair = {
            id: Math.random().toString(36).substr(2, 9),
            key: newKey.trim(),
            value: newValue
        };
        
        const updatedPairs = [...pairs, newPair];
        setPairs(updatedPairs);
        notifyChange(updatedPairs);
        
        setNewKey('');
        setNewValue('');
        setShowSuggestions(false);
    };

    const handleRemovePair = (id) => {
        const updatedPairs = pairs.filter(p => p.id !== id);
        setPairs(updatedPairs);
        notifyChange(updatedPairs);
    };

    const handleUpdatePair = (id, field, val) => {
        const updatedPairs = pairs.map(p => 
            p.id === id ? { ...p, [field]: val } : p
        );
        setPairs(updatedPairs);
        notifyChange(updatedPairs);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPair();
        }
    };

    const filteredSuggestions = suggestedKeys.filter(
        s => s.toLowerCase().includes(newKey.toLowerCase()) && 
        !pairs.some(p => p.key === s)
    );

    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            
            {/* Existing pairs */}
            <div className={styles.pairsList}>
                {pairs.length === 0 ? (
                    <div className={styles.emptyState}>
                        No specifications added yet. Add key-value pairs below.
                    </div>
                ) : (
                    pairs.map((pair, index) => (
                        <div key={pair.id} className={styles.pairRow}>
                            <span className={styles.pairIndex}>{index + 1}</span>
                            <input
                                type="text"
                                value={pair.key}
                                onChange={e => handleUpdatePair(pair.id, 'key', e.target.value)}
                                className={styles.keyInput}
                                placeholder="Key"
                            />
                            <span className={styles.separator}>:</span>
                            <input
                                type="text"
                                value={pair.value}
                                onChange={e => handleUpdatePair(pair.id, 'value', e.target.value)}
                                className={styles.valueInput}
                                placeholder="Value"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemovePair(pair.id)}
                                className={styles.removeBtn}
                                title="Remove"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add new pair */}
            <div className={styles.addRow}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={newKey}
                        onChange={e => {
                            setNewKey(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onKeyDown={handleKeyDown}
                        className={styles.newKeyInput}
                        placeholder={keyPlaceholder}
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className={styles.suggestions}>
                            {filteredSuggestions.slice(0, 5).map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    className={styles.suggestionItem}
                                    onMouseDown={() => {
                                        setNewKey(s);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.newValueInput}
                    placeholder={valuePlaceholder}
                />
                <button
                    type="button"
                    onClick={handleAddPair}
                    className={styles.addBtn}
                    disabled={!newKey.trim()}
                >
                    <Plus size={18} />
                    Add
                </button>
            </div>

            {/* Preview */}
            {pairs.length > 0 && (
                <details className={styles.jsonPreview}>
                    <summary>JSON Preview</summary>
                    <pre>{JSON.stringify(
                        pairs.reduce((acc, p) => {
                            if (p.key.trim()) {
                                let val = p.value;
                                if (val === 'true') val = true;
                                else if (val === 'false') val = false;
                                else if (!isNaN(val) && val.trim() !== '') val = parseFloat(val);
                                acc[p.key.trim()] = val;
                            }
                            return acc;
                        }, {}),
                        null, 2
                    )}</pre>
                </details>
            )}
        </div>
    );
}
