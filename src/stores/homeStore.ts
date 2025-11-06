import { map } from 'nanostores';
import type { DashboardStats, Diagnostic } from '@/types';

export interface HomeState {
  stats: DashboardStats | null;
  recentDiagnostics: Diagnostic[];
  isLoading: boolean;
}

export const homeStore = map<HomeState>({
  stats: null,
  recentDiagnostics: [],
  isLoading: false,
});

export function setHomeData(stats: DashboardStats, diagnostics: Diagnostic[]) {
  homeStore.setKey('stats', stats);
  homeStore.setKey('recentDiagnostics', diagnostics);
}

export function setHomeLoading(isLoading: boolean) {
  homeStore.setKey('isLoading', isLoading);
}
