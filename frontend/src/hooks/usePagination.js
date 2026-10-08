import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Reusable pagination logic.
 * Supports URL-based pagination (if useUrl is true) or local state pagination.
 */
export const usePagination = (items, pageSize = 20, useUrl = false, urlParam = 'page') => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize from URL if useUrl is true, otherwise default to 1
  const initialPage = useUrl && searchParams.get(urlParam) 
    ? parseInt(searchParams.get(urlParam), 10) 
    : 1;

  const [localPage, setLocalPage] = useState(initialPage > 0 ? initialPage : 1);

  const currentPage = useUrl ? (parseInt(searchParams.get(urlParam), 10) || 1) : localPage;

  const totalElements = items ? items.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));

  // Auto-correct page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      goToPage(totalPages);
    }
  }, [totalElements, totalPages, currentPage]);

  const paginatedItems = useMemo(() => {
    if (!items) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = (pageNumber) => {
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    
    if (useUrl) {
      setSearchParams(prevParams => {
        const newParams = new URLSearchParams(prevParams);
        if (validPage === 1) {
          newParams.delete(urlParam);
        } else {
          newParams.set(urlParam, validPage);
        }
        return newParams;
      });
    } else {
      setLocalPage(validPage);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Helper to reset to page 1 (useful when search/filter changes)
  const resetPage = () => goToPage(1);

  return {
    currentPage,
    totalPages,
    totalItems: totalElements,
    pageSize,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    isFirst: currentPage === 1,
    isLast: currentPage === totalPages,
    // Backend-compatible shape for future
    backendState: {
      content: paginatedItems,
      page: currentPage - 1,
      size: pageSize,
      totalElements,
      totalPages,
      first: currentPage === 1,
      last: currentPage === totalPages
    }
  };
};
