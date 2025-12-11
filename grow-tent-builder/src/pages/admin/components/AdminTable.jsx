import React from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../Admin.module.css';

/**
 * Reusable Admin Table Component with built-in pagination, actions, and loading states
 */
const AdminTable = ({
    columns,
    data,
    loading,
    emptyMessage,
    onEdit,
    onDelete,
    renderRow,
    showActions = true,
    pagination = null, // { page, totalPages, onPageChange }
    selectedIds = [],
    onSelectId = null,
    onSelectAll = null
}) => {
    const { t } = useAdmin();

    const showCheckboxes = onSelectId !== null;

    return (
        <div className={styles.panel}>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {showCheckboxes && (
                                <th style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.length > 0 && selectedIds.length === data.length}
                                        onChange={(e) => onSelectAll?.(e.target.checked)}
                                        style={{ width: '1rem', height: '1rem' }}
                                    />
                                </th>
                            )}
                            {columns.map((col, idx) => (
                                <th key={idx} style={col.style}>
                                    {col.header}
                                </th>
                            ))}
                            {showActions && <th>{t('actions')}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td 
                                    colSpan={columns.length + (showActions ? 1 : 0) + (showCheckboxes ? 1 : 0)} 
                                    style={{ textAlign: 'center', padding: '2rem' }}
                                >
                                    {t('loading')}
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length + (showActions ? 1 : 0) + (showCheckboxes ? 1 : 0)} 
                                    style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}
                                >
                                    {emptyMessage || t('noBuildsFound')}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIndex) => (
                                <tr key={item.id || rowIndex}>
                                    {showCheckboxes && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => onSelectId?.(item.id)}
                                                style={{ width: '1rem', height: '1rem' }}
                                            />
                                        </td>
                                    )}
                                    {renderRow ? (
                                        renderRow(item, rowIndex)
                                    ) : (
                                        columns.map((col, colIndex) => (
                                            <td key={colIndex} style={col.cellStyle}>
                                                {col.render ? col.render(item) : item[col.key]}
                                            </td>
                                        ))
                                    )}
                                    {showActions && (
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className={styles.iconBtn}
                                                        style={{ width: '2rem', height: '2rem' }}
                                                        title={t('edit')}
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className={styles.iconBtn}
                                                        style={{ width: '2rem', height: '2rem', color: '#f87171' }}
                                                        title={t('delete')}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <button
                        onClick={() => pagination.onPageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className={styles.iconBtn}
                        style={{ width: '2rem', height: '2rem', opacity: pagination.page <= 1 ? 0.5 : 1 }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className={styles.iconBtn}
                        style={{ width: '2rem', height: '2rem', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
