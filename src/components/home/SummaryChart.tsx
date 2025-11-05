import type { DiagnosticSummary } from '@/types';

interface SummaryChartProps {
  summary: DiagnosticSummary;
}

export default function SummaryChart({ summary }: SummaryChartProps) {
  const total = summary.healthy + summary.low + summary.moderate + summary.severe;

  const categories = [
    {
      label: 'Sin rancha',
      count: summary.healthy,
      color: 'bg-tag-healthy',
      percentage: total > 0 ? (summary.healthy / total) * 100 : 0,
    },
    {
      label: 'Rancha leve',
      count: summary.low,
      color: 'bg-tag-low',
      percentage: total > 0 ? (summary.low / total) * 100 : 0,
    },
    {
      label: 'Rancha moderada',
      count: summary.moderate,
      color: 'bg-tag-mid',
      percentage: total > 0 ? (summary.moderate / total) * 100 : 0,
    },
    {
      label: 'Rancha severa',
      count: summary.severe,
      color: 'bg-tag-severe',
      percentage: total > 0 ? (summary.severe / total) * 100 : 0,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-outline p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-state-idle mb-6">
        Diagnósticos por categorías en los últimos 30 días
      </h3>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-state-idle font-medium">{category.label}</span>
              <span className="text-sm text-state-disabled">{category.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${category.color} rounded-full transition-all duration-500`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-outline">
        <p className="text-sm text-state-disabled">
          Total de diagnósticos: <span className="font-semibold text-state-idle">{total}</span>
        </p>
      </div>
    </div>
  );
}
