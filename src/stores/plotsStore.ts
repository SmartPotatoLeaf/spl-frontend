import { map } from 'nanostores';
import type { PlotSummary } from '@/types';

export interface PlotsState {
  plots: PlotSummary[];
  isLoading: boolean;
  selectedPlot: PlotSummary | null;
}

export const plotsStore = map<PlotsState>({
  plots: [],
  isLoading: true,
  selectedPlot: null,
});

export function setPlotsData(plots: PlotSummary[]) {
  plotsStore.setKey('plots', plots);
  plotsStore.setKey('isLoading', false);
}

export function setLoading(isLoading: boolean) {
  plotsStore.setKey('isLoading', isLoading);
}

export function setSelectedPlot(plot: PlotSummary | null) {
  plotsStore.setKey('selectedPlot', plot);
}

export function addPlot(plot: PlotSummary) {
  const currentPlots = plotsStore.get().plots;
  plotsStore.setKey('plots', [...currentPlots, plot]);
}

export function updatePlot(updatedPlot: PlotSummary) {
  const currentPlots = plotsStore.get().plots;
  const updatedPlots = currentPlots.map(plot => 
    plot.id === updatedPlot.id ? updatedPlot : plot
  );
  plotsStore.setKey('plots', updatedPlots);
}

export function deletePlot(plotId: bigint) {
  const currentPlots = plotsStore.get().plots;
  const filteredPlots = currentPlots.filter(plot => plot.id !== plotId);
  plotsStore.setKey('plots', filteredPlots);
}
