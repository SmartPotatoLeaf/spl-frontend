import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface TrendChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export function TrendChart({ data }: TrendChartProps) {
  const dataWithTension = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      tension: 0.4,
      fill: true,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Line options={options} data={dataWithTension} />
    </div>
  );
}

interface DistributionChartProps {
  data: {
    healthy: number;
    low: number;
    moderate: number;
    severe: number;
  };
}

export function DistributionChart({ data }: DistributionChartProps) {
  const total = data.healthy + data.low + data.moderate + data.severe;

  const chartData = {
    labels: ["Sin rancha", "Rancha leve", "Rancha moderada", "Rancha severa"],
    datasets: [
      {
        data: [data.healthy, data.low, data.moderate, data.severe],
        backgroundColor: [
          "#4CAF50", // tag-healthy
          "#A4C400", // tag-low
          "#F4B400", // tag-mid
          "#D32F2F", // tag-severe
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(2) : "0.00";
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const getPercentage = (value: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) : "0.00";
  };

  return (
    <div>
      <div className="relative h-64 flex items-center justify-center mb-6">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-state-disabled">Total</p>
          <p className="text-2xl font-semibold text-state-idle">{total}</p>
        </div>
      </div>

      {/* Tabla de distribución */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline">
            <th className="text-left py-2 px-3 text-sm font-medium text-state-disabled">
              Severidad
            </th>
            <th className="text-right py-2 px-3 text-sm font-medium text-state-disabled">
              Diagnósticos
            </th>
            <th className="text-right py-2 px-3 text-sm font-medium text-state-disabled">
              %
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-outline">
            <td className="py-3 px-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tag-healthy"></span>
                <span className="text-sm text-state-idle">Sin rancha</span>
              </div>
            </td>
            <td className="text-right py-3 px-3 text-sm text-state-idle font-medium">
              {data.healthy}
            </td>
            <td className="text-right py-3 px-3 text-sm text-state-disabled">
              {getPercentage(data.healthy)}%
            </td>
          </tr>

          <tr className="border-b border-outline">
            <td className="py-3 px-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tag-low"></span>
                <span className="text-sm text-state-idle">Rancha leve</span>
              </div>
            </td>
            <td className="text-right py-3 px-3 text-sm text-state-idle font-medium">
              {data.low}
            </td>
            <td className="text-right py-3 px-3 text-sm text-state-disabled">
              {getPercentage(data.low)}%
            </td>
          </tr>

          <tr className="border-b border-outline">
            <td className="py-3 px-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tag-mid"></span>
                <span className="text-sm text-state-idle">Rancha moderada</span>
              </div>
            </td>
            <td className="text-right py-3 px-3 text-sm text-state-idle font-medium">
              {data.moderate}
            </td>
            <td className="text-right py-3 px-3 text-sm text-state-disabled">
              {getPercentage(data.moderate)}%
            </td>
          </tr>

          <tr>
            <td className="py-3 px-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tag-severe"></span>
                <span className="text-sm text-state-idle">Rancha severa</span>
              </div>
            </td>
            <td className="text-right py-3 px-3 text-sm text-state-idle font-medium">
              {data.severe}
            </td>
            <td className="text-right py-3 px-3 text-sm text-state-disabled">
              {getPercentage(data.severe)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
