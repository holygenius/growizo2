import React from 'react';
import { X, Save, RefreshCw } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import styles from '../Admin.module.css';

/**
 * Reusable Admin Form Panel Component with common styling
 */
const FormPanel = ({ 
    title, 
    onClose, 
    onSubmit, 
    loading, 
    children,
    submitLabel = null,
    showCancel = true
}) => {
    const { t } = useAdmin();

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{title}</h3>
                <button onClick={onClose} className={styles.iconBtn}>
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ 
                display: 'grid', 
                gap: '1.5rem', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' 
            }}>
                {children}

                <div style={{ 
                    gridColumn: '1 / -1', 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '1rem', 
                    marginTop: '1rem' 
                }}>
                    {showCancel && (
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className={styles.actionBtn} 
                            style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}
                        >
                            {t('cancel')}
                        </button>
                    )}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className={styles.actionBtn} 
                        style={{ 
                            flexDirection: 'row', 
                            padding: '0.75rem 1.5rem', 
                            height: 'auto', 
                            background: '#10b981', 
                            color: '#fff', 
                            border: 'none' 
                        }}
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {submitLabel || t('save')}
                    </button>
                </div>
            </form>
        </div>
    );
};

/**
 * Form Input Field Component
 */
export const FormInput = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder = '', 
    required = false,
    fullWidth = false,
    helpText = null,
    error = null
}) => {
    return (
        <div className={styles.inputGroup} style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>
                {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, 
                    color: '#fff', 
                    borderRadius: '0.5rem' 
                }}
            />
            {error && <small style={{ color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{error}</small>}
            {helpText && !error && <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>{helpText}</small>}
        </div>
    );
};

/**
 * Form Select Field Component
 */
export const FormSelect = ({ 
    label, 
    value, 
    onChange, 
    options = [], 
    placeholder = '',
    required = false,
    fullWidth = false
}) => {
    return (
        <div className={styles.inputGroup} style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>
                {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: '#fff', 
                    borderRadius: '0.5rem' 
                }}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt, idx) => (
                    <option key={opt.value ?? idx} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

/**
 * Form Textarea Field Component
 */
export const FormTextarea = ({ 
    label, 
    value, 
    onChange, 
    rows = 3,
    placeholder = '',
    required = false,
    fullWidth = true,
    helpText = null
}) => {
    return (
        <div className={styles.inputGroup} style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>
                {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                required={required}
                style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: '#fff', 
                    borderRadius: '0.5rem',
                    resize: 'vertical'
                }}
            />
            {helpText && <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>{helpText}</small>}
        </div>
    );
};

/**
 * Form Checkbox Field Component
 */
export const FormCheckbox = ({ label, checked, onChange }) => {
    return (
        <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: '#fff', 
            cursor: 'pointer' 
        }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem' }}
            />
            {label}
        </label>
    );
};

/**
 * Form Options Row (for checkboxes and small inputs in a row)
 */
export const FormOptionsRow = ({ children }) => {
    return (
        <div style={{ 
            gridColumn: '1 / -1', 
            display: 'flex', 
            gap: '2rem', 
            alignItems: 'center', 
            background: 'rgba(255,255,255,0.02)', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            flexWrap: 'wrap'
        }}>
            {children}
        </div>
    );
};

/**
 * Localized Input Pair (for en/tr fields)
 */
export const LocalizedInput = ({ 
    labelEn, 
    labelTr, 
    valueEn, 
    valueTr, 
    onChangeEn, 
    onChangeTr,
    required = false,
    type = 'text'
}) => {
    return (
        <>
            <FormInput
                label={labelEn}
                type={type}
                value={valueEn}
                onChange={onChangeEn}
                required={required}
            />
            <FormInput
                label={labelTr}
                type={type}
                value={valueTr}
                onChange={onChangeTr}
                required={required}
            />
        </>
    );
};

export default FormPanel;
