import { useStore } from '@nanostores/react';
import { historyStore, setPage } from '@/stores';
import DiagnosticCard from './DiagnosticCard';

export default function HistoryGrid() {
  const { filteredDiagnostics, filters, itemsPerPage } = useStore(historyStore);

  const totalPages = Math.ceil(filteredDiagnostics.length / itemsPerPage);
  const startIndex = (filters.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDiagnostics = filteredDiagnostics.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (paginatedDiagnostics.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-inbox text-5xl text-state-disabled mb-4"></i>
        <p className="text-state-disabled">No hay diagnósticos que coincidan con los filtros</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {paginatedDiagnostics.map((diagnostic) => (
          <DiagnosticCard key={diagnostic.predictionId.toString()} diagnostic={diagnostic} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-outline">
        <p className="text-sm text-state-disabled">
          Mostrando {startIndex + 1} - {Math.min(endIndex, filteredDiagnostics.length)} de {filteredDiagnostics.length} diagnósticos
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  page === filters.page
                    ? 'bg-primary text-white'
                    : 'border border-outline hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages}
              className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
