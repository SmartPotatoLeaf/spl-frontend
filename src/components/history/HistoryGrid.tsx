import {useTranslation} from 'react-i18next';
import DiagnosticCard from './DiagnosticCard';
import Pagination from "@/components/shared/Pagination.tsx";
import {historyStore, setPage} from "@/stores";
import {useStore} from "@nanostores/react";

export default function HistoryGrid() {
  const {t} = useTranslation(),
    {filters, itemsPerPage, diagnostics, total} = useStore(historyStore);

  function onPageChange(page: number) {
    setPage(page)
  }

  if (diagnostics.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-inbox text-5xl text-state-disabled mb-4"></i>
        <p className="text-state-disabled">{t('history.grid.noResults')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {diagnostics.map((diagnostic) => (
          <DiagnosticCard key={diagnostic.id.toString()} diagnostic={diagnostic} />
        ))}
      </div>
      <Pagination currentPage={filters.page} total={total} itemsPerPage={itemsPerPage} onPageChange={onPageChange}/>
    </>
  );
}
