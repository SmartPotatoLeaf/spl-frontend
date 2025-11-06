import { map } from 'nanostores';
import type { Diagnostic } from '@/types';

export interface HistoryFilters {
  dateFrom: string;
  dateTo: string;
  severity: 'all' | 'healthy' | 'low' | 'moderate' | 'severe';
  plot: string;
  page: number;
}

export interface HistoryState {
  allDiagnostics: Diagnostic[];
  filteredDiagnostics: Diagnostic[];
  filters: HistoryFilters;
  isLoading: boolean;
  itemsPerPage: number;
}

export const historyStore = map<HistoryState>({
  allDiagnostics: [],
  filteredDiagnostics: [],
  filters: {
    dateFrom: '',
    dateTo: '',
    severity: 'all',
    plot: 'all',
    page: 1,
  },
  isLoading: false,
  itemsPerPage: 8,
});

export function setDiagnostics(diagnostics: Diagnostic[]) {
  historyStore.setKey('allDiagnostics', diagnostics);
  applyFilters();
}

export function setFilters(filters: Partial<HistoryFilters>) {
  const currentFilters = historyStore.get().filters;
  historyStore.setKey('filters', { ...currentFilters, ...filters, page: 1 });
  applyFilters();
}

export function setPage(page: number) {
  const currentFilters = historyStore.get().filters;
  historyStore.setKey('filters', { ...currentFilters, page });
}

export function resetFilters() {
  historyStore.setKey('filters', {
    dateFrom: '',
    dateTo: '',
    severity: 'all',
    plot: 'all',
    page: 1,
  });
  applyFilters();
}

export function setLoading(isLoading: boolean) {
  historyStore.setKey('isLoading', isLoading);
}

function applyFilters() {
  const { allDiagnostics, filters } = historyStore.get();
  let filtered = [...allDiagnostics];

  // Filtrar por severidad
  if (filters.severity !== 'all') {
    filtered = filtered.filter(d => d.status === filters.severity);
  }

  // Filtrar por parcela
  if (filters.plot !== 'all') {
    filtered = filtered.filter(d => d.location === filters.plot);
  }

  // Filtrar por rango de fechas
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter(d => {
      const diagDate = new Date(d.predictedAt);
      diagDate.setHours(0, 0, 0, 0);
      return diagDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(d => {
      const diagDate = new Date(d.predictedAt);
      return diagDate <= toDate;
    });
  }

  historyStore.setKey('filteredDiagnostics', filtered);
}
