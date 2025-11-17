import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@nanostores/react';
import { historyStore, setFilters, resetFilters } from '@/stores';
import Filters from "@/components/shared/Filters.tsx";



export default function HistoryFilters() {
  const { t } = useTranslation();
  const { filters, plots } = useStore(historyStore);

  const [dateFrom, setDateFrom] = useState(filters.dateFrom);
  const [dateTo, setDateTo] = useState(filters.dateTo);
  const [severity, setSeverity] = useState(filters.severity);
  const [plot, setPlot] = useState(filters.plot);

  useEffect(() => {
    setDateFrom(filters.dateFrom);
    setDateTo(filters.dateTo);
    setSeverity(filters.severity);
    setPlot(filters.plot);
  }, [filters]);

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    if (dateTo && value && dateTo < value) {
      setDateTo('');
    }
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      dateFrom,
      dateTo,
      severity: severity as any,
      plot,
    });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  return (
    <Filters options={{
      dateFrom: dateFrom,
      dateTo: dateTo,
      severity: severity,
      plot: plot,
      setDateFrom: handleDateFromChange,
      setDateTo: setDateTo,
      setSeverity: setSeverity,
      setPlot: setPlot,
      applyFilters: handleApplyFilters,
      resetFilters: handleResetFilters,
      plots: plots,
    }} />
  );
}
