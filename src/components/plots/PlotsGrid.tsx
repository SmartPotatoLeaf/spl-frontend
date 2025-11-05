import { useStore } from '@nanostores/react';
import { plotsStore } from '@/stores';
import { useState } from 'react';

export default function PlotsGrid() {
  const { plots, isLoading } = useStore(plotsStore);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDate = (date: Date): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const totalPages = Math.ceil(plots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlots = plots.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (plots.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-map-marked-alt text-5xl text-state-disabled mb-4"></i>
        <p className="text-state-disabled text-lg mb-2">No tienes parcelas registradas</p>
        <p className="text-state-disabled text-sm">Agrega tu primera parcela para comenzar a monitorear tus cultivos</p>
      </div>
    );
  }

  return (
    <>
      {/* Tabla Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-outline overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-outline">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-state-disabled uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-state-disabled uppercase tracking-wider">
                Diagnósticos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-state-disabled uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-state-disabled uppercase tracking-wider">
                Último diagnóstico
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-state-disabled uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            {paginatedPlots.map((plot) => (
              <tr key={plot.id.toString()} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-state-idle">{plot.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-state-idle">{plot.diagnosticsCount}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-state-disabled max-w-md truncate">
                    {plot.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-state-disabled">
                    {plot.lastDiagnosticDate ? formatDate(plot.lastDiagnosticDate) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={`/plots/${plot.id}`}
                      className="text-primary hover:text-opacity-80 transition-colors"
                      title="Ver detalles"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                    <a
                      href={`/plots/${plot.id}/edit`}
                      className="text-state-idle hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i>
                    </a>
                    <button
                      className="text-error hover:text-opacity-80 transition-colors"
                      title="Eliminar"
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar "${plot.name}"?`)) {
                          // TODO: deletePlot(plot.id)
                        }
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedPlots.map((plot) => (
          <div key={plot.id.toString()} className="bg-white rounded-lg border border-outline p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-state-idle mb-1">{plot.name}</h3>
                <p className="text-xs text-state-disabled mb-2">{plot.diagnosticsCount} diagnósticos</p>
              </div>
              <div className="relative">
                <button 
                  className="p-2 text-state-disabled hover:text-state-idle"
                  onClick={(e) => {
                    const menu = e.currentTarget.nextElementSibling;
                    menu?.classList.toggle('hidden');
                  }}
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>
                <div className="hidden absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-outline z-10">
                  <a
                    href={`/plots/${plot.id}`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-state-idle hover:bg-gray-50"
                  >
                    <i className="fas fa-eye text-primary w-4"></i>
                    Ver detalles
                  </a>
                  <a
                    href={`/plots/${plot.id}/edit`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-state-idle hover:bg-gray-50"
                  >
                    <i className="fas fa-edit w-4"></i>
                    Editar
                  </a>
                  <button
                    className="flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-gray-50 w-full text-left"
                    onClick={() => {
                      if (confirm(`¿Estás seguro de eliminar "${plot.name}"?`)) {
                        // TODO: deletePlot(plot.id)
                      }
                    }}
                  >
                    <i className="fas fa-trash w-4"></i>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
            <p className="text-sm text-state-disabled mb-3 line-clamp-2">{plot.description}</p>
            <div className="text-xs text-state-disabled">
              {plot.lastDiagnosticDate ? (
                <span>Último: {formatDate(plot.lastDiagnosticDate)}</span>
              ) : (
                <span>Sin diagnósticos recientes</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-outline mt-6">
          <p className="text-sm text-state-disabled">
            Mostrando {startIndex + 1} - {Math.min(endIndex, plots.length)} de {plots.length} parcelas
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              title="Primera página"
            >
              <i className="fas fa-angle-double-left text-xs"></i>
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              title="Página anterior"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>

            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              title="Página siguiente"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              title="Última página"
            >
              <i className="fas fa-angle-double-right text-xs"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
