import type {DashboardData, DashboardFilters, DashboardStats, LabelsCount, TrendDataPoint} from "@/types";
import {getDashboardSummary} from "@/services/dashboardService.ts";

function toISODate(date: string | undefined | null | Date) {
  if (!date)
    return undefined

  return new Date(date).toISOString() || undefined;
}

export function createTrendDataset(data: TrendDataPoint[], t: (key: string) => string) {
  return {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: t('dashboard.categories.healthy'),
        data: data.map(d => d.healthy),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('dashboard.categories.low'),
        data: data.map(d => d.low),
        borderColor: '#F4B400',
        backgroundColor: 'rgba(244, 180, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('dashboard.categories.moderate'),
        data: data.map(d => d.moderate),
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('dashboard.categories.severe'),
        data: data.map(d => d.severe),
        borderColor: '#D32F2F',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }
}

export async function loadDashboardData(filters: DashboardFilters) {
  const data = await getDashboardSummary({
    min_date: toISODate(filters.dateFrom),
    max_date: toISODate(filters.dateTo),
    plot_ids: filters.plotId === "all" ? undefined : [
      !filters.plotId ? undefined : (+filters.plotId),
    ],
    labels: filters.severity === "all" || !filters.severity ? undefined : [
      filters.severity === "moderate" ? "mild" : filters.severity,
    ]
  });

  function countLabels(labels: LabelsCount[]) {
    const summary: any = {
      healthy: 0,
      low: 0,
      moderate: 0,
      severe: 0,
    };

    labels.forEach(label => {
      let name = label.label.name;
      name = name === "mild" ? "moderate" : name;
      summary[name] = label.count;
    })

    return summary;
  }

  const summary = countLabels(data.labels_count),
    labelsTrend: TrendDataPoint[] = data.diagnosis_distribution.map(el => {
      const values = countLabels(el.labels_count);
      values["month"] = el.month;

      return values;
    });

  summary["total"] = data.total;
  return {
    stats: <DashboardStats>{
      weekStats: {},
      generalStats: {
        healthyPercentage: data.total === 0 ? 0 : (data.labels_count.find(el => el.label.name === "healthy")?.count ?? 0 / data.total) * 100,
      },
      severityAverage: {
        value: data.mean_severity,
      },
      summary: summary,
      totalPlots: data.plot_count
    },
    trends: labelsTrend,
  };
}
