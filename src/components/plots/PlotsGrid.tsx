import {useStore} from '@nanostores/react';
import {useTranslation} from 'react-i18next';
import {plotsStore, toast} from '@/stores';
import {useEffect, useState} from 'react';
import Pagination from "@/components/shared/Pagination.tsx";
import useQueryParam from "@/hooks/useQueryParam.ts";
import {deletePlot, getPlots} from "@/services/plotService.ts";
import type {PlotDetailed, PlotPaginatedResponse} from "@/types";


export default function PlotsGrid() {
  const {t} = useTranslation();
  const [pagination, setPagination] = useState({
      total: 0,
      items: [],
      limit: 10,
      page: 1,
    } as PlotPaginatedResponse),
    [currentPage, setCurrentPage] = useQueryParam("page", "1"),
    [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  function loadPlots() {
    getPlots({
      page: (+currentPage) as number,
      limit: itemsPerPage,
    }).then(response => {
      setPagination(response);
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
    })
  }

  useEffect(() => {
    loadPlots();
  }, [currentPage])


  const formatDate = (date: Date): string => {
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    if(typeof date === 'string')
      date = new Date(date);

    const monthKey = monthKeys[date.getMonth()];
    const monthName = t(`plots.months.${monthKey}`);
    return `${date.getDate()} de ${monthName}, ${date.getFullYear()}`;
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page as any);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  function PlotActions({plot}: { plot: PlotDetailed }) {
    return (
      <>
        <a
          href={`/plots/${plot.id ? plot.id : 'default'}`}
          className="text-primary hover:text-opacity-80 transition-colors"
          title={t('plots.table.viewDetails')}
        >
          <i className="fas fa-eye"></i>
        </a>
        {
          plot.id && <a
            href={`/plots/${plot.id}/edit`}
            className="text-state-idle hover:text-primary transition-colors"
            title={t('plots.table.edit')}
          >
            <i className="fas fa-edit"></i>
          </a>
        }
        {
          plot.id && (
            <button
              className="text-error hover:text-opacity-80 transition-colors"
              title={t('plots.table.delete')}
              onClick={() => {
                if (plot.id && confirm(t('plots.deleteConfirm', {name: plot.name}))) {
                  deletePlot(plot.id)
                    .then(_ => {
                      loadPlots()
                      toast.success("Parcela eliminada correctamente.")
                    })
                    .catch(_ => {
                      toast.error("Non se pudo eliminar a parcela.")
                    })
                }
              }}
            >
              <i className="fas fa-trash"></i>
            </button>
          )
        }
      </>
    )
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (pagination.items.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-map-marked-alt text-5xl text-state-disabled mb-4"></i>
        <p className="text-state-disabled text-lg mb-2">{t('plots.empty.title')}</p>
        <p className="text-state-disabled text-sm">{t('plots.empty.subtitle')}</p>
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
              {t('plots.table.name')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-state-disabled uppercase tracking-wider">
              {t('plots.table.diagnostics')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-state-disabled uppercase tracking-wider">
              {t('plots.table.description')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-state-disabled uppercase tracking-wider">
              {t('plots.table.lastDiagnostic')}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-state-disabled uppercase tracking-wider">
              {t('plots.table.actions')}
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-outline">
          {pagination.items.map((plot) => (
            <tr key={(plot.id ?? 0).toString()} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-state-idle">
                  {plot.id ? plot.name : t("plots.default.name")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-state-idle">{plot.total_diagnosis}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-state-disabled max-w-md truncate">
                  {plot.id ? plot.description : t("plots.default.description")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-state-disabled">
                  {plot.last_diagnosis ? formatDate(plot.last_diagnosis) : '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center gap-3">
                  <PlotActions plot={plot}/>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {pagination.items.map((plot) => (
          <div key={(plot.id ?? 0).toString()} className="bg-white rounded-lg border border-outline p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-state-idle mb-1">{plot.name}</h3>
                <p
                  className="text-xs text-state-disabled mb-2">{plot.total_diagnosis} {t('plots.table.diagnostics').toLowerCase()}</p>
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
                <div
                  className="hidden absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-outline z-10">
                  <PlotActions plot={plot}/>

                </div>
              </div>
            </div>
            <p className="text-sm text-state-disabled mb-3 line-clamp-2">{plot.description}</p>
            <div className="text-xs text-state-disabled">
              {plot.last_diagnosis ? (
                <span>{t('plots.table.lastDiagnostic')}: {formatDate(plot.last_diagnosis!)}</span>
              ) : (
                <span>{t('plots.details.noDiagnostics')}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginador */}
      <Pagination currentPage={(+currentPage)} total={pagination.total} itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}/>
    </>
  );
}
