import { useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import ChartModal from '@/components/shared/ChartModal';
import type { TrendDataPoint, DiagnosticSummary } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardChartsProps {
  trendData: TrendDataPoint[];
  summary: DiagnosticSummary;
}

type ChartType = 'trend' | 'distribution' | null;

export default function DashboardCharts({ trendData, summary }: DashboardChartsProps) {
  const [expandedChart, setExpandedChart] = useState<ChartType>(null);

  const handleExpandChart = (chartType: ChartType) => {
    setExpandedChart(chartType);
  };

  const handleCloseModal = () => {
    setExpandedChart(null);
  };

  const trendChartData = {
    labels: trendData.map(d => d.month),
    datasets: [
      {
        label: 'Sin rancha',
        data: trendData.map(d => d.healthy),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Rancha leve',
        data: trendData.map(d => d.low),
        borderColor: '#F4B400',
        backgroundColor: 'rgba(244, 180, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Rancha moderada',
        data: trendData.map(d => d.moderate),
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Rancha severa',
        data: trendData.map(d => d.severe),
        borderColor: '#D32F2F',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const distributionChartData = {
    labels: ['Sin rancha', 'Rancha leve', 'Rancha moderada', 'Rancha severa'],
    datasets: [
      {
        data: [summary.healthy, summary.low, summary.moderate, summary.severe],
        backgroundColor: ['#4CAF50', '#A4C400', '#F4B400', '#D32F2F'],
        borderWidth: 0,
      },
    ],
  };

  const distributionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const total = summary.total;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const distributionChartOptionsModal = {
    ...distributionChartOptions,
    cutout: '75%',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-state-idle">Tendencia de diagnósticos</h3>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              title="Descargar"
            >
              <i className="fas fa-download text-state-disabled"></i>
            </button>
            <button
              onClick={() => handleExpandChart('trend')}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              title="Expandir"
            >
              <i className="fas fa-expand-alt text-state-disabled"></i>
            </button>
          </div>
        </div>
        <div className="h-[300px] sm:h-[350px]">
          <Line data={trendChartData} options={trendChartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-state-idle">Distribución de diagnósticos</h3>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              title="Descargar"
            >
              <i className="fas fa-download text-state-disabled"></i>
            </button>
            <button
              onClick={() => handleExpandChart('distribution')}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              title="Expandir"
            >
              <i className="fas fa-expand-alt text-state-disabled"></i>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-1/2 h-[250px] flex items-center justify-center">
            <div className="relative w-[200px] h-[200px]">
              <Doughnut data={distributionChartData} options={distributionChartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-state-disabled">Total</span>
                <span className="text-2xl font-bold text-state-idle">{summary.total}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline">
                  <th className="text-left py-2 font-medium text-state-disabled">Severidad</th>
                  <th className="text-right py-2 font-medium text-state-disabled">Diagnósticos</th>
                  <th className="text-right py-2 font-medium text-state-disabled">%</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-outline">
                  <td className="py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tag-healthy"></div>
                    <span className="text-state-idle">Sin rancha</span>
                  </td>
                  <td className="text-right text-state-idle font-medium">{summary.healthy}</td>
                  <td className="text-right text-state-disabled">
                    {((summary.healthy / summary.total) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="border-b border-outline">
                  <td className="py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tag-low"></div>
                    <span className="text-state-idle">Rancha leve</span>
                  </td>
                  <td className="text-right text-state-idle font-medium">{summary.low}</td>
                  <td className="text-right text-state-disabled">
                    {((summary.low / summary.total) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="border-b border-outline">
                  <td className="py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tag-mid"></div>
                    <span className="text-state-idle">Rancha moderada</span>
                  </td>
                  <td className="text-right text-state-idle font-medium">{summary.moderate}</td>
                  <td className="text-right text-state-disabled">
                    {((summary.moderate / summary.total) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tag-severe"></div>
                    <span className="text-state-idle">Rancha severa</span>
                  </td>
                  <td className="text-right text-state-idle font-medium">{summary.severe}</td>
                  <td className="text-right text-state-disabled">
                    {((summary.severe / summary.total) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Tendencia */}
      <ChartModal
        isOpen={expandedChart === 'trend'}
        onClose={handleCloseModal}
        title="Tendencia de diagnósticos"
      >
        <div className="h-[500px]">
          <Line data={trendChartData} options={trendChartOptions} />
        </div>
      </ChartModal>

      {/* Modal de Distribución */}
      <ChartModal
        isOpen={expandedChart === 'distribution'}
        onClose={handleCloseModal}
        title="Distribución de diagnósticos"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8 p-4">
          <div className="w-full lg:w-1/2 h-[400px] flex items-center justify-center">
            <div className="relative w-[350px] h-[350px]">
              <Doughnut data={distributionChartData} options={distributionChartOptionsModal} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-state-disabled">Total</span>
                <span className="text-4xl font-bold text-state-idle">{summary.total}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-outline">
                  <th className="text-left py-3 font-medium text-state-disabled">Severidad</th>
                  <th className="text-right py-3 font-medium text-state-disabled">Diagnósticos</th>
                  <th className="text-right py-3 font-medium text-state-disabled">%</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-outline">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-tag-healthy"></div>
                    <span className="text-state-idle">Sin rancha</span>
                  </td>
                  <td className="text-right text-state-idle font-medium text-lg">{summary.healthy}</td>
                  <td className="text-right text-state-disabled">
                    {((summary.healthy / summary.total) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="border-b border-outline">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-tag-low"></div>
                    <span className="text-state-idle">Rancha leve</span>
                  </td>
                  <td className="text-right text-state-idle font-medium text-lg">{summary.low}</td>
                  <td className="text-right text-state-disabled">
                    {((summary.low / summary.total) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="border-b border-outline">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-tag-mid"></div>
                    <span className="text-state-idle">Rancha moderada</span>
                  </td>
                  <td className="text-right text-state-idle font-medium text-lg">{summary.moderate}</td>
                  <td className="text-right text-state-disabled">
                    {((summary.moderate / summary.total) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-tag-severe"></div>
                    <span className="text-state-idle">Rancha severa</span>
                  </td>
                  <td className="text-right text-state-idle font-medium text-lg">{summary.severe}</td>
                  <td className="text-right text-state-disabled">
                    {((summary.severe / summary.total) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ChartModal>
    </div>
  );
}
