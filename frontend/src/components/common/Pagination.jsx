import React from 'react';
import { Button } from './Button';

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  pageSize, 
  itemName = 'items' 
}) => {
  if (totalPages <= 1 && totalItems === 0) return null;

  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 w-full border-t border-outline-variant/20 mt-6">
      <div className="text-body-sm text-on-surface-variant">
        {totalItems > 0 ? (
          <>Showing {startItem}–{endItem} of {totalItems} {itemName}</>
        ) : (
          <>No {itemName} found</>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm mr-2"
          >
            &larr; Previous
          </Button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-on-surface-variant">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page 
                    ? 'bg-primary text-on-primary' 
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          <Button 
            variant="outline" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm ml-2"
          >
            Next &rarr;
          </Button>
        </div>
      )}
    </div>
  );
};
