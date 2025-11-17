import { useStore } from '@nanostores/react';
import { useTranslation } from 'react-i18next';
import {dashboardStore, setDashboardFilters, } from '@/stores';
import Filters from "@/components/shared/Filters.tsx";
import {useEffect, useState} from "react";

export default function DashboardFilters() {
  const { t } = useTranslation();
  const { filters, plots } = useStore(dashboardStore);

  const [dateFrom, setDateFrom] = useState(filters.dateFrom);
  const [dateTo, setDateTo] = useState(filters.dateTo);
  const [severity, setSeverity] = useState(filters.severity);
  const [plot, setPlot] = useState(filters.plotId);

  useEffect(() => {
    setDateFrom(filters.dateFrom);
    setDateTo(filters.dateTo);
    setSeverity(filters.severity);
    setPlot(filters.plotId);
  }, [filters]);


  const handleReset = () => {
    setDashboardFilters({
      dateFrom: undefined,
      dateTo: undefined,
      severity: 'all',
      plotId: 'all'
    });
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setDashboardFilters({
      dateFrom,
      dateTo,
      severity: severity as any,
      plotId: plot,
    });
  };

  return (
    <Filters options={{
      dateFrom: dateFrom?.toDateString(),
      dateTo: dateTo?.toDateString(),
      severity: severity || 'all',
      plot: plot || 'all',
      setDateFrom: setDateFrom,
      setDateTo: setDateTo,
      setSeverity: setSeverity,
      setPlot: setPlot,
      resetFilters: handleReset,
      applyFilters: handleApplyFilters,
      plots
    }} />
  );
}
