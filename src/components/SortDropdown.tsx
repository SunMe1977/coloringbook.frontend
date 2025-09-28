import React from 'react';
import { useTranslation } from 'react-i18next';

interface SortDropdownProps {
  currentSort: string; // e.g., "title,asc" or "updatedAt,desc"
  onSortChange: (sort: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  const { t } = useTranslation('common');

  const sortOptions = [
    { value: 'title,asc', label: t('sort_title_asc') },
    { value: 'title,desc', label: t('sort_title_desc') },
    { value: 'updatedAt,desc', label: t('sort_updated_desc') },
    { value: 'updatedAt,asc', label: t('sort_updated_asc') },
  ];

  return (
    <div className="form-group" style={{ marginBottom: '0', display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}>
      <label htmlFor="sortSelect" className="sr-only">{t('sort_by')}</label>
      <select
        id="sortSelect"
        className="form-control"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        style={{ height: '34px', padding: '6px 12px', fontSize: '14px' }}
      >
        <option disabled>{t('sort_by')}</option>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;