import React from 'react';
import { useTranslation } from 'react-i18next';

interface ItemsPerPageDropdownProps {
  currentPageSize: number;
  onPageSizeChange: (size: number) => void;
  totalElements: number;
}

const ItemsPerPageDropdown: React.FC<ItemsPerPageDropdownProps> = ({ currentPageSize, onPageSizeChange, totalElements }) => {
  const { t } = useTranslation('common');

  const pageSizeOptions = [10, 20, 50]; // Standard options

  // Add 'All' option if totalElements is known and greater than max standard option
  const options = [...pageSizeOptions];
  if (totalElements > Math.max(...pageSizeOptions)) {
    options.push(totalElements); // 'All' represented by totalElements
  }

  return (
    <div className="form-group" style={{ marginBottom: '0', display: 'inline-block', verticalAlign: 'middle' }}>
      <label htmlFor="pageSizeSelect" style={{ marginRight: '5px' }}>{t('items_per_page')}</label>
      <select
        id="pageSizeSelect"
        className="form-control"
        value={currentPageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        style={{ height: '34px', padding: '6px 12px', fontSize: '14px', width: 'auto' }}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size === totalElements ? t('all') : size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemsPerPageDropdown;