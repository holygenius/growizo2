import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import styles from './TableFilter.module.css';

/**
 * TableFilter - Reusable filter component for admin tables
 * 
 * @param {string} searchTerm - Current search term
 * @param {function} onSearchChange - Callback when search term changes
 * @param {string} placeholder - Search input placeholder
 * @param {Array} filters - Array of filter configurations: [{ key, label, value, options: [{ value, label }] }]
 * @param {function} onFilterChange - Callback when filter changes: (key, value) => void
 * @param {number} resultCount - Number of results to display
 * @param {number} totalCount - Total items count
 */
const TableFilter = ({ 
  searchTerm = '', 
  onSearchChange, 
  placeholder = 'Search...', 
  filters = [],
  onFilterChange,
  resultCount,
  totalCount
}) => {
  const hasActiveFilters = searchTerm || filters.some(f => f.value && f.value !== 'all');

  const clearAll = () => {
    onSearchChange?.('');
    filters.forEach(f => onFilterChange?.(f.key, 'all'));
  };

  return (
    <div className={styles.container}>
      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button 
            onClick={() => onSearchChange?.('')} 
            className={styles.clearBtn}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      {filters.map(filter => (
        <div key={filter.key} className={styles.filterWrapper}>
          <Filter size={14} className={styles.filterIcon} />
          <select
            value={filter.value || 'all'}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">{filter.label}</option>
            {filter.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ))}

      {/* Result count and clear */}
      {(resultCount !== undefined && totalCount !== undefined) && (
        <div className={styles.resultInfo}>
          <span className={styles.resultCount}>
            {resultCount} / {totalCount}
          </span>
          {hasActiveFilters && (
            <button onClick={clearAll} className={styles.clearAllBtn}>
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableFilter;
