import {map} from 'nanostores';
import type {Diagnostic} from '@/types';

export interface HistoryFilters {
  dateFrom: string;
  dateTo: string;
  severity: 'all' | 'healthy' | 'low' | 'moderate' | 'severe';
  plot: string;
  page: number;
}

export interface HistoryState {
  diagnostics: Diagnostic[];
  plots: { id: number; name: string }[];
  filters: HistoryFilters;
  isLoading: boolean;
  itemsPerPage: number;
  total: number;
}

export const historyStore = map<HistoryState>({
  diagnostics: [],
  filters: {
    dateFrom: '',
    dateTo: '',
    severity: 'all',
    plot: 'all',
    page: 1,
  },
  isLoading: false,
  itemsPerPage: 8,
  total: 0,
  plots: []
});

export function setTotal(total: number) {
  historyStore.setKey('total', total);
}

export function setPlots(plots: { id: number; name: string }[]) {
  historyStore.setKey('plots', plots);
}

export function setDiagnostics(diagnostics: Diagnostic[]) {
  historyStore.setKey('diagnostics', diagnostics);
}

export function setFilters(filters: Partial<HistoryFilters>) {
  const currentFilters = historyStore.get().filters;
  historyStore.setKey('filters', {...currentFilters, ...filters, page: 1});
}

export function setPage(page: number) {
  const currentFilters = historyStore.get().filters;
  historyStore.setKey('filters', {...currentFilters, page});
}

export function resetFilters() {
  historyStore.setKey('filters', {
    dateFrom: '',
    dateTo: '',
    severity: 'all',
    plot: 'all',
    page: 1,
  });
}

export function setLoading(isLoading: boolean) {
  historyStore.setKey('isLoading', isLoading);
}

