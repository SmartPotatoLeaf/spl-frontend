import {useTranslation} from "react-i18next";

export interface PaginationProps {
  currentPage: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({total, currentPage, itemsPerPage, onPageChange}: PaginationProps) {
  const {t} = useTranslation();
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };
  return (
    <div className="flex items-center justify-between pt-4 border-t border-outline">
      <p className="text-sm text-state-disabled">
        {t('history.grid.showing')} {startIndex + 1} - {Math.min(endIndex, total)} {t('history.grid.of')} {total} {t('history.grid.diagnostics')}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title={t('history.grid.firstPage')}
          >
            <i className="fas fa-angle-double-left text-xs"></i>
          </button>

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title={t('history.grid.previousPage')}
          >
            <i className="fas fa-chevron-left text-xs"></i>
          </button>

          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'border border-outline hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={`ellipsis-${index}`} className="px-2 text-state-disabled">
                  {page}
                </span>
            )
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title={t('history.grid.nextPage')}
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title={t('history.grid.lastPage')}
          >
            <i className="fas fa-angle-double-right text-xs"></i>
          </button>
        </div>
      )}
    </div>
  )
}
