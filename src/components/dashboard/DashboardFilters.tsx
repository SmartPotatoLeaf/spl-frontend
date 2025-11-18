import { useStore } from '@nanostores/react';
import {dashboardStore, setDashboardFilters, } from '@/stores';
import Filters from "@/components/shared/Filters.tsx";
import {useEffect, useState} from "react";

export default function DashboardFilters() {
  const { filters, plots } = useStore(dashboardStore);

  const [dateFrom, setDateFrom] = useState(filters.dateFrom);
  const [dateTo, setDateTo] = useState(filters.dateTo);
  const [severity, setSeverity] = useState(filters.severity);
  const [plot, setPlot] = useState(filters.plotId);

  useEffect(() => {
    setDateFrom(filters.dateFrom || "");
    setDateTo(filters.dateTo || "");
    setSeverity(filters.severity);
    setPlot(filters.plotId);
  }, [filters]);

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    if (dateTo && value && dateTo < value) {
      setDateTo('');
    }
  };

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
      dateFrom: dateFrom,
      dateTo: dateTo,
      severity: severity || 'all',
      plot: plot || 'all',
      setDateFrom: handleDateFromChange,
      setDateTo: setDateTo,
      setSeverity: setSeverity,
      setPlot: setPlot,
      resetFilters: handleReset,
      applyFilters: handleApplyFilters,
      plots
    }} />
  );
}
