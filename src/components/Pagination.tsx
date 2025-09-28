import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers: (number | string)[] = [];
  const maxPageButtons = 5; // Max number of page buttons to show

  if (totalPages <= maxPageButtons) {
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(0, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(0, endPage - maxPageButtons + 1);
    }

    if (startPage > 0) {
      pageNumbers.push(0);
      if (startPage > 1) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) pageNumbers.push('...');
      pageNumbers.push(totalPages - 1);
    }
  }

  return (
    <nav aria-label="Page navigation" className="text-center" style={{ marginTop: '20px' }}>
      <ul className="pagination" style={{ display: 'inline-flex', paddingLeft: 0, margin: '20px 0', borderRadius: '4px' }}>
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous"
            style={{ position: 'relative', float: 'left', padding: '6px 12px', lineHeight: '1.42857143', textDecoration: 'none', color: '#2098f3', backgroundColor: '#fff', border: '1px solid #ddd', marginLeft: '-1px' }}
          >
            <ChevronLeft size={16} />
          </button>
        </li>
        {pageNumbers.map((pageNumber, index) => (
          <li key={index} className={`page-item ${pageNumber === '...' ? 'disabled' : ''} ${currentPage === pageNumber ? 'active' : ''}`}>
            {pageNumber === '...' ? (
              <span className="page-link" style={{ position: 'relative', float: 'left', padding: '6px 12px', lineHeight: '1.42857143', textDecoration: 'none', color: '#777', backgroundColor: '#fff', border: '1px solid #ddd', marginLeft: '-1px' }}>
                ...
              </span>
            ) : (
              <button
                className="page-link"
                onClick={() => onPageChange(pageNumber as number)}
                style={{ position: 'relative', float: 'left', padding: '6px 12px', lineHeight: '1.42857143', textDecoration: 'none', color: '#2098f3', backgroundColor: '#fff', border: '1px solid #ddd', marginLeft: '-1px', ...(currentPage === pageNumber && { backgroundColor: '#2098f3', borderColor: '#2098f3', color: '#fff' }) }}
              >
                {(pageNumber as number) + 1}
              </button>
            )}
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            aria-label="Next"
            style={{ position: 'relative', float: 'left', padding: '6px 12px', lineHeight: '1.42857143', textDecoration: 'none', color: '#2098f3', backgroundColor: '#fff', border: '1px solid #ddd', marginLeft: '-1px' }}
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;