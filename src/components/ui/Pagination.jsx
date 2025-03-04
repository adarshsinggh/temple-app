import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  siblingCount = 1,
  className = ''
}) => {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate page range to show
  const generatePaginationItems = () => {
    // Always show first page, last page, current page, and siblings
    const firstPage = 1;
    const lastPage = totalPages;
    
    let startPage = Math.max(currentPage - siblingCount, firstPage);
    let endPage = Math.min(currentPage + siblingCount, lastPage);
    
    // Adjust if we're at the start or end
    if (currentPage <= siblingCount + 1) {
      endPage = Math.min(siblingCount * 2 + 1, lastPage);
    } else if (currentPage >= lastPage - siblingCount) {
      startPage = Math.max(lastPage - siblingCount * 2, firstPage);
    }
    
    // Generate page numbers
    const pages = range(startPage, endPage);
    
    // Add ellipsis if needed
    const result = [];
    
    if (startPage > firstPage) {
      result.push(firstPage);
      if (startPage > firstPage + 1) {
        result.push('...');
      }
    }
    
    result.push(...pages);
    
    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        result.push('...');
      }
      result.push(lastPage);
    }
    
    return result;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`pagination-container ${className}`}>
      <div className="pagination-info">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>
        
        {generatePaginationItems().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
          ) : (
            <button
              key={`page-${page}`}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          className="pagination-button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;