import React, { useState, useEffect } from 'react';
import styles from '../Admin.module.css';

const JsonEditor = ({ label, value, onChange, height = '200px', helpText }) => {
    const [jsonString, setJsonString] = useState('{}');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only update from props if the passed object is different from what we parsed last time
        // This is a naive check but helps avoid cursor jumping if we were to parse on every change
        if (value && typeof value === 'object') {
            try {
                const current = JSON.stringify(value, null, 2);
                if (current !== jsonString && current !== JSON.stringify(JSON.parse(jsonString || '{}'), null, 2)) {
                    setJsonString(current);
                }
            } catch (e) {
                // ignore
            }
        }
    }, [value]);

    // Initial load
    useEffect(() => {
        if (value) {
            setJsonString(JSON.stringify(value, null, 2));
        }
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setJsonString(val);

        try {
            const parsed = JSON.parse(val);
            setError(null);
            onChange(parsed);
        } catch (err) {
            setError(err.message);
            // Don't propagate invalid JSON changes up, or pass null? 
            // Better to not pass, so parent state stays valid.
        }
    };

    return (
        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{label}</label>
            <textarea
                value={jsonString}
                onChange={handleChange}
                spellCheck={false}
                style={{
                    width: '100%',
                    height: height,
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                    color: '#e2e8f0',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    borderRadius: '0.5rem',
                    resize: 'vertical'
                }}
            />
            {error && <small style={{ color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>Invalid JSON: {error}</small>}
            {helpText && !error && <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>{helpText}</small>}
        </div>
    );
};

export default JsonEditor;
